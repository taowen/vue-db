<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import type { T_saveTodo } from 'demo-todo-server';
import { Todo } from './TodoListItem.vue';

const rpc = vdb
    .defineCommand<T_saveTodo>({ affectedTables: [Todo.table] }).as('saveTodo');

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