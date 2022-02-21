<script lang="ts">
import { defineComponent } from 'vue';
import TodoList from './TodoList.vue';
import * as vdb from 'vue-db';
export default defineComponent({
    props: {
        itemId: { type: String, required: true }
    },
    data() {
        return { visible: false, content: '', completed: false }
    },
    methods: {
        init(content: string) {
            this.visible = true;
            this.content = content;
        },
        onRemove() {
            const todoList = vdb.castTo(this.$parent, TodoList);
            todoList.remove(this.itemId);
        }
    }
})
</script>
<template>
    <div v-if="visible">
    <input type="checkbox" v-model="completed"/>
    {{ content }}
    <button @click="onRemove">x</button>
    </div>
</template>