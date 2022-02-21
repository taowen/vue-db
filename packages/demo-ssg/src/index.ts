// this runs in Node.js on the server.
import { createSSRApp } from 'vue'
// Vue's server-rendering API is exposed under `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'
import * as vdb from 'vue-db';

const Article = vdb.defineResource('article');

export function start() {
    const app = createSSRApp({
        data: () => ({ articles: vdb.query(Article) }),
        template: `hello {{ articles.data }}`
    }).use(vdb, {
        async rpcProvider(queries) {
            await vdb.sleep(1);
            if (queries[0]) {
                queries[0].resolve(['a', 'b']);
            }
        }
    } as vdb.InstallOptions)

    renderToString(app).then((html) => {
        console.log(html)
    })
}