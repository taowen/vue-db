<script lang="ts">
import { defineComponent, effectScope } from 'vue';
import * as vdb from 'vue-db';
import TodoListItem, { ResTodo } from './TodoListItem.vue';
export default defineComponent({
    setup: vdb.setup,
    components: { TodoListItem },
    computed: {
        todos() {
            return vdb.query(ResTodo, {});
        },
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
    {{ completedCount }} out of {{ todos.result.length }} items completed
    <TodoListItem v-for="todo in todos.result" :key="todo.id" :todo="todo" />
</template>