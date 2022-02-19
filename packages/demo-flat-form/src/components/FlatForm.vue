<script lang="ts">
import * as vdb from "vue-db";
import InputField from "./InputField.vue";

export default vdb.defineComponent({ components: { InputField } }, class { 
    get username() {
        return vdb.load(this, InputField, { name: 'username' })?.value;
    }
    get hobby() {
        return vdb.load(this, InputField, { name: 'hobby' })?.value;
    }
    onSubmit() {
        console.log('!!! submit', vdb.dumpForm(this));
    }
});
</script>
<template>
    <form>
        <fieldset>
            <InputField label="User Name:" name="username" />
            <InputField label="Hobby:" name="hobby" />
            <button type="submit" @click.prevent="onSubmit">submit</button>
            hello {{ username || '[username]' }}, who likes {{ hobby || '[hobby]'}}
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