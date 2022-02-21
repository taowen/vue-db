<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return {
            content: ''
        }
    },
    methods: {
        async onEnter() {
            if (!this.content) {
                return;
            }
            this.content = '';
        }
    }
})
</script>
<template>
    What needs to be done?
    <input type="textbox" v-model="content" @keyup.enter="onEnter" />
</template>