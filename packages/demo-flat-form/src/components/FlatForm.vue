<script lang="ts">
import { defineComponent } from "vue";
import * as vdb from "vue-db";
import InputField from "./InputField.vue";

export default defineComponent({
    created: vdb.onCreated,
    components: { InputField },
    computed: {
        username() {
            return vdb.load(InputField, { $parent: this, name: 'username' })?.value;
        },
        hobby() {
            return vdb.load(InputField, { $parent: this, name: 'hobby' })?.value;
        }
    }, methods: {
        onSubmit() {
            const form = {};
            vdb.walk(this, 'fillForm', form);
            console.log('!!! submit', form);
        }
    }
});
</script>
<template>
    <form>
        <fieldset>
            <InputField label="User Name:" name="username" />
            <InputField label="Hobby:" name="hobby" />
            <button type="submit" @click.prevent="onSubmit">submit</button>
            hello {{ username || '[username]' }}, who likes {{ hobby || '[hobby]' }}
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