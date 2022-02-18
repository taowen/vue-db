<script lang="ts">
import { computed, defineComponent } from "vue";
import { getCurrentPage } from 'vue-db';
import CValue from './CValue.vue';

export default defineComponent({
    setup() {
        const currentPage= getCurrentPage();
        const value = computed(() => {
            const cvalue = currentPage.query(CValue)[0];
            return cvalue.count;
        });
        return { value }
    }
})
</script>
<template>
current is: {{ value }}
</template>