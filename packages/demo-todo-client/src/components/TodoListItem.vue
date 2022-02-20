<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import * as vdb from 'vue-db';

export const ResTodo = vdb.defineResource<{ id: string, content: string }>('todo');

export default defineComponent({
    setup: vdb.setup,
    props: {
        todo: {
            default: undefined as any as { id: string, content: string }
        }
    },
    data() {
        return { content: this.todo.content, completed: false }
    },
    methods: {
        onRemove() {
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