# Motivation

When everything is defined in same vue component, we know how to synchornize the data across different area of the UI. 
But after split the UI into several smaller components, it takes much more effort to keep data in sync.
Often the solution to this problem involves some "state lifting" or "global data store".
This demo take a trivial "counter" example into three components, to show us how vue-db sync [DisplayPanel](./src/components/DisplayPanel.vue) data with [CounterBox](./src/components/CounterBox.vue).

## vdb.load

```ts
import CounterBox from './CounterBox.vue';

export default defineComponent({
    computed: {
        displayBack() {
            const counter = vdb.load(CounterBox, { $root: vdb.pageOf(this) })?.count || 0;
            return counter + 20;
        }
    }
})
```

`vdb.load` has two arguments

1. Component Type: CounterBox is the target to search for, it is like from table of SQL
2. Criteria: the conditions of the search

Although UI is a graph, `vdb.load` works like a database in just two dimension. As long as the criteria match, all descendants of $root will be searched.

There is also a `vdb.query` api, which returns all rows matched instead of first one.

## Multiple page

When we are switching between routes, there are multiple active pages. If we search from the top, component from other vue-router page might be located. `vdb.pageOf` solves this problem, to limit search within enclosing `<keep-alive/>`.

If we are using `global data store` instead of vue-db. The state of UI component will be copied to the store. Because we allow each client side page has a separate counter, the `global data store` will need corresponding data structure to match the UI state need. Whenever we change the UI, the data store structure need to keep up. vue-db let the UI itself to host its own data, and treat it as a `database`, it removes the need of extra copy of state.