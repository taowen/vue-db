<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

export default defineComponent({
    created: vdb.onCreated,
    props: {
        label: { default: '' },
        name: {
            required: true,
            type: String
        },
        options: {
            default: [] as { id: string, name: string }[]
        }
    },
    data() {
        return {
            selected: '',
        }
    },
    methods: {
        fillForm(form: Record<string, any>) {
            form[this.name] = this.selected;
        }
    }
})
</script>
<template>
    <label>{{ label }}</label>
    <select v-model="selected">
        <option value>Please select...</option>
        <option v-for="item in options" :value="item.id">{{ item.name }}</option>
    </select>
</template>