<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';
import type { T_District } from './fakeServer';

export const District = vdb.defineResource<T_District>('district');

export default defineComponent({
    props: {
        district: { default: vdb.castTo(undefined, District) }
    },
})
</script>
<template>
<div>
    District: {{ district.name }}
</div>
</template>