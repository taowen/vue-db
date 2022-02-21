<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import TodoListItem from './TodoListItem.vue';
export default defineComponent({
    components: { TodoListItem },
    data() {
        return {
            itemIds: [] as string[]
        };
    },
    computed: {
        completedCount() {
            let count = 0;
            for (const item of vdb.query(TodoListItem, { $parent: this})) {
                if (item.completed) {
                    count++;
                }
            }
            return count;
        }
    },
    methods: {
        async add() {
            const newId = `${new Date().getTime()}`;
            this.itemIds.push(newId);
            await vdb.waitNextTick(this);
            return vdb.load(TodoListItem, { $parent: this, itemId: newId });
        },
        async remove(itemId: string) {
            const idx = this.itemIds.indexOf(itemId);
            if (idx === -1) {
                return;
            }
            this.itemIds.splice(idx, 1);
            await vdb.waitNextTick(this);
        }
    }
})
</script>
<template>
   {{ completedCount }} out of {{ itemIds.length }} items completed
    <TodoListItem v-for="itemId in itemIds" :key="itemId" :itemId="itemId" />
</template>