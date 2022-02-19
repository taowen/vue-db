<script lang="ts">
import * as vdb from "vue-db";
import CounterBox from "./CounterBox.vue";

export default vdb.defineComponent({
    methods: {
        onClicked() {
            vdb.load(CounterBox, { $root: vdb.pageOf(this) })?.increase();
        }
    }
})
</script>
<template>
    <button @click="onClicked">+</button>
</template>