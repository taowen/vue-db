<script lang="ts">
import { defineComponent } from "vue";
import * as vdb from 'vue-db';

export default defineComponent({
    props: ['color'],
    data() {
        return {
            left: 0
        }
    },
    mounted() {
        // bind animated props
        vdb.animate(this.$refs.myDiv, () => {
            return {
                style: {
                    left: `${this.left}px`
                }
            }
        });
        (async () => {
            while (true) {
                await vdb.sleep(500);
                this.left += 20;
            }
        })();
    }
})
</script>
<template>
    <div :style="{ position: 'absolute', backgroundColor: color }" ref="myDiv">
        <slot />
    </div>
</template>