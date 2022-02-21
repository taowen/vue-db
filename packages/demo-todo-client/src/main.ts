import { createApp } from 'vue';
import * as vdb from 'vue-db';
import App from './App.vue';

export const app = createApp(App);
app.use(vdb, {
    rpcProvider: async (queries, command) => {
        for (const query of queries) {
            query.resolve(['world'])
        }
    }
} as vdb.InstallOptions);
app.mount('#app')
