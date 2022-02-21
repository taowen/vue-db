import { App, ComponentInternalInstance, computed, effect, getCurrentInstance, isVNode, KeepAlive, nextTick, onScopeDispose, Ref, ref, VNode } from 'vue';

export function pageOf(proxy: any) {
    return getPageRoot(proxy.$).proxy;
}

function getPageRoot(node: ComponentInternalInstance): ComponentInternalInstance {
    if (!node.parent || (node.parent.type as any) === KeepAlive) {
        return node;
    }
    return getPageRoot(node.parent);
}

type VueComponent = { data?: (...args: any[]) => any, methods?: any, instanceCount?: Ref<number> };
type AsVueProxy<T extends VueComponent> = (T['methods'] & ReturnType<NonNullable<T['data']>>)

export type Future<T> = { isDone: boolean, data: T, error: any }

export function load<T extends VueComponent>(componentType: T, criteria: { $parent: any } & Record<string, any>): AsVueProxy<T>;
export function load<T extends VueComponent>(componentType: T, criteria: { $root: any } & Record<string, any>): AsVueProxy<T>;
export function load<T>(resource: Resource<T>, criteria?: () => Record<string, any>): Ref<Future<T>>;
export function load(target: any, criteria: any): any {
    if (isResource(target)) {
        const refFuture = queryResource(target, criteria);
        return computed(() => {
            const future = refFuture.value;
            return { isDone: future.isDone, data: future.data[0], error: future.error }
        });
    }
    return (query(target, criteria) as any)[0];
}

export function query<T extends VueComponent>(componentType: T, criteria: { $parent: any } & Record<string, any>): AsVueProxy<T>[];
export function query<T extends VueComponent>(componentType: T, criteria: { $root: any } & Record<string, any>): AsVueProxy<T>[];
export function query<T>(resource: Resource<T>, criteria?: () => Record<string, any>): Ref<Future<T[]>>;
export function query(target: any, criteria: any): any {
    if (isResource(target)) {
        return queryResource(target, criteria);
    }
    const componentType = target;
    if (!componentType.instanceCount) {
        componentType.instanceCount = ref(0);
    }
    // will recompute when new instance created, 
    // so we can reference a component instance event it has not been created yet
    componentType.instanceCount.value;
    const result: any[] = [];
    // search components within the whole page by default
    let root = undefined;
    if (criteria.$parent) {
        root = criteria.$parent.$.subTree;
    } else if (criteria.$root) {
        root = criteria.$root.$.subTree;
        delete criteria.$root;
    } else {
        throw new Error(`must provide $parent or $root`);
    }
    _query(result, root, componentType, criteria);
    return result as any;
}

function _query(result: any[], vnode: VNode, componentType: any, criteria?: Record<string, any>) {
    if (!vnode) {
        return;
    }
    if (vnode.component) {
        if (vnode.type === componentType && checkCriteria(vnode.component.proxy, criteria)) {
            result.push(vnode.component.proxy);
        }
        _query(result, vnode.component.subTree, componentType, criteria);
    } else if (Array.isArray(vnode.children)) {
        for (const child of vnode.children) {
            if (isVNode(child)) {
                _query(result, child, componentType, criteria);
            }
        }
    }
}

function checkCriteria(proxy: any, criteria?: Record<string, any>) {
    if (!criteria) {
        return true;
    }
    for (const [k, v] of Object.entries(criteria)) {
        if (k === '$parent') {
            if (proxy.$.parent.proxy !== v) {
                return false;
            }
        } else {
            if (proxy[k] !== v) {
                return false;
            }
        }
    }
    return true;
}

export function walk(proxy: any, method: string, ...args: any[]) {
    const node: ComponentInternalInstance = proxy.$;
    walkComponent(true, method, args, node);
}

function walkVNode(method: string, args: any[], node: VNode) {
    if (node.component) {
        walkComponent(false, method, args, node.component);
    } else if (Array.isArray(node.children)) {
        for (const child of node.children) {
            if (isVNode(child)) {
                walkVNode(method, args, child);
            }
        }
    }
}

function walkComponent(isRoot: boolean, method: string, args: any[], node: ComponentInternalInstance) {
    const proxy = node.proxy as any;
    if (!isRoot && proxy[method]) {
        proxy[method].apply(proxy, args);
    } else {
        walkVNode(method, args, node.subTree);
    }
}

export function waitNextTick() {
    return new Promise<void>(resolve => {
        nextTick(resolve);
    });
}

export async function sleep(timeout: number) {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
}

export function castTo<T extends VueComponent>(proxy: any, componentType: T): AsVueProxy<T> {
    if (proxy.$.type !== componentType) {
        throw new Error('type mismatch');
    }
    return proxy;
}

export function defineCommand<F>(options: {
    command: string,
    affectedTables: string[],
    timeout?: number
}): F {
    return (() => {
        throw new Error('not implemented');
    }) as any
}

export function defineResource<T>(table: string, options?: {
    sourceTables?: string[], // if source table changed, queries of this resource will be run again
    staticCriteria?: Record<string, any>, // some part of criteria is not context dependent, we can extract them to here
    timeout?: number
}) {
    return new Resource<T>(table, options);
}

function isResource(target: any): target is Resource<any> {
    if (target.constructor === Resource) {
        return true;
    }
    return false;
}

const tableQueries: Record<string, Set<Query>> = {};
// initial page rendering will batch queries together
let batchQueries: Query[] = [];

async function flushBatchQueries() {
    await waitNextTick();
    const requests = [];
    for (const query of batchQueries) {
        requests.push(query.newRequest());
    }
    batchQueries = [];
    await rpc(requests);
}

class Query {
    // query result is a ref so that we can bind data to it
    // 1. initially it has no data, as async computation takes time
    // 2. when async query is done, the result will be updated
    // 3. when criteria changed, query will be re-run, and then the result will be changed
    // 4. when command mutates table data, queries depending on those tables will be re-run
    public result = ref({ isDone: false, data: [] as any[], error: undefined as any });
    public criteria: Record<string, any> = {};
    public version = 0;

    constructor(public resource: Resource<any>, criteriaProvider?: () => Record<string, any>) {
        // subscribe criteria via effect
        effect(() => {
            if (criteriaProvider) {
                this.criteria = criteriaProvider();
            }
            batchQueries.push(this);
            if (batchQueries.length === 1) {
                flushBatchQueries();
            }
        })
    }

    public newRequest() {
        this.version++;
        return new QueryRequest(this);
    }
}

export class Resource<T> {
    constructor(public readonly table: string, options?: {
        sourceTables?: string[],
        staticCriteria?: Record<string, any>,
        timeout?: number
    }) {
    }

    public load<N extends string, F>(fieldName: N, fieldType: Resource<F>, criteriaSource: Record<string, string>, options?: {
        staticCriteria?: Record<string, any>,
    }): Resource<T & { [P in N]: F }> {
        return this as any;
    }

    public query<N extends string, F>(fieldName: N, fieldType: Resource<F>, criteriaSource: Record<string, string>, options?: {
        staticCriteria?: Record<string, any>,
    }): Resource<T & { [P in N]: F[] }> {
        return this as any;
    }
}

function queryResource(resource: Resource<any>, criteria: () => Record<string, any>): Ref<Future<any[]>> {
    const query = new Query(resource, criteria);
    // only keep track of the query when the component instance is not unmounted
    (getCurrentInstance() as any).scope.run(() => {
        let queries = tableQueries[resource.table];
        if (!queries) {
            tableQueries[resource.table] = queries = new Set();
        }
        queries.add(query);
        onScopeDispose(() => {
            queries.delete(query);
        })
    });
    return query.result;
}

export class QueryRequest {

    private baseVersion: number;
    public criteria: Record<string, any>;

    constructor(private query: Query) {
        this.baseVersion = query.version;
        this.criteria = query.criteria;
    }

    public get resource() {
        return this.query.resource;
    }

    // avoid early request override late request
    private get isExpired() {
        return this.baseVersion === this.query.version;
    }

    public resolve(data: any[]) {
        if (this.isExpired) {
            return;
        }
        this.query.result.value = { isDone: true, data, error: undefined };
    }

    public reject(error: any) {
        if (this.isExpired) {
            return;
        }
        this.query.result.value = { isDone: true, data: [], error };
    }
}

export class CommandRequest {

    public promise: Promise<any>;
    public resolve: (result: any) => void = undefined as any;
    public reject: (error: any) => void = undefined as any;

    constructor(public command: string, public args: Record<string, any>) {
        this.promise = new Promise<any>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

async function rpc(queries: QueryRequest[], command?: CommandRequest) {
    try {
        await rpcProvider(queries, command);
    } catch (e) {
        console.error(e);
    }
}

export type RpcProvider = (queries: QueryRequest[], command?: CommandRequest) => Promise<void>

export type InstallOptions = {
    rpcProvider: RpcProvider
}

let rpcProvider: RpcProvider = () => {
    throw new Error('must call setRpcProvider before query or call');
}

export function install(app: App, options?: {
    rpcProvider: RpcProvider,
    defaultQueryTimeout?: number,
    defaultCommandTimeout?: number,
}) {
    app.mixin({
        created() {
            const componentType = this.$.type as any;
            let instanceCount = componentType.instanceCount;
            if (!instanceCount) {
                instanceCount = componentType.instanceCount = ref(0);
            }
            instanceCount.value++;
        }
    })
    if (options) {
        rpcProvider = options.rpcProvider;
    }
}