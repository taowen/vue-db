<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

type signature = (args: { content: string }) => Promise<void>;
const rpc = vdb
    .defineCommand<(() => void)>({ affectedTables: [] }).as('blah')
    .defineCommand<signature>({ affectedTables: ['todo'] }).as('saveTodo')
    .defineCommand<(() => void)>({ affectedTables: [] }).as('lalala');

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
            await rpc.saveTodo({ content: this.content });
            this.content = '';
        }
    }
})
</script>
<template>
    What needs to be done?
    <input type="textbox" v-model="content" @keyup.enter="onEnter" />
</template>