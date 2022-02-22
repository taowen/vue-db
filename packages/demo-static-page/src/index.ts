import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as vdb from 'vue-db';

const Article = vdb.defineResource('article');

function main() {
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
                queries[0].resolve(['Zen and the Art of Motorcycle Maintenance: An Inquiry into Values', 'The Hitchhikers Guide to the Galaxy']);
            }
        }
    } as vdb.InstallOptions)

    renderToString(app).then((html) => {
        console.log(html)
    })
}

main();