<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import TodoListItem, { Todo } from './TodoListItem.vue';
export default defineComponent({
    components: { TodoListItem },
    data() {
        return {
            // this binds to backend data
            // when command affected this table, the query will be re-run
            todos: vdb.query(Todo)
        }
    },
    computed: {
        completedCount() {
            let count = 0;
            for (const item of vdb.query(TodoListItem, { $parent: this })) {
                if (item.completed) {
                    count++;
                }
            }
            return count;
        }
    }
})
</script>
<template>
    {{ completedCount }} out of {{ todos.data.length }} items completed
    <span v-if="!todos.isDone">loading...</span>
    <span v-if="todos.error">{{ todos.error }}</span>
    <TodoListItem v-for="todo in todos.data" :key="todo.id" :todo="todo" />
</template>