<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import TodoListItem, { ResTodo } from './TodoListItem.vue';
export default defineComponent({
    setup: vdb.setup,
    components: { TodoListItem },
    data() {
        return {
            todos: vdb.query(ResTodo)
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
    <TodoListItem v-for="todo in todos.data" :key="todo.id" :todo="todo" />
</template>