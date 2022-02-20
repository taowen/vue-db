export class AsyncContext {
    modifiedTables: string[] = [];
}

let nextId = 1;
const inMemDb: Record<string, Record<string, any>> = {};

async function insertRow(ctx: AsyncContext, table: string, row: any) {
}

async function deleteRow(ctx: AsyncContext, table: string, id: string) {
}