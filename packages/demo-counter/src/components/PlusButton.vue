<script lang="ts">
import * as vdb from "vue-db";
import CounterBox from "./CounterBox.vue";

export default vdb.defineComponent({}, class {
    onClicked() {
        vdb.load(this, CounterBox)?.increase();
    }
})
</script>
<template>
    <button @click="onClicked">+</button>
</template>