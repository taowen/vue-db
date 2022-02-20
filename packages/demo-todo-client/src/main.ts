import { createApp } from 'vue';
import * as vdb from 'vue-db';
import App from './App.vue';

vdb.setResourceProvider(async (resource, criteria) => {
    await vdb.sleep(3000);
    return [{ id: 'hello', content: 'world' }];
});

export const app = createApp(App);
app.mount('#app')
