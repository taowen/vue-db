<script lang="ts">
// only type from server side code has been used
// there is no worry of leaking server side code to client side
import type { T_removeTodo, T_Todo } from 'demo-todo-server';
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

export const Todo = vdb.defineResource<T_Todo>('todo');

const rpc = vdb.defineCommand<T_removeTodo>({ affectedTables: [Todo.table] }).as('removeTodo');

export default defineComponent({
    props: {
        todo: {
            default: vdb.castTo(undefined, Todo)
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