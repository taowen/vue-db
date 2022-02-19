<script lang="ts">
import { computed, defineComponent, RenderFunction } from "vue";
import { getCurrentPage } from 'vue-db';
import CValue from './CValue.vue';

declare type NotVoid<T> = T extends void ? never : T;
declare type NotRenderFunction<T> = T extends RenderFunction ? never : T;
declare type NotPromise<T> = T extends Promise<any> ? never : T;
declare type UnMapRef<T> = T extends Promise<any> ? never : T;

export default defineComponent({
    setup() {
        const currentPage= getCurrentPage();
        const value = computed(() => {
            // let c: typeof CValue = null as any;
            // const v = c.setup!(undefined as any, undefined as any);
            // let v2: NotVoid<typeof v>;
            // let v3: NotRenderFunction<typeof v2>;
            // let v4: NotPromise<typeof v3>;
            const items = currentPage.query(CValue);
            if (items.length === 0) {
                return 0;
            }
            const cvalue = items[0];
            console.log(cvalue)
            return 20;
        });
        return { value }
    }
})
</script>
<template>
current is: {{ value }}
</template>