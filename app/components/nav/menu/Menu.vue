<script setup lang="ts">
import { APP_NAV } from "@/constants/nav";

const { isOpen } = useMenu();
</script>

<template>
    <header
        id="menu"
        class="fixed top-0 left-0 z-40 flex h-[100dvh] w-[100dvw] items-center justify-center bg-back/30 transition-all duration-300"
        :class="{ 'invisible opacity-0': !isOpen, 'backdrop-blur-lg': isOpen }"
        :aria-hidden="!isOpen"
    >
        <div class="max-h-full w-full overflow-auto">
            <nav class="m-auto flex flex-col items-center justify-center py-20" :aria-label="$t('menu.aria.mainNav')">
                <NuxtLink to="/" class="mb-8 block w-[75dvw] sm:w-80" :aria-label="$t('menu.aria.goToHome')">
                    <SvgGrizzlLogo class="w-full fill-front" />
                </NuxtLink>
                <ul class="flex flex-col gap-6">
                    <li v-for="[link, icon] in APP_NAV" :key="link" class="w-full">
                        <NavBlockLink :to="`/${link}`" :data-test-id="`menu-link-${link}`">
                            <UIcon :name="icon" size="1.25rem" />
                            {{ $t(`menu.${link}`) }}
                        </NavBlockLink>
                    </li>
                    <li class="w-full"><NavMenuSessionButton /></li>
                </ul>
            </nav>
        </div>
        <div class="absolute bottom-3 left-4">
            <span class="select-none">
                {{ $config.public.version }}
            </span>
        </div>
        <NavMenuThemeToggle />
        <NavMenuLangSelect />
    </header>
</template>

<style scoped></style>
