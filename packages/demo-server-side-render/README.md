# Motivation

SSR need to render the page in server, and transport the server state to client side via JSON, so that client side do not query again when hydrate.
Normally this is done via setting `window.__INITIAL_STATE__` in html rendered.
However, many components might query data for itself, how can SSR framwork know what is the component doing?
To solve this problem, SSR framework will require the server to fetch data in one single place, at least for each page.
vue-db do not want to impose "global data store" constraint to application developer, they should continue use component to organize code.

## vdb.query

Same component, execute in both server and client, both calling same api `vdb.query`

```ts
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
```

vue-db will ensure the result of `vdb.query` being hydrated with server state.

## app setup

To illustrate the problem clearly, we use two vue app here to simulate actual SSR code

```ts
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
```

We set clientApp with a dummy rpcProvider throwing Error. If `vdb.query` send out the request in client side, we can tell.

Also serverApp has dehydrate set to true, clientApp has hydrate set to true, which enables the SSR behavior.
In vue-db implementation dehydrate will intercept `render` function of every component via vue mixin, hydrate will setup a `beforeMount` hook to every component.
As long as we are using `vdb.query` or `vdb.load` and declare the query in `data()` function of component, vue-db will manage the rest of the job.
This is encrouages modularization, allowing component encapsulating its own complexity.