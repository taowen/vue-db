import { defineComponent as vueDefineComponent, getCurrentInstance, Ref, ref } from 'vue';

type FunctionsOf<T> = {
    [P in keyof T]: T[P] extends Function ? T[P] : never;
};

export function defineComponent<T>(tableClass: { new($: ComponentHelper, props?: any, ctx?: any): T }) {
    const methods: any = {};
    const computed: any = {};
    for (const k of Object.getOwnPropertyNames(tableClass.prototype)) {
        const propDesc = Object.getOwnPropertyDescriptor(tableClass.prototype, k);
        const isGetter = propDesc?.get;
        if (isGetter) {
            computed[k] = propDesc.get;
        } else {
            const v = tableClass.prototype[k] as Function;
            methods[k] = function (this: any, ...args: any[]) {
                return v.apply(this, args);
            }
        }
    }
    const componentType = vueDefineComponent({
        setup(props, ctx) {
            componentType.instanceCount.value++;
            return { self: new tableClass(new ComponentHelper(), props, ctx) }
        },
        data(): T {
            return this.self as any;
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
        // will recompute when new instance created
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