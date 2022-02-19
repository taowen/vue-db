<script lang="ts">
import * as vdb from 'vue-db';
import CounterBox from './CounterBox.vue';

export default vdb.defineComponent({}, class {
    get displayBack() {
        const counter = vdb.load(this, CounterBox)?.count || 0;
        return counter + 20;
    }
})
</script>
<template>
current is: {{ displayBack }}
</template>