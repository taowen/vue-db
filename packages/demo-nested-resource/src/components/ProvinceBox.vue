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