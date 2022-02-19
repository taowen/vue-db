<script lang="ts">
import * as vdb from 'vue-db';
import CounterBox from './CounterBox.vue';

export default vdb.defineComponent({
    computed: {
        displayBack() {
            const counter = vdb.load(CounterBox, { $root: vdb.pageOf(this) })?.count || 0;
            return counter + 20;
        }
    }
})
</script>
<template>
current is: {{ displayBack }}
</template>