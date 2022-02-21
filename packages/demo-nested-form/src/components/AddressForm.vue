<script lang="ts">
import { defineComponent } from "vue";
import * as vdb from "vue-db";
import { dumpForm } from './dumpForm';
import InputField from './InputField.vue';
import SelectField from './SelectField.vue';

export default defineComponent({
    components: { SelectField, InputField },
    props: {
        name: {
            required: true,
            type: String
        },
        legend: {
            default: 'Address'
        }
    },
    data() {
        return {
            provinces: [{ id: 'jiangxi', name: 'jiangxi' }, { id: 'hubei', name: 'hubei' }]
        }
    },
    computed: {
        cities() {
            // there might be multiple instance of AddressForm, 
            // use $parent to locate the child of this
            const province = vdb.load(SelectField, { $parent: this, name: 'province' })?.selected;
            const cities = {
                jiangxi: [{
                    id: 'nanchang', name: 'nanchange'
                }, {
                    id: 'jiujiang', name: 'jiujiang'
                }],
                hubei: [{
                    id: 'wuhan', name: 'wuhan'
                }, {
                    id: 'huangshi', name: 'huangshi'
                }]
            }[province]
            return cities || [];
        }
    },
    methods: {
        fillForm(form: Record<string, any>) {
            form[this.name] = dumpForm(this);
        }
    }
})
</script>
<template>
    <fieldset>
        <legend>{{ legend }}</legend>
        <div class="fields">
            <SelectField label="province:" name="province" :options="provinces" />
            <SelectField label="city:" name="city" :options="cities" />
            <InputField label="street:" name="street" />
        </div>
    </fieldset>
</template>
<style scoped>
.fields {
    display: flex;
    column-gap: 8px;
}
</style>