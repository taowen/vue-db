# Motivation

Generate static page using node.js might fetch remote data. If we can not know who is fetching data, we can not be sure the page rendered is complete.
This is a huge problem if data loading is unorganized.

## renderToString

vue has a async api renderToString

```ts
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as vdb from 'vue-db';

const Article = vdb.defineResource('article');

async function main() {
    const app = createSSRApp({
        data: () => ({ 
            // declare a async data dependency
            articles: vdb.query(Article) 
        }),
        render() {
            return h('div', `hello ${JSON.stringify(this.articles.data)}`)
        }
    }).use(vdb, {
        async rpcProvider(queries) {
            // delay 1 second to showcase we can wait for data fetching before rendering
            await vdb.sleep(1000);
            if (queries[0]) {
                queries[0].resolve([
                    'Zen and the Art of Motorcycle Maintenance: An Inquiry into Values', 
                    'The Hitchhikers Guide to the Galaxy'
                ]);
            }
        }
    } as vdb.InstallOptions)

    const html = await renderToString(app);
    console.log(html);
}

main();
```

In rpcProvider, `await vdb.sleep(1000)` ensure the data is not resolved immediately. The problem is can we get a complete html after renderToString?

## vdb.query

When `app.use(vdb)`, a mixin will be installed into vue application.

```ts
async serverPrefetch() {
    await queryBuffer.flushing;
}
```

This lifecycle hook is provided by vue to ensure async data has been resolved, before renderToString. The queryBuffer is filled by `vdb.query`, and we can wait for its flushing. If all async data is fetched via `vdb.query` or `vdb.load`, we can be sure the result of renderToString is a complete page.