<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

export default defineComponent({
    created: vdb.onCreated,
    data() {
        return {
            count: 1
        }
    },
    methods: {
        increase() {
            this.count += 1;
        }
    }
});
</script>
<template>
    <input type="textbox" :value="count" />
</template>