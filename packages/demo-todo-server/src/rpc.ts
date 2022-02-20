import { AsyncContext } from "./db";

export async function startRpcServer() {
}

export function registerResource(resource: string, query: (ctx: AsyncContext) => Promise<any>) {

}

type CommandHandler = (ctx: AsyncContext, req: any) => Promise<any>;

export function registerCommands(commands: Record<string, CommandHandler>) {

}