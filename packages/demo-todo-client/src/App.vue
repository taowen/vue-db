<script setup lang="ts">
import NewTodo from './components/NewTodo.vue';
import TodoList from './components/TodoList.vue';
</script>

<template>
<h1>To-Do List</h1>
<NewTodo />
<TodoList />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 800px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
    align-items: flex-start;
}
</style>
