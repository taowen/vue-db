<script lang="ts">
import * as vdb from 'vue-db';

export default vdb.defineComponent({}, class {
    count = 1;

    increase() {
        this.count += 1;
    }
});
</script>
<template>
    <input type="textbox" :value="count"/>
</template>