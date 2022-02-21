<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import TodoList from './TodoList.vue';
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
            const todoList = vdb.load(TodoList, { $root: vdb.pageOf(this) });
            const todoItem = await todoList.add();
            todoItem.init(this.content);
            this.content = '';
        }
    }
})
</script>
<template>
    What needs to be done?
    <input type="textbox" v-model="content" @keyup.enter="onEnter" />
</template>