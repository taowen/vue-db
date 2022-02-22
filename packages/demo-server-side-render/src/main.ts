import { createSSRApp } from 'vue';
import * as vdb from 'vue-db';
import { renderToString } from 'vue/server-renderer';
import App from './App.vue';

// This is just a fake demo without actually using a real server.
// But passing state from serverApp to clientApp via rendered html,
// the simulated process is pretty close to real
async function main() {
    // 1. server render
    const serverApp = createSSRApp(App);
    serverApp.use(vdb, {
        dehydrate: true, // dehydrate state into rendered html
        async rpcProvider(queries) {
            if (queries[0]) {
                queries[0].resolve([
                    { title: 'Zen and the Art of Motorcycle Maintenance: An Inquiry into Values', language: 'en'},
                    { title: 'The Hitchhikers Guide to the Galaxy', language: 'en'},
                ])
            }
        }
    } as vdb.InstallOptions);
    const serverRenderedHtml = await renderToString(serverApp);
    // 2. send to client, the state will carry through automatically
    console.log('server rendered', serverRenderedHtml);
    document.getElementById('app')!.innerHTML = serverRenderedHtml;
    // 3. client hydrate
    const clientApp = createSSRApp(App);
    clientApp.use(vdb, {
        hydrate: true, // do not fetch again, hydrate from html
        rpcProvider() {
            throw new Error('demo client can not rpc');
        }
    } as vdb.InstallOptions);
    clientApp.mount('#app');
}

main();

