import { Component, ComponentInternalInstance, defineComponent as vueDefineComponent, getCurrentInstance, isVNode, Ref, ref, VNode } from 'vue';

type FunctionsOf<T> = {
    [P in keyof T]: T[P] extends Function ? T[P] : never;
};

export function defineComponent<T>(options: {
    components?: Record<string, Component>
    props?: (keyof T)[],
}, bizClass: { new(helper?: ComponentHelper): T }) {
    const methods: any = {};
    const computed: any = {};
    for (const k of Object.getOwnPropertyNames(bizClass.prototype)) {
        const propDesc = Object.getOwnPropertyDescriptor(bizClass.prototype, k);
        const isGetter = propDesc?.get;
        if (isGetter) {
            computed[k] = propDesc.get;
        } else {
            const v = bizClass.prototype[k] as Function;
            methods[k] = function (this: any, ...args: any[]) {
                return v.apply(this, args);
            }
        }
    }
    const props: Record<string, any> = {};
    const propDefaults = new bizClass();
    for (const propName of options?.props || []) {
        props[propName as string] = {
            default: propDefaults[propName]
        }
    }
    const componentType = vueDefineComponent({
        components: options?.components,
        props,
        setup(props, ctx) {
            // trigger helper.query who queried this component type to recompute
            componentType.instanceCount.value++;
            const self = new bizClass(new ComponentHelper()) as any;
            if (self.setup) {
                self.setup(props, ctx);
            }
            return { self }
        },
        data(): T {
            const data = { ...this.self };
            for (const propName of options?.props || []) {
                delete data[propName];
            }
            return data;
        },
        computed: computed as undefined,
        methods: methods as FunctionsOf<T>
    })
    componentType.instanceCount = ref(0);
    return componentType;
}

export class ComponentHelper {

    private currentInstance: ReturnType<typeof getCurrentInstance>;

    constructor() {
        this.currentInstance = getCurrentInstance();
    }

    load<T extends { methods?: any, instanceCount?: Ref<number> }>(componentType: T): T['methods'] {
        return this.query(componentType)[0];
    }

    query<T extends { methods?: any, instanceCount?: Ref<number> }>(componentType: T): T['methods'][] {
        if (!componentType.instanceCount) {
            throw new Error(`${componentType} is not defined by vue-db.defineComponent`);
        }
        // will recompute when new instance created, 
        // so we can reference a component instance event it has not been created yet
        componentType.instanceCount.value;
        const filtered = [];
        for (const comp of this.currentInstance.root.subTree.children as any) {
            if (comp.type === componentType && comp.component) {
                filtered.push(comp.component.proxy);
            }
        }
        return filtered as any;
    }
}

export function dumpForm(proxy: any) {
    const node: ComponentInternalInstance = proxy.$;
    if (!node) {
        throw new Error('dumpForm should be called from vue component method with this as argument');
    }
    const form = {} as Record<string, any>;
    dumpComponentVNode(form, node);
    return form;
}

function dumpVNode(form: Record<string, any>, node: VNode) {
    if (node.component) {
        dumpComponentVNode(form, node.component);
    } else if (Array.isArray(node.children)) {
        for (const child of node.children) {
            if (isVNode(child)) {
                dumpVNode(form, child);
            }
        }
    }
}

function dumpComponentVNode(form: Record<string, any>, node: ComponentInternalInstance) {
    const proxy = node.proxy as any;
    if (proxy.fillForm) {
        proxy.fillForm(form);
    } else {
        dumpVNode(form, node.subTree);
    }
}