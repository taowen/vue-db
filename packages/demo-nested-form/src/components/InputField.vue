<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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