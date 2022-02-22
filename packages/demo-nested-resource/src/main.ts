import { createApp } from 'vue'
import App from './App.vue'
import * as vdb from 'vue-db';
import { fakeRpcProvider } from './components/fakeServer';

export const app = createApp(App);
app.use(vdb, {
    rpcProvider: fakeRpcProvider
} as vdb.InstallOptions);
app.mount('#app')
