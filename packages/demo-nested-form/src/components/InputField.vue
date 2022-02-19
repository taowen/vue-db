<script lang="ts">
import * as vdb from 'vue-db';

export default vdb.defineComponent({
    props: {
        label: { default: '' },
        name: { type: String, required: true }
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        fillForm(form: Record<string, any>) {
            form[this.name] = this.value;
        }
    }
})
</script>
<template>
    <label>{{ label }}</label>
    <input type="textbox" :name="name" v-model="value" />
</template>