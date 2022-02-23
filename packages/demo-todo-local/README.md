# Motivation

Sometimes the form is dynamic, user can add and remove entry in the runtime.
Often we need to maintain a javascript array to do this, and render the UI according the array data,
which basically maintains a copy of the state.
vue-db aims to remove mutable state as many as we can.

## vdb.waitForNextTick

```ts
async onEnter() {
    if (!this.content) {
        return;
    }
    const todoList = vdb.load(TodoList, { $root: vdb.pageOf(this) });
    const todoItem = await todoList.add();
    todoItem.init(this.content);
    this.content = '';
}
```

When a new todo being entered, a extra TodoListItem need to be rendered. We can TodoList.add to do just that.

```ts
async add() {
    const newId = `${new Date().getTime()}`;
    this.itemIds.push(newId);
    await vdb.waitNextTick();
    return vdb.load(TodoListItem, { $parent: this, itemId: newId });
}
```

to show a extra TodoItem, we need to expand itemIds, which is used in the template

```vue
<template>
   {{ completedCount }} out of {{ itemIds.length }} items completed
    <TodoListItem v-for="itemId in itemIds" :key="itemId" :itemId="itemId" />
</template>
```

As vue rendering is not immediate, we need to `vdb.waitNextTick` to be able to get the newly added instance.
Buy keeping `itemIds` as just a `string[]`, we remove the need to copy full Todo properties to the array.
The TodoListItem instance is used to hold the state.
If Todo is a more complex nested object, we can save a lot of two way data binding this way.