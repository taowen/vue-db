# Motivation

A single level form is always easy. Things tend to be messy once the form become nested.
The data and UI may be aligned, may be not. Binding unaligned nested data structure is a common pain.
vue-db is designed for data intensive admin system, with lots of nested forms in mind.

## vdb.load with $parent

The first problem we need to solve is we can not assume every form to be singleton.
When `vdb.load` with $root set to current page, it can find components of other instance.

```ts
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
}
```

here we are using `$parent: this` to make the code work even if there are multiple province SelectField on the page.

## vdb.walk with nested data structure

First we use `vdb.walk` to call fillForm when onSend

```ts
onSend() {
    console.log('send', dumpForm(this));
}

export function dumpForm(proxy: any) {
    const form = {};
    vdb.walk(proxy, 'fillForm', form);
    return form;
}
```

We define different fillForm for the branch and leaf node. For AddressForm (which is branch)

```ts
// vdb.walk stops once hit a fillForm
// we start a dumpForm again for its own children
fillForm(form: Record<string, any>) {
    form[this.name] = dumpForm(this);
}
```

For InputField and SelectField (which is leaf)

```ts
fillForm(form: Record<string, any>) {
    form[this.name] = this.value;
}
```

By doing this, the collected form is like:

```json
{
    "fromAddr": {
        "province": "jiangxi",
        "city": "nanchang",
        "street": "",
    },
    "toAddr": {
        "province": "hubei",
        "city": "wuhan",
        "street": ""
    }
}
```