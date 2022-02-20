# vue-db

Vue data binding with minimal code. There are two motivations

* cross component data sync, such as form
* load data from backend and keeping it up to date

It is a bit controversial to ditch so called `view model` and keeping state directly inside the `view`. "entities should not be multiplied beyond necessity"

## Form

Instead of using https://vuex.vuejs.org/ to hold the state, vue-db use the vue component instance itself as data store.

* user type inputs into the form components through ui
* in computed property, use `vdb.load` or `vdb.query` to locate the data source and keep data in sync
* when submit, use `vdb.walk` to walk component tree to dump the form state out

Checkout following examples

| code | live | demo | 
| --- | --- |
| [counter](./packages/demo-counter/) | counter | `vdb.load` with $root from current page |
| [flat form](./packages/demo-flat-form) | flat form | `vdb.walk` to dump form state |
| [nested form](./packages/demo-nestd-form) | nested form | `vdb.load` with $parent allowing multiple form instances |
| [todo list](./packages/demo-todo-local/) | todo list | `vdb.waitNextTick` to add new todo item |

## Async data binding

Data from backend need to be loaded asynchronously. Instead of using a mutable https://vuex.vuejs.org/ store to hold the backend data, vue-db provides async data binding to remove the extra state.

TODO