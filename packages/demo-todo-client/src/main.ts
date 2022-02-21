import { createApp } from 'vue';
import * as vdb from 'vue-db';
import App from './App.vue';

export const app = createApp(App);
app.use(vdb, {
    rpcProvider: async (queries, command) => {
        console.log(JSON.stringify(queries));
        await vdb.sleep(1000);
        for (const query of queries) {
            query.resolve([{ content: 'world' }])
        }
    }
} as vdb.InstallOptions);
app.mount('#app')
