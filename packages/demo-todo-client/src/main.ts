import { createApp } from 'vue';
import * as vdb from 'vue-db';
import App from './App.vue';

export const app = createApp(App);
app.use(vdb, {
    rpcProvider: async (queries, command) => {
        try {
            const resp = await fetch('http://localhost:8080/', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({
                    queries, command
                }, undefined, '  ')
            });
            const respBody = await resp.json();
            if (command) {
                command.resolve(respBody.command);
            }
            for (const [i, query] of respBody.queries.entries()) {
                queries[i].resolve(query);
            }
        } catch (e) {
            if (command) {
                command.reject(e);
            }
            for (const query of queries) {
                query.reject(e);
            }
        }
    }
} as vdb.InstallOptions);
app.mount('#app')
