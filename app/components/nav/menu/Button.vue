<script setup lang="ts">
const { toggle, isOpen } = useMenu();
const baseClass = tw`absolute left-1/2 h-[3.5px] w-full origin-center -translate-x-1/2 rounded-full transition-all ease-bezier sm:h-[3px]`;
const isOnline = useOnlineStatus();
</script>

<template>
    <Button
        color="neutral"
        variant="ghost"
        class="fixed top-[calc(1rem_+_env(safe-area-inset-top))] left-4 z-50 size-10 cursor-pointer hover-none:size-12"
        :aria-label="$t('menu.aria.toggleMenu')"
        data-test-id="menu-button"
        @click="toggle"
    >
        <span class="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-1/2">
            <span
                class="top-0.75"
                :class="{
                    [baseClass]: true,
                    'bg-front': isOnline,
                    'bg-back': !isOnline,
                    'top-1/2 -translate-y-1/2 rotate-225': isOpen,
                }"
            />
            <span
                class="bottom-0.75"
                :class="{
                    [baseClass]: true,
                    'bg-front': isOnline,
                    'bg-back': !isOnline,
                    'bottom-1/2 translate-y-1/2 rotate-135': isOpen,
                }"
            />
        </span>
    </Button>
</template>
