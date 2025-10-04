<script setup lang="ts">
import { clsx } from "clsx/lite";

const { isOpen } = useMenu();
const headerClass = computed(() =>
    clsx(
        "w-[100dvw]",
        "h-[100dvh]",
        "bg-back/30",
        "fixed",
        "top-0",
        "left-0",
        "z-40",
        "flex",
        "justify-center",
        "items-center",
        "transition-all",
        "duration-300",
        !isOpen.value && "opacity-0",
        !isOpen.value && "invisible",
        isOpen.value && "backdrop-blur-lg",
    ),
);
</script>

<template>
    <header id="menu" :class="headerClass" :aria-hidden="!isOpen">
        <div class="max-h-full w-full overflow-auto">
            <nav class="m-auto flex flex-col items-center justify-center py-20" aria-label="Main site navigation">
                <ul class="flex flex-col gap-6">
                    <li class="w-full"><MenuSessionButton /></li>
                </ul>
            </nav>
        </div>
        <MenuThemeToggle />
    </header>
</template>

<style scoped></style>
