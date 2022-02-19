<script lang="ts">
import { defineComponent, dumpForm } from "vue-db";
import InputField from "./InputField.vue";

export default defineComponent({ components: { InputField } }, class { 
    onSubmit() {
        console.log('!!! submit', dumpForm(this));
    }
});
</script>
<template>
    <form>
        <fieldset>
            <InputField label="User Name:" name="username" />
            <InputField label="Hobby:" name="hobby" />
            <button type="submit" @click.prevent="onSubmit">submit</button>
        </fieldset>
    </form>
</template>
<style scoped>
fieldset {
    width: 800px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    align-items: flex-end;
}
</style>