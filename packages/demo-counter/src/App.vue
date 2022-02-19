<script setup lang="ts">
import CounterBox from './components/CounterBox.vue'
import PlusButton from './components/PlusButton.vue'
import DisplayPanel from './components/DisplayPanel.vue'
</script>

<template>
  <CounterBox />
  <PlusButton />
  <DisplayPanel />
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
