<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

const saveTodo = vdb.defineCommand<((args: { content: string }) => Promise<void>)>({ 
    command: 'saveTodo', 
    affectedTables: ['todo']});

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
            await saveTodo({ content: this.content });        
            this.content = '';
        }
    }
})
</script>
<template>
    What needs to be done?
    <input type="textbox" v-model="content" @keyup.enter="onEnter" />
</template>