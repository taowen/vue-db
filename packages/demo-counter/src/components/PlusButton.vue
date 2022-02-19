<script lang="ts">
import { ComponentHelper, defineComponent } from "vue-db";
import CounterBox from "./CounterBox.vue";

export default defineComponent(class {
    constructor(private helper: ComponentHelper) {
    }
    onClicked() {
        this.helper.load(CounterBox)?.increase();
    }
})
</script>
<template>
    <button @click="onClicked">+</button>
</template>