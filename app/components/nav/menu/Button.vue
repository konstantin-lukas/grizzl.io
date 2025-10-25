<script setup lang="ts">
import { clsx } from "clsx/lite";

const { toggle, isOpen } = useMenu();
const className = computed(() => {
    const baseClassName = clsx(
        "absolute left-1/2 h-[3px] w-full origin-center -translate-x-1/2 rounded-full bg-front transition-all ease-bezier",
    );
    const top = clsx(baseClassName, "top-0.75", isOpen.value && "top-1/2 -translate-y-1/2 rotate-225");
    const bottom = clsx(baseClassName, "bottom-0.75", isOpen.value && "bottom-1/2 translate-y-1/2 rotate-135");
    return { top, bottom };
});
</script>

<template>
    <UButton
        color="neutral"
        variant="ghost"
        class="fixed top-4 left-4 z-50 h-10 w-10 cursor-pointer"
        :aria-label="$t('menu.aria.toggleMenu')"
        data-test-id="menu-button"
        @click="toggle"
    >
        <span class="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-1/2">
            <span :class="className.top" />
            <span :class="className.bottom" />
        </span>
    </UButton>
</template>
