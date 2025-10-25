<script setup lang="ts">
const baseClass = tw`animate-pulse-blur absolute top-1/2 left-1/2 size-[150dvmin] rounded-full bg-primary blur-3xl`;
</script>

<template>
    <div class="fixed -z-10 h-dvh w-dvw opacity-50 dark:opacity-25">
        <div :class="{ [baseClass]: true }" class="-translate-x-full" />
        <div :class="{ [baseClass]: true }" class="-translate-y-full" />
    </div>
    <div class="flex min-h-main-height items-center justify-center">
        <slot />
    </div>
</template>

<style scoped>
@keyframes pulse-blur {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.animate-pulse-blur {
    animation: pulse-blur 20s ease-in-out infinite;
}
</style>
