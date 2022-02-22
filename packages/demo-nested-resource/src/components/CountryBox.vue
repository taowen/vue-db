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