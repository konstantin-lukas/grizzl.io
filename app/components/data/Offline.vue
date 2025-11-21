<script setup lang="ts">
const isOnline = useOnlineStatus();
</script>

<template>
    <Transition name="fade-pure">
        <div
            v-if="!isOnline"
            class="fixed top-0 left-0 z-2 flex h-18 w-full items-center justify-center gap-2 bg-front text-center text-2xl text-back"
        >
            <UIcon name="mdi:power-plug-off" class="text-back" />
            <span>Offline</span>
        </div>
    </Transition>
</template>
