<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import CounterBox from './CounterBox.vue';

export default defineComponent({
    computed: {
        displayBack() {
            const counterBox = vdb.load(CounterBox, { $root: vdb.pageOf(this) });
            const count = counterBox?.count || 0;
            return count + 20;
        }
    }
})
</script>
<template>
current is: {{ displayBack }}
</template>