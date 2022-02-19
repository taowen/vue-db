import * as vdb from 'vue-db';

export function dumpForm(proxy: any) {
    const form = {};
    vdb.walk(proxy, 'fillForm', form);
    return form;
}