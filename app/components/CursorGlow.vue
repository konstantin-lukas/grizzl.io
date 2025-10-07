<script setup lang="ts">
import { useMouse } from "@vueuse/core";
import { useTemplateRef } from "vue";

const cursor = useTemplateRef("cursor-glow");

const { x, y, sourceType } = useMouse({ initialValue: { x: -1, y: -1 }, resetOnTouchEnds: true });
const hasTouched = computed((): boolean => {
    if (sourceType.value === "touch") return true;
    return hasTouched.value ?? false;
});

function animateMouse() {
    if (cursor.value && sourceType.value === "mouse") {
        cursor.value.style.top = `${y.value}px`;
        cursor.value.style.left = `${x.value}px`;
    }
    requestAnimationFrame(animateMouse);
}
callOnce(() => requestAnimationFrame(animateMouse));
</script>

<template>
    <span
        v-if="x >= 0 && y >= 0 && !hasTouched"
        ref="cursor-glow"
        class="pointer-events-none fixed top-1/2 left-1/2 -z-10 block h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(45deg,var(--color-front),var(--color-front),var(--color-front))] opacity-20 blur-[60px]"
    />
</template>
