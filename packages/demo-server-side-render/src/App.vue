<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

type T_Article = {
  title: string;
  language: string;
}
const Article = vdb.defineResource<T_Article>('article');

export default defineComponent({
  data() {
    return {
      color: 'black',
      articles: vdb.query(Article, () => ({ language: 'en' }))
    }
  }
})
</script>

<template>
  <ul>
    <li v-for="article in articles.data" :style="{ color }">{{ article.title }}</li>
  </ul>
  <button @click="color = 'red'">change color</button>
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
