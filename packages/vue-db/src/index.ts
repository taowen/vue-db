import { ComponentInternalInstance, isVNode, KeepAlive, Ref, ref, VNode } from 'vue';

export function onCreated(this: any) {
    register(this);
}

export function register(proxy: any): void {
    const componentType = proxy.$.type;
    let instanceCount = componentType.instanceCount;
    if (!instanceCount) {
        instanceCount = componentType.instanceCount = ref(0);
    }
    instanceCount.value++;
}

type C = { data?: (...args: any[]) => any, methods?: any, instanceCount?: Ref<number> };

export function load<T extends C>(componentType: T, criteria: Record<string, any>) {
    const item = query(componentType, criteria)[0];
    return item;
}

export function pageOf(proxy: any) {
    return getPageRoot(proxy.$).proxy;
}

function getPageRoot(node: ComponentInternalInstance) {
    if (!node.parent || (node.parent.type as any) === KeepAlive) {
        return node;
    }
    return getPageRoot(node.parent);
}

export function query<T extends C>(componentType: T, criteria: Record<string, any>): (T['methods'] & ReturnType<NonNullable<T['data']>>)[] {
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