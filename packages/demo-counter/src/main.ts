import { createApp } from 'vue';
import * as VueRouter from 'vue-router';
import CounterPage from './components/CounterPage.vue';
import App from './App.vue';
import * as vdb from 'vue-db';

const routes = [
    {
        path: '/', component: CounterPage
    },
    { path: '/counter2', component: CounterPage },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
export const app = createApp(App);
app.use(router);
app.use(vdb);
app.mount('#app')
