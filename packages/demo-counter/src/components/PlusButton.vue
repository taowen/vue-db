<script lang="ts">
import { defineComponent } from "vue";
import * as vdb from "vue-db";
import CounterBox from "./CounterBox.vue";

export default defineComponent({
    created: vdb.onCreated,
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