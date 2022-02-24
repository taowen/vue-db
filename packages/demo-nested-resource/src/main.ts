import { createApp } from 'vue'
import App from './App.vue'
import * as vdb from 'vue-db';

export const app = createApp(App);
app.use(vdb, {
    rpcProvider: async (queries) => {
        console.log('queries', JSON.stringify(queries, undefined, '  '));
        queries[0].resolve([{
            id: '1',
            name: 'jiangxi',
            cities: [{
                id: '2',
                name: 'nanchang',
                districts: [{
                    id: '3',
                    name: 'xihu'
                }, {
                    id: '4',
                    name: 'donghu'  
                }, {
                    id: '5',
                    name: 'xinjian'
                }]
            }]
        }, {
            id: '6',
            name: 'jilin'
        }]);
    }
} as vdb.InstallOptions);
app.mount('#app')
