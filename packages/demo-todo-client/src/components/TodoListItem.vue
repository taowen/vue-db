<script lang="ts">
import { T_removeTodo, T_Todo } from 'demo-todo-server';
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

export const Todo = vdb.defineResource<T_Todo>('todo');

const rpc = vdb.defineCommand<T_removeTodo>({ affectedTables: [Todo.table] }).as('removeTodo');

export default defineComponent({
    props: {
        todo: {
            default: undefined as any as { id: string, content: string }
        }
    },
    data() {
        return { content: this.todo.content, completed: false }
    },
    methods: {
        async onRemove() {
            await rpc.removeTodo({ id: this.todo.id });
        }
    }
})
</script>
<template>
    <div>
        <input type="checkbox" v-model="completed" />
        {{ content }}
        <button @click="onRemove">x</button>
    </div>
</template>