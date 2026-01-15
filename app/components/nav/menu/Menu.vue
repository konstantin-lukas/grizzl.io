<script setup lang="ts">
import { APP_NAV } from "@/constants/nav";

const { isOpen, close } = useMenu();
useEventListener(window, "keydown", e => {
    if ((e as KeyboardEvent).key === "Escape") close();
});
</script>

<template>
    <div
        id="menu"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('menu.aria.title')"
        data-test-id="menu"
        class="fixed top-0 left-0 z-40 flex h-[100dvh] w-[100dvw] items-center justify-center bg-back/30 transition-all duration-300"
        :class="{ 'invisible opacity-0': !isOpen, 'backdrop-blur-lg': isOpen }"
        :aria-hidden="!isOpen || undefined"
    >
        <div class="max-h-full w-full overflow-auto">
            <nav class="center m-auto py-20" :aria-label="$t('menu.aria.mainNav')" data-test-id="menu-main-nav">
                <NuxtLink
                    to="/"
                    class="mb-8 block w-[75dvw] sm:w-80"
                    :aria-label="$t('menu.aria.goToHome')"
                    data-test-id="menu-link-home"
                    @click="close"
                >
                    <SvgGrizzlLogo class="w-full fill-front" />
                </NuxtLink>
                <ul class="flex flex-col gap-6">
                    <li
                        v-for="[link, icon, disabled] in APP_NAV"
                        :key="link"
                        class="w-full"
                        :data-test-id="`menu-list-item-${link}`"
                        :aria-hidden="disabled || undefined"
                    >
                        <NavBlockLink :to="`/${link}`" :data-test-id="`menu-link-${link}`" :disabled @click="close">
                            <UIcon :name="icon" size="1.25rem" />
                            {{ $t(`ui.${link}`) }}
                        </NavBlockLink>
                    </li>
                    <li class="w-full"><NavMenuSessionButton /></li>
                </ul>
            </nav>
        </div>
        <div
            class="absolute bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] left-6 sm:bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))]"
        >
            <span class="select-none" data-test-id="app-version">
                {{ $config.public.version }}
            </span>
        </div>
        <NavMenuThemeToggle />
        <NavMenuLangSelect />
    </div>
</template>
