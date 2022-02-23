import { App, ComponentInternalInstance, computed, effect, getCurrentInstance, h, isRef, isVNode, KeepAlive, nextTick, onScopeDispose, readonly, Ref, ref, toRaw, VNode } from 'vue';

const vdbOptions: {
    rpcProvider: (queries: QueryRequest[], command?: CommandRequest) => Promise<void>
    hydrate?: boolean, // hydrate from ssr html, instead of fetch again
    dehydrate?: boolean, // dehydrate state as string, and inject it into rendered html
    loadingPreDelay?: number, // delay for some milliseconds before set loading to true
    loadingPostDelay?: number, // once loading set to true, delay for some milliseconds before set it back to false to avoid flashy experience
} = {
    rpcProvider() {
        throw new Error('must install with rpcProvider before query or call');
    }
}
export type InstallOptions = typeof vdbOptions;
const tableQueries: Map<string, Set<Query>> = new Map(); // used by command affectedTables

export function install(app: App, options?: InstallOptions) {
    QueryBuffer.provide(app);
    Object.assign(vdbOptions, options);
    app.mixin({
        created() {
            if (vdbOptions.dehydrate || vdbOptions.hydrate) {
                const oldRender = this.$.render;
                this.$.render = function (this: any, ...args: any[]) {
                    let vnode = oldRender.apply(this, args);
                    if (!isVNode(vnode) || typeof vnode.type !== 'string') {
                        vnode = h('div', vnode);
                    }
                    if (vdbOptions.hydrate) {
                        return vnode;
                    }
                    if (!vnode.props) {
                        vnode.props = {};
                    }
                    const hydrated: Record<string, any> = {};
                    const stale: Record<string, any> = {};
                    for (const [k, v] of Object.entries(toRaw<Record<string, Ref<Future<any>>>>(this.$.data))) {
                        if (isRef(v) && v.value && v.value.data) {
                            (v.value.stale ? stale : hydrated)[k] = v.value.data;
                        }
                    }
                    vnode.props['data-dehydrated'] = JSON.stringify(hydrated);
                    vnode.props['data-stale'] = JSON.stringify(stale);
                    return vnode;
                }
            }
            const componentType = this.$.type as any;
            let instanceCount = componentType.instanceCount;
            if (!instanceCount) {
                instanceCount = componentType.instanceCount = ref(0);
            }
            instanceCount.value++;
        },
        beforeMount() {
            if (!vdbOptions.hydrate) {
                return;
            }
            const data = toRaw(this.$.data);
            const dehydrated = JSON.parse(this.$el.dataset?.dehydrated || '{}');
            const stale = JSON.parse(this.$el.dataset?.stale || '{}');
            for (const k of Object.keys(stale)) {
                if (data[k].value._query) {
                    data[k].value._query.refresh();
                }
            }
            for (const [k, v] of Object.entries({...dehydrated, ...stale})) {
                data[k].value = { loading: false, data: v };
            }
        },
        async serverPrefetch() {
            await QueryBuffer.inject().flushing;
        }
    })
}

// bind reactive data directly to html element attributes for animation performance
export function animate(elem: HTMLElement, animatedPropsProvider: () => Record<string, any>) {
    effect(() => {
        const animatedProps = animatedPropsProvider();
        for (const [k, v] of Object.entries(animatedProps)) {
            if (typeof v === 'object') { // such as style
                for (const [k2, v2] of Object.entries(v)) {
                    (elem as any)[k][k2] = v2;
                }
            } else {
                (elem as any)[k] = v;
            }
        }
    })
}

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

export type Future<T> = { loading: boolean, data: T, error?: any, stale?: boolean }

export function load<T extends VueComponent>(componentType: T, criteria: { $parent: any } & Record<string, any>): AsVueProxy<T>;
export function load<T extends VueComponent>(componentType: T, criteria: { $root: any } & Record<string, any>): AsVueProxy<T>;
export function load<T>(resource: Resource<T>, criteria?: () => Record<string, any>): Ref<Future<T>>;
export function load(target: any, criteria: any): any {
    if (target instanceof Resource) {
        const refFuture = queryResource(target, criteria);
        return computed(() => {
            const future = refFuture.value;
            return { loading: future.loading, data: future.data[0], error: future.error }
        });
    }
    return (query(target, criteria) as any)[0];
}

export function query<T extends VueComponent>(componentType: T, criteria: { $parent: any } & Record<string, any>): AsVueProxy<T>[];
export function query<T extends VueComponent>(componentType: T, criteria: { $root: any } & Record<string, any>): AsVueProxy<T>[];
export function query<T>(resource: Resource<T>, criteria?: () => Record<string, any>): Ref<Future<T[]>>;
export function query(target: any, criteria: any): any {
    if (target instanceof Resource) {
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

export function castTo<T extends VueComponent>(proxy: any, componentType: T): AsVueProxy<T>;
export function castTo<T>(proxy: any, componentType: Resource<T>): T;
export function castTo<T extends VueComponent>(proxy: any, componentType: T): AsVueProxy<T> {
    if (componentType instanceof Resource) {
        return proxy;
    }
    if (proxy.$.type !== componentType) {
        throw new Error('type mismatch');
    }
    return proxy;
}

export type defineCommandChain<T> = T & {
    defineCommand<F extends (args: any) => Promise<any>>(options: {
        command?: string,
        affectedTables: string[],
    }): { as<C extends string = ''>(alias: C): defineCommandChain<T & { [P in C]: F }> };
}

export function defineCommand<F extends (args: any) => Promise<any>>(this: any, options: {
    command?: string,
    affectedTables: string[],
}): { as<C extends string = ''>(alias: C): defineCommandChain<{ [P in C]: F }> } {
    let prev = this && this.Resource !== Resource ? this : undefined;
    return ({
        as(alias: string) {
            const stub = (args: Record<string, any>) => {
                const queryRequests = [];
                for (const affectedTable of options.affectedTables) {
                    const queries = tableQueries.get(affectedTable);
                    for (const query of queries || []) {
                        queryRequests.push(query.newRequest());
                    }
                }
                const command = options.command || alias;
                const commandRequest = new CommandRequest(command, args);
                vdbOptions.rpcProvider(queryRequests, commandRequest);
                return commandRequest.promise;
            };
            return { ...prev, [alias]: stub, defineCommand };
        }
    }) as any
}

export function defineResource<T>(table: string, options?: {
    sourceTables?: string[], // if source table changed, queries of this resource will be run again
    staticCriteria?: Record<string, any>, // some part of criteria is not context dependent, we can extract them to here
}): Resource<T> {
    return readonly(new Resource<T>(table, options)) as any;
}

class QueryBuffer {
    public static key = Symbol();
    public static provide(app: App) {
        app.provide(QueryBuffer.key, new QueryBuffer());
    }
    public static inject(): QueryBuffer {
        return getCurrentInstance()!.appContext.provides[QueryBuffer.key];
    }
    private buffered: QueryRequest[] = [];
    public flushing?: Promise<void>;
    public execute(query: QueryRequest) {
        this.buffered.push(query);
        if (this.buffered.length === 1) {
            this.flushing = this.flush();
        }
    }
    private async flush() {
        await waitNextTick(); // wait for other components rendering in this tick to fill up buffer
        const requests = this.buffered;
        this.buffered = [];
        await vdbOptions.rpcProvider(requests);
        for (const request of requests) {
            await request.showingLoading
        }
        this.flushing = undefined;
    }
}

class Query {
    // query result is a ref so that we can bind data to it
    // 1. initially it has no data, as async computation takes time
    // 2. when async query is done, the result will be updated
    // 3. when criteria changed, query will be re-run, and then the result will be changed
    // 4. when command mutates table data, queries depending on those tables will be re-run
    public result: Ref<{ loading: boolean, data: any[], error?: any, stale?: boolean }> = ref({ loading: false, data: [], error: undefined, _query: this });
    public criteria: Record<string, any> = {};
    public version = 0;
    private queryBuffer: QueryBuffer;

    constructor(public resource: Resource<any>, criteriaProvider?: () => Record<string, any>) {
        this.queryBuffer = QueryBuffer.inject();
        const component = getCurrentInstance()!;
        // subscribe criteria via effect
        effect(() => {
            if (criteriaProvider) {
                this.criteria = criteriaProvider();
            }
            const shouldSkip = vdbOptions.hydrate && !component.isMounted;
            if (!shouldSkip) {
                this.queryBuffer.execute(this.newRequest(!component.isMounted));
            }
        })
    }

    public newRequest(showLoading?: boolean) {
        this.version++;
        return new QueryRequest(this, !!showLoading);
    }

    public refresh() {
        this.queryBuffer.execute(this.newRequest());
    }
}

export class Resource<T> {

    public pickedFields?: string[];
    public subResources: Record<string, {
        single?: boolean, // true for load, false for query
        resource: Resource<any>,
        dynamicCriteria: Record<string, string>,
        staticCriteria?: Record<string, any>
    }> = {}

    constructor(public readonly table: string, public options?: {
        sourceTables?: string[],
        staticCriteria?: Record<string, any>,
    }) {
    }

    private clone() {
        const newResource = new Resource(this.table, this.options);
        newResource.pickedFields = this.pickedFields;
        newResource.subResources = { ...this.subResources };
        return newResource;
    }

    public pick<P extends object>(...pickedFields: (keyof P & keyof T)[]): Resource<P> {
        const newResource = this.clone();
        newResource.pickedFields = pickedFields as any;
        return readonly(newResource) as any;
    }

    public load<N extends string, F>(fieldName: N, fieldType: Resource<F>, dynamicCriteria: Record<string, string>, options?: {
        staticCriteria?: Record<string, any>,
    }): Resource<T & { [P in N]: F }> {
        const newResource = this.clone();
        newResource.subResources[fieldName] = {
            single: true,
            resource: fieldType,
            dynamicCriteria,
            staticCriteria: options?.staticCriteria
        }
        return readonly(newResource) as any;
    }

    public query<N extends string, F>(fieldName: N, fieldType: Resource<F>, dynamicCriteria: Record<string, string>, options?: {
        staticCriteria?: Record<string, any>,
    }): Resource<T & { [P in N]: F[] }> {
        const newResource = this.clone();
        newResource.subResources[fieldName] = {
            resource: fieldType,
            dynamicCriteria,
            staticCriteria: options?.staticCriteria
        }
        return readonly(newResource) as any;
    }

    public toJSON() {
        return {
            table: this.table,
            staticCriteria: this.options?.staticCriteria,
            subResources: Object.keys(this.subResources).length === 0 ? undefined : this.subResources
        }
    }
}

function queryResource(resource: Resource<any>, criteria: () => Record<string, any>): Ref<Future<any[]>> {
    const query = new Query(toRaw(resource), criteria);
    // only keep track of the query when the component instance is not unmounted
    (getCurrentInstance() as any).scope.run(() => {
        let queries = tableQueries.get(resource.table);
        if (!queries) {
            tableQueries.set(resource.table, queries = new Set());
        }
        queries.add(query);
        onScopeDispose(() => {
            queries!.delete(query);
        })
    });
    return query.result;
}

export class QueryRequest {

    private baseVersion: number;
    public criteria: Record<string, any>;
    public showingLoading?: Promise<void>;

    constructor(private query: Query, public showLoading: boolean) {
        this.baseVersion = query.version;
        this.criteria = query.criteria;
        if (showLoading) {
            if (vdbOptions.loadingPreDelay) {
                sleep(vdbOptions.loadingPreDelay || 0).then(() => {
                    this.showingLoading = this.loadingCountdown();
                })
            } else {
                this.showingLoading = this.loadingCountdown();
            }
        }
    }

    private async loadingCountdown() {
        if (this.isExpired) { return; } // hide loading if actual data can be shown fast enough
        this.query.result.value = { loading: true, data: [], error: undefined };
        await sleep(vdbOptions.loadingPostDelay || 0); // show loading for at least this long
    }

    public get resource() {
        return this.query.resource;
    }

    // avoid early request override late request
    private get isExpired() {
        return this.baseVersion !== this.query.version;
    }

    public resolve(data: any[], stale?: boolean) {
        if (this.isExpired) { return; }
        if (this.showingLoading) {
            this.showingLoading.then(() => {
                this.showingLoading = undefined;
                this.resolve(data, stale);
            });
            return;
        }
        this.query.version++;
        this.query.result.value = { loading: false, data, error: undefined, stale };
    }

    public reject(error: any) {
        if (this.isExpired) { return; }
        if (this.showingLoading) {
            this.showingLoading.then(() => {
                this.showingLoading = undefined;
                this.reject(error);
            });
            return;
        }
        this.query.version++;
        this.query.result.value = { loading: false, data: [], error };
    }

    public toJSON() {
        return { resource: this.resource, criteria: this.criteria }
    }
}

export class CommandRequest {

    public promise: Promise<any>;
    public resolve: (result: any) => void = undefined as any;
    public reject: (error: any) => void = undefined as any;
    private responded: boolean = false;

    constructor(public command: string, public args: Record<string, any>) {
        this.promise = new Promise<any>((resolve, reject) => {
            this.resolve = (result) => {
                if (this.responded) { return; }
                this.responded = true;
                resolve(result)
            };
            this.reject = (error) => {
                if (this.responded) { return; }
                this.responded = true;
                reject(error)
            };
        });
    }

    public toJSON() {
        return { command: this.command, args: this.args }
    }
}