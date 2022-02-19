<script lang="ts">
import { defineComponent } from 'vue';
import * as vdb from 'vue-db';

let counter = 1;

export default defineComponent({
    created: vdb.onCreated,
    props: {
        name: { required: true, type: String },
        label: { default: '' },
        type: { default: 'text' }
    },
    data() {
        return {
            inputId: `input${counter++}`,
            value: ''
        }
    }, methods: {
        fillForm(form: Record<string, any>) {
            form[this.name] = this.value;
        }
    }
})
</script>
<template>
    <div class="row">
        <label :for="inputId">{{ label }}</label>
        <input :id="inputId" v-model="value" :type="type" :name="name" />
    </div>
</template>
<style scoped>
.row {
    display: flex;
    column-gap: 8px;
}
</style>