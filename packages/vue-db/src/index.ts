import { getCurrentInstance } from 'vue';

export function getCurrentPage() {
    const instance = getCurrentInstance();
    return {
        query<T extends { methods?: any, data?: any }>(componentType: T): (NonNullable<T['methods']> & ReturnType<NonNullable<T['data']>>)[] {
            const filtered = [];
            for (const comp of instance.root.subTree.children as any) {
                if (comp.type === componentType) {
                    filtered.push(comp.component.proxy);
                }
            }
            return filtered as any;
        }
    };
}