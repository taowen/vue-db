# Motivation

Submit a form requires dump its state out and send to backend.
Showing validation error requires bind backend returned error messages into corresponding form components.
We do not want to maintain a separate copy of form state, we think the UI as source of truth.
After all, user types input into the textboxes and dropdowns, whatever is in there is the "master copy" of data.

## vdb.walk

TODO