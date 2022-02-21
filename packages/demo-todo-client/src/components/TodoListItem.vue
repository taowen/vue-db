<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

export const Author = vdb.defineResource<{ name: string }>('author');
export const TodoTag = vdb.defineResource<{ name: string }>('todoTag');
export const Todo = vdb.defineResource<{ id: string, content: string }>('todo')
    .load('author', Author, { id: '$parent.authorId'})
    .query('tags', TodoTag, { todoId: '$parent.id'});

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