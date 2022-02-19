<script lang="ts">
import { defineComponent } from 'vue-db';

export default defineComponent({}, class {
    count = 1;

    increase() {
        this.count += 1;
    }
});
</script>
<template>
    <input type="textbox" :value="count"/>
</template>