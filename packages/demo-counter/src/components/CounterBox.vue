<script lang="ts">
import * as vdb from 'vue-db';

export default vdb.defineComponent({
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