<script setup lang="ts">
</script>
<template>
    <router-view v-slot="{ Component, route }">
        <transition name="fade">
            <keep-alive>
                <component :is="Component" :key="route.path" />
            </keep-alive>
        </transition>
    </router-view>
</template>
<style>
.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>