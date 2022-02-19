<script lang="ts">
import { ComponentHelper, defineComponent } from 'vue-db';
import CounterBox from './CounterBox.vue';

export default defineComponent({}, class {
    constructor(private helper: ComponentHelper) {
    }
    get displayBack() {
        const counter = this.helper.load(CounterBox)?.count || 0;
        return counter + 20;
    }
})
</script>
<template>
current is: {{ displayBack }}
</template>