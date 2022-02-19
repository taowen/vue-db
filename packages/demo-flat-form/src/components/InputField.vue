<script lang="ts">
import { defineComponent } from 'vue-db';

let counter = 1;

export default defineComponent({
    props: ['name', 'label', 'type']
}, class {
    name = '';
    label = '';
    type = 'text';
    inputId = `input${counter++}`;
    value = null as any;
    fillForm(form: Record<string, any>) {
        form[this.name] = this.value;
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