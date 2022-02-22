import express from 'express';

class Todo {
    id: string = '';
    content: string = '';
}

let todos: Todo[] = [];

export type { Todo as T_Todo };

interface Resource {
    table: string;
    staticCriteria: Record<string, any>;
    subResources: Record<string, {
        single?: boolean, // true for load, false for query
        resource: Resource,
        dynamicCriteria: Record<string, string>,
        staticCriteria?: Record<string, any>
    }>
}

interface QueryRequest {
    resource: Resource;
    criteria: Record<string, any>
}

interface CommandRequest {
    command: string;
    args: any
}

interface RpcRequest {
    queries: QueryRequest[]
    command?: CommandRequest
}

export function start() {
    const app = express()
    app.use(express.json());
    const port = 8080

    app.all('/', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });

    app.get('/', (req, res) => {
        res.send('Server is up!')
    })

    app.post('/', async (req, res) => {
        const body = req.body as RpcRequest;
        let commandResponse = body.command ? await executeCommand(body.command) : undefined;
        const queryResponses = [];
        for (const query of body.queries) {
            queryResponses.push(await executeQuery(query));
        }
        res.send(JSON.stringify({
            command: commandResponse,
            queries: queryResponses
        }))
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

async function executeCommand(command: CommandRequest) {
    switch (command.command) {
        case 'saveTodo':
            return saveTodo(command.args);
        case 'removeTodo':
            return removeTodo(command.args);
    }
    throw new Error(`unknown command: ${command.command}`)
}

function executeQuery(query: QueryRequest) {
    switch (query.resource.table) {
        case 'todo':
            return queryTodo(query);
    }
    throw new Error(`unknown table: ${query.resource.table}`)
}

function checkCriteria(row: Record<string, any>, criteria: Record<string, any>) {
    for (const [k, v] of Object.entries(criteria)) {
        if (row[k] !== v) {
            return false;
        }
    }
    return true;
}

async function queryTodo(query: QueryRequest) {
    const criteria = { ...query.resource.staticCriteria, ...query.criteria };
    const filtered = [];
    for (const row of todos) {
        if (checkCriteria(row, criteria)) {
            filtered.push(row);
        }
    }
    return filtered;
}

let nextId = 1;

async function saveTodo(args: { content: string }) {
    console.log('saveTodo', args.content);
    todos.push({ ...args, id: `${nextId++}` })
}

export type T_saveTodo = typeof saveTodo;

async function removeTodo(args: { id: string }) {
    console.log('removeTodo', args.id);
    const filtered = [];
    for (const row of todos) {
        if (row.id !== args.id) {
            filtered.push(row);
        }
    }
    todos = filtered;
}

export type T_removeTodo = typeof removeTodo;