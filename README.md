# vue-db

Majority of the work is done by [vue 3 reactivity system](https://vuejs.org/api/reactivity-core.html), vue-db just unleash its full potential with **500** lines of code.

* cross component data sync, such as form
* javascript based animation without cost of vue reconciliation
* load data from backend and keeping it up to date
* server side rendering (SSR) initial state
* type-safe RPC with graph query opt-in

## Form

Instead of using https://vuex.vuejs.org/ to hold the state, vue-db use the vue component instance itself as data store.

* user type inputs into the form components through ui
* in computed property, use `vdb.load` or `vdb.query` to locate the data source and keep data in sync
* when submit, use `vdb.walk` to walk component tree to dump the form state out

Checkout following examples

| code | live | demo | 
| --- | --- | --- |
| [counter](./packages/demo-counter/) | counter | `vdb.load` with $root from current page |
| [flat form](./packages/demo-flat-form) | flat form | `vdb.walk` to dump form state |
| [nested form](./packages/demo-nestd-form) | nested form | `vdb.load` with $parent allowing multiple form instances |
| [todo list](./packages/demo-todo-local/) | todo list | `vdb.waitNextTick` to add new todo item |


## Animation

Animate with vue reconciliation is slow. CSS animation is feature limited. There are times we need to update the DOM element directly without triggering vue to re-render.
vue-db serves as a data binding tool between computed property and DOM element attributes.

| code | live | demo |
| --- | --- | --- |
| [animation](./packages/demo-animation) | animation | `vdb.animate` to bind animated props to html element |

## Async data binding

Data from backend need to be loaded asynchronously. Instead of using a mutable https://vuex.vuejs.org/ store to hold the backend data, vue-db provides async data binding to bind vue component data with backend table.

* `vdb.defineResource` to describe the data to be loaded from server table. table name is just a string, the server can interpret it as anything. vue-db does not specify the rpc protocol, and does not include any server side implementation.
* `vdb.query` or `vdb.load` the resource defined, bind to vue component data
* render page with the data. as async data loading takes time, this time the data will be empty array containing nothing.
* server responded with data, which triggers the vue component to re-render again
* `vdb.defineCommand` to define a function that can be used to call server to update data
* user clicked some button calling the command, which use its `affectedTables` definition to trigger component rerender

Checkout following examples 

| code | live | demo |
| --- | --- | --- |
| todo [client](./packages/demo-todo-client/) [server](./packages/demo-todo-server/) | todo client server | `vdb.defineResource` and `vdb.defineCommand` to bind with backend data |

## SSR

Fetching initial data for server side rendering is a hard job. vue-db aims to unify SPA and SSR data loading code. You no longer need to lift the data fetching logic to page level, every component can declare its own async data dependency.

TODO

## Type-safe RPC

If both server and client are written in typescript, the `.d.ts` file can be used as type-safe RPC data schema. vue-db allow you to `import type` and hand-write a RPC stub with very little code, instead of resorting to full blown code generation solution. Also `vdb.defineResource` support declaring nested resource, allow client to query for a object graph in one RPC roundtrip. However, the wire-protocol and server side implementation is excluded from the scope. vue-db is just a tiny library depending only on vue 3, it will not enforce a server/client framework to you.

TODO