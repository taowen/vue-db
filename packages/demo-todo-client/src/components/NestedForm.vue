<script lang="ts">
import { defineComponent } from "vue";
import * as vdb from "vue-db";
import AddressForm from './AddressForm.vue';
import { dumpForm } from "./dumpForm";

export default defineComponent({
    created: vdb.onCreated,
    components: { AddressForm },
    methods: {
        onSend() {
            console.log('send', dumpForm(this));
        }
    }
});
</script>
<template>
    <form>
        <AddressForm name="fromAddr" legend="Send From" />
        <AddressForm name="toAddr" legend="Send To" />
        <button type="submit" @click.prevent="onSend">Send</button>
    </form>
</template>
<style scoped>
form {
    width: 800px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    align-items: flex-end;
}
</style>