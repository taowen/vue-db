# Motivation

* If fetch data when component mounted, it might be too late. It is better to send query before the data is needed
* In the same time, we do not want write code in two places. Data fetching and data use should happen in same file for reading convenience
* Data has dependency, if we do not know province id, we can query for cities of that province. This means the client need to wait for server response before sending consequent rquests
* Use static type checking to ensure data protocol compatibility

Essentially, we want to have a type safe graph query live side by side with vue component, just like https://relay.dev/

## Nested resource definition

in DistrictBox.vue, we define

```ts
<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import type { T_District } from './fakeServer';

export const District = vdb.defineResource<T_District>('district')
    .pick('name');

export default defineComponent({
    props: {
        district: { default: vdb.castTo(undefined, District) }
    },
})
</script>
<template>
    <div>District: {{ district.name }}</div>
</template>
```

This is the leaf level. The component takes a prop called district of type District, we use `vdb.castTo` to make [volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) infer prop type properly.

Then in CityBox.vue, we define

```ts
<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import { District } from './DistrictBox.vue';
import type { T_City } from './fakeServer';
import DistrictBox from './DistrictBox.vue';

export const City = vdb.defineResource<T_City>('city')
    .query('districts', District, { 'cityId': '$parent.id' });

export default defineComponent({
    props: {
        city: { default: vdb.castTo(undefined, City) }
    },
    components: { DistrictBox }
})
</script>
<template>
    <div>
        City: {{ city.name }}
        <div style="margin-left: 32px">
            <DistrictBox :district="district" v-for="district in city.districts" />
        </div>
    </div>
</template>
```

Instead of repeating District here, we compose City resource with District imported from DistrictBox.vue.
This is similar to the concept of [Fragment](https://relay.dev/docs/guided-tour/rendering/fragments/) in [Relay](https://relay.dev/).

`$parent.id` refers to the id of city. For each city, we query its districts.
by defining `.query('districts')`, volar can infer there is a property `city.districts` and will provide code completion hint in the template section.

Then in ProvinceBox.vue

```ts
<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import type { T_Province } from './fakeServer';
import { City } from './CityBox.vue';
import CityBox from './CityBox.vue';

export const Province = vdb.defineResource<T_Province>('province')
    .query('cities', City, { 'provinceId': '$parent.id' });

export default defineComponent({
    props: {
        province: { default: vdb.castTo(undefined, Province) }
    },
    components: { CityBox }
})
</script>
<template>
    <div>
        Province: {{ province.name }}
        <div style="margin-left: 32px">
            <CityBox :city="city" v-for="city in province.cities" />
        </div>
    </div>
</template>
```

The type inference still works, we can access `province.cities[0].districts[0].name` from template section, and typescript will check the type statically.

## vdb.query

We can query in advance. Although CityBox.vue declares it is async data dependency via City resource, the query can be started before CityBox.vue rendering.

In CountryBox.vue, we start the query for all its children

```ts
<script lang="ts">
import { defineComponent } from "vue";
import * as vdb from 'vue-db';
import { Province } from "./ProvinceBox.vue";
import ProvinceBox from "./ProvinceBox.vue";

export default defineComponent({
    data() {
        return {
            provinces: vdb.query(Province)
        };
    },
    components: { ProvinceBox }
})
</script>
<template>
    <ProvinceBox v-for="province in provinces.data" :province="province" />
</template>
```

When query executes, the rpcProvider will be called

```ts
import { createApp } from 'vue'
import App from './App.vue'
import * as vdb from 'vue-db';

export const app = createApp(App);
app.use(vdb, {
    rpcProvider: async (queries) => {
        console.log('queries', JSON.stringify(queries, undefined, '  '));
        queries[0].resolve([{
            id: '1',
            name: 'jiangxi',
            cities: [{
                id: '2',
                name: 'nanchang',
                districts: [{
                    id: '3',
                    name: 'xihu'
                }, {
                    id: '4',
                    name: 'donghu'  
                }, {
                    id: '5',
                    name: 'xinjian'
                }]
            }]
        }, {
            id: '6',
            name: 'jilin'
        }]);
    }
} as vdb.InstallOptions);
app.mount('#app')
```

the JSON encoded query is

```json
{
"resource": {
    "table": "province",
    "subResources": {
    "cities": {
        "resource": {
        "table": "city",
        "subResources": {
            "districts": {
            "resource": {
                "table": "district"
            },
            "dynamicCriteria": {
                "cityId": "$parent.id"
            }}
        }},
        "dynamicCriteria": {
            "provinceId": "$parent.id"
        }
    }}
},
"criteria": {}
}
```

This JSON format is for debugging purpose, the actual RPC request format is up to you.