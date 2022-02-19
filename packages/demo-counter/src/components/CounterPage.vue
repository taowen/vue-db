<script setup lang="ts">
import CounterBox from './CounterBox.vue'
import PlusButton from './PlusButton.vue'
import DisplayPanel from './DisplayPanel.vue'
</script>

<template>
    <div>
        <p style="display: flex; flex-direction: row; column-gap: 8px;">
            <router-link to="/">Go to Counter1</router-link>
            <router-link to="/counter2">Go to Counter2</router-link>
        </p>
        <DisplayPanel />
        <CounterBox />
        <PlusButton />
    </div>
</template>
