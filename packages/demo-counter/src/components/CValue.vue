<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            count: 0
        }
    },
    methods: {
        increase() {
            this.count += 1;
        }
    }
})
</script>
<template>
    <input type="textbox" :value="count"/>
</template>