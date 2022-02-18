<script lang="ts">
import { defineComponent } from "vue";
import { getCurrentPage } from 'vue-db';
import CValue from './CValue.vue';

export default defineComponent({
    setup() {
        const currentPage = getCurrentPage();
        function onClicked() {
            const cvalue = currentPage.query(CValue)[0];
            cvalue.increase();
        }
        return { onClicked }
    }
})
</script>
<template>
    <button @click="onClicked">+</button>
</template>