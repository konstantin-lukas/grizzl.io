<script setup lang="ts">
import { clsx } from "clsx/lite";

const baseClass = clsx(
    "animate-pulse-blur",
    "absolute",
    "rounded-full",
    "blur-3xl",
    "size-[150dvmin]",
    "top-1/2",
    "left-1/2",
);
const circle1 = clsx(baseClass, "bg-violet-500", "-translate-x-full");
const circle2 = clsx(baseClass, "bg-rose-500", "-translate-y-full");
</script>

<template>
    <div class="fixed h-dvh w-dvw opacity-50 dark:opacity-25">
        <div :class="circle1" />
        <div :class="circle2" />
    </div>
    <div class="flex h-main-height items-center justify-center">
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
