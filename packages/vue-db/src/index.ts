import { ComponentInternalInstance, computed, effect, getCurrentInstance, isVNode, KeepAlive, onScopeDispose, Ref, ref, VNode } from 'vue';

export function setup() {
    const c = getCurrentInstance();
    if (!c) {
        throw new Error('vdb setup not called within vue component setup');
    }
    const componentType = c.type as any;
    let instanceCount = componentType.instanceCount;
    if (!instanceCount) {
        instanceCount = componentType.instanceCount = ref(0);
    }
    instanceCount.value++;
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

export function waitNextTick(proxy: any) {
    return new Promise<void>(resolve => {
        proxy.$nextTick(resolve);
    });
}

export function castTo<T extends VueComponent>(proxy: any, componentType: T): AsVueProxy<T> {
    if (proxy.$.type !== componentType) {
        throw new Error('type mismatch');
    }
    return proxy;
}

export function defineResource<T>(resourceName: string) {
    return new Resource<T>(resourceName);
}

function isResource(target: any): target is Resource<any> {
    if (target.constructor === Resource) {
        return true;
    }
    return false;
}

const resourceQueries: Record<string, Set<Query>> = {};

class Query {
    public refFuture = ref({ isDone: false, data: [] as any[], error: undefined as any });
    private refRerun = ref(0);

    constructor(resource: Resource<any>, criteria?: () => Record<string, any>) {
        const refCriteria = computed(criteria || (() => {
            return {}
        }));
        effect(() => {
            const criteria = refCriteria.value;
            this.refRerun.value;
            (async () => {
                try {
                    const data = await resourceProvider(resource, criteria);
                    this.refFuture.value = { isDone: true, data, error: undefined };
                } catch(e) {
                    this.refFuture.value = { isDone: true, data: [], error: e };
                }
            })();
        })
    }

    run() {
        this.refRerun.value++;
    }
}

export class Resource<T> {
    constructor(public readonly resourceType: string) {
    }
}

function queryResource(resource: Resource<any>, criteria: () => Record<string, any>): Ref<Future<any[]>> {
    const query = new Query(resource, criteria);
    // only keep track of the query when the component instance is not unmounted
    (getCurrentInstance() as any).scope.run(() => {
        let queries = resourceQueries[resource.resourceType];
        if (!queries) {
            resourceQueries[resource.resourceType] = queries = new Set();
        }
        queries.add(query);
        onScopeDispose(() => {
            queries.delete(query);
        })
    });
    return query.refFuture;
}

export function invalidateResourceType(resourceType: string) {
    // re-run queries
}

let resourceProvider: (resource: Resource<any>, criteria: Record<string, any>) => Promise<any[]> = () => {
    throw new Error('must call setResourceProvider before query resource');
}

export function setResourceProvider(_provider: typeof resourceProvider) {
    resourceProvider = _provider;
}

export async function sleep(timeout: number) {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
}