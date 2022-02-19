# vue-db

vue data binding with minimal code

## Form

Instead of using https://vuex.vuejs.org/ to hold the state, vue-db use the vue component instance itself as data store.

* in computed property, we use `vdb.load` or `vdb.query` to locate the data source and keep data in sync
* in submit, we use `vdb.walk` to walk component tree to dump the form state out

checkout following examples

| example | demo |
| --- | --- |
| [counter](./packages/demo-counter/) | vdb.load with $root from current page |
| [flat form](./packages/demo-flat-form) | vdb.walk to dump form state |
| [nested form](./packages/demo-nestd-form) | vdb.load with $parent allowing multiple form instances |