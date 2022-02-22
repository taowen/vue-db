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