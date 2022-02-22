# Motivation

Submit a form requires dump its state out and send to backend.
Showing validation error requires bind backend returned error messages into corresponding form components.
We do not want to maintain a separate copy of form state, we think the UI as source of truth.
After all, user types input into the textboxes and dropdowns, whatever is in there is the "master copy" of data.

## vdb.walk

```ts
const form = {};
vdb.walk(this, 'fillForm', form);
console.log('!!! submit', form);
```

There are so many ui components, we do not know which one has the state we want.
Instead of hardcode the list of components in submit event handler, we `vdb.walk` the ui subtree of this.
Every component will be asked if it has a method called `fillForm`, and fill the form if it can.
Then the data collected into form object can be submitted to backend via `JSON.stringify`.

Showing validation error is just the same process. We just need to define a method called `showError`, every form component defined with this method will be able to show error.