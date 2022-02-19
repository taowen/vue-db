import { defineComponent as vueDefineComponent, getCurrentInstance } from 'vue';

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
    return vueDefineComponent({
        setup(props, ctx) {
            return { self: new tableClass(new ComponentHelper(), props, ctx) }
        },
        data(): T {
            return this.self as any;
        },
        computed: computed as undefined,
        methods: methods as FunctionsOf<T>
    })
}

export class ComponentHelper {

    private currentInstance: ReturnType<typeof getCurrentInstance>;
    
    constructor() {
        this.currentInstance = getCurrentInstance();
    }
    
    load<T extends { methods?: any }>(componentType: T): T['methods'] {
        return this.query(componentType)[0];
    }

    query<T extends { methods?: any }>(componentType: T): T['methods'][] {
        const filtered = [];
        for (const comp of this.currentInstance.root.subTree.children as any) {
            if (comp.type === componentType && comp.component) {
                filtered.push(comp.component.proxy);
            }
        }
        return filtered as any;
    }
}