<script setup lang="ts">
import { ref } from 'vue';
import AnimatedDiv from './components/AnimatedDiv.vue';

const color = ref('red');
</script>

<template>
  <AnimatedDiv :color="color">O_O</AnimatedDiv>
  <button @click="color = 'red'">red</button>
  <button @click="color = 'green'">green</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
