import { defineComponent as vueDefineComponent, getCurrentInstance } from 'vue';

type FunctionsOf<T> = {
    [P in keyof T]: T[P] extends Function ? T[P] : never;
  };

export function defineComponent<T>(tableClass: { new(props?: any, ctx?: any): T }) {
    const methods: any = {};
    for (const k of Object.getOwnPropertyNames(tableClass.prototype)) {
        const v = tableClass.prototype[k] as Function;
        methods[k] = function(this: any, ...args: any[]) {
            return v.apply(this, args);
        }
    }
    return vueDefineComponent({
        setup(props, ctx) {
            return { self: new tableClass(props, ctx) }
        },
        data(): T {
            return this.self as any;
        },
        methods: methods as FunctionsOf<T>
    })
}

export class ComponentHelper {
    constructor(currentInstance: ReturnType<typeof getCurrentInstance>) {
    }
}

export function getCurrentPage() {
    const instance = getCurrentInstance();
    return {
        query<T extends { setup?: any }>(componentType: T): ReturnType<NonNullable<T['setup']>>[] {
            const filtered = [];
            for (const comp of instance.root.subTree.children as any) {
                if (comp.type === componentType && comp.component) {
                    filtered.push(comp.component.proxy);
                }
            }
            return filtered as any;
        }
    };
}