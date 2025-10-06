<script setup lang="ts">
import { clsx } from "clsx/lite";

const { t } = useI18n();
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

const links = [
    ["poll", "bg-emerald-700", "heroicons:chart-pie"],
    ["todo", "bg-cyan-700", "heroicons:clipboard-document-check"],
    ["timer", "bg-purple-700", "heroicons:clock"],
    ["finance", "bg-rose-700", "heroicons:banknotes"],
] as const;
</script>

<template>
    <header id="menu" :class="headerClass" :aria-hidden="!isOpen">
        <div class="max-h-full w-full overflow-auto">
            <nav class="m-auto flex flex-col items-center justify-center py-20" :aria-label="t('menu.aria.mainNav')">
                <NuxtLink href="/" class="mb-8 block w-[75dvw] sm:w-80">
                    <SvgGrizzlLogo class="fill-front w-full" />
                </NuxtLink>
                <ul class="flex flex-col gap-6">
                    <li v-for="[link, color, icon] in links" :key="link" class="w-full">
                        <NavBlockLink :color :to="`/${link}`" :data-test-id="`menu-link-${link}`">
                            <Icon :name="icon" size="1.25rem" />
                            {{ t(`menu.${link}`) }}
                        </NavBlockLink>
                    </li>
                    <li class="w-full"><NavMenuSessionButton /></li>
                </ul>
            </nav>
        </div>
        <NavMenuThemeToggle />
        <NavMenuLangSelect />
    </header>
</template>

<style scoped></style>
