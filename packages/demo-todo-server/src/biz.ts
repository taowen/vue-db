import { AsyncContext } from "./db";

class Todo {
    id: string;
    content: string;
}

export type { Todo };

async function query(ctx: AsyncContext, req: any) {
}

async function saveTodo(ctx: AsyncContext, req: { content: string }) {
}

async function deleteTodo(ctx: AsyncContext, todoId: string) {
}

