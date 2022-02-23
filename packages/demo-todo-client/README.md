# Motivation

The no.1 reason to use a global data store is to hold the data fetched from backend.
vue-db wants to eliminate the mutable semantics.
By using expressing the data from backend as a cached and refreshable query, we can bind the UI to it.


## vdb.defineResource

We need to define the data provided by the backend

```ts
import type { T_Todo } from 'demo-todo-server';
import * as vdb from 'vue-db';

export const Todo = vdb.defineResource<T_Todo>('todo');
```

The T_Todo is just typescript defined by the server

```ts
class Todo {
    id: string = '';
    content: string = '';
}

export type { Todo as T_Todo };
```

Buy export type and import type, there is no runtime dependency here. We just use typescript to check the client code match with the server.
If server is not written in typescript, we need to use `any` to declare the server data type manually.

## vdb.query

Then we query from the defined resource, and bind ui to it

```ts
import TodoListItem, { Todo } from './TodoListItem.vue';
import * as vdb from 'vue-db';

export default defineComponent({
    components: { TodoListItem },
    data() {
        return {
            // this binds to backend data
            // when command affected this table, the query will be re-run
            todos: vdb.query(Todo)
        }
    }
})
```

```vue
<template>
    <span v-if="todos.loading">loading...</span>
    <span v-if="todos.error">{{ todos.error }}</span>
    <TodoListItem v-else v-for="todo in todos.data" :key="todo.id" :todo="todo" />
</template>
```

Whenever the todos query being re-run, the UI will be updated.
As we can see `vdb.query` from resource, returns a object with three properties

* loading: true or false, if the query is being executed and loading indicator should be visible
* error: if query failed, error will contain the exception thrown
* data: if query succeed, data is the array of object returned

## vdb.defineCommand

When will the query being re-run? When we added a todo!

```ts
import * as vdb from 'vue-db';
import type { T_saveTodo } from 'demo-todo-server';
import { Todo } from './TodoListItem.vue';

const rpc = vdb
    .defineCommand<T_saveTodo>({ affectedTables: [Todo.table] }).as('saveTodo');
```

T_saveTodo is provided by server, or you can manually declare it here.
All commands take only one args of type `Record<string, any>`.

```ts
async function saveTodo(args: { content: string }) {
    console.log('saveTodo', args.content);
    todos.push({ ...args, id: `${nextId++}` })
}

export type T_saveTodo = typeof saveTodo;
```

We use `vdb.defineCommand` to express a mutation of backend data.
When saveTodo being executed, the affectedTables will be used to find corresponding queries.


```ts
async onEnter() {
    if (!this.content) {
        return;
    }
    await rpc.saveTodo({ content: this.content });
    this.content = '';
}
```

So when we hit enter key, `rpc.saveTodo` will send a request to server add the todo, also fetch the latest todo list back.
If we get `affectedTables` wrong, the UI and backend data will be out of sync.
If the server data is not mutated by current browser page, but mutated by another user, the UI will NOT be refreshed.

## rpcProvider

vue-db does not mandate which RPC protocol to use.

```ts
export const app = createApp(App);
app.use(vdb, {
    // wait 200 milliseconds before showing loading indicator
    loadingPreDelay: 200,
    // once loading indicator is shown, at least show it for 1000 milliseconds
    loadingPostDelay: 1000,
    rpcProvider: async (queries, command) => {
        try {
            // this is just an example, the actual wire-protocol is up to you
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
```

when `app.use(vdb, options)` the options can define a rpcProvider to specify how rpc should be done.
As we can see everytime rpcProvider being called, it is provided with the command to execute as well as the queries need to be refreshed AFTER command being executed.
You can send both command and queries together in one RPC roundtrip if your server supports that, or you can do command first then send queries.

## How about complex queries?

It is common mistake to send complex query, even complete SQL via public network.
vue-db leave the server to define complex SQL or other domain specific transformation.
The client just need to tell server what "table" to fetch from, with what criteria (just a `Record<string, any>`).
The server might map to a physical mysql table, or the "table" cloud just be a SQL, or whatever the server developer choose.

For example if want to query for the most recent todo, we can declare

```ts
vdb.defineResource<T_Todo>('recent_todo', {
    sourceTables: ['todo']
})
```

When server get the query of recent_todo, it might filter out and sort todo by date.
The sourceTables are used to decide if command affectedTables will trigger this query to re-run.