# Motivation

* If fetch data when component mounted, it might be too late. It is better to send query before the data is needed
* In the same time, we do not want write code in two places. Data fetching and data use should happen in same file for reading convenience
* Data has dependency, if we do not know province id, we can query for cities of that province. This means the client need to wait for server response before sending consequent rquests
* Use static type checking to ensure data protocol compatibility

Essentially, we want to have a type safe graph query live side by side with vue component, just like https://relay.dev/