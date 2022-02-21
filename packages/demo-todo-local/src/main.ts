import { createApp } from 'vue'
import App from './App.vue'
import * as vdb from 'vue-db';

export const app = createApp(App);
app.use(vdb)
app.mount('#app')
