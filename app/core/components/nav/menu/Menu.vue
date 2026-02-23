<script setup lang="ts">
import BlockLink from "~/core/components/nav/BlockLink.vue";
import LangSelect from "~/core/components/nav/menu/LangSelect.vue";
import SessionButton from "~/core/components/nav/menu/SessionButton.vue";
import ThemeToggle from "~/core/components/nav/menu/ThemeToggle.vue";
import GrizzlLogo from "~/core/components/svg/GrizzlLogo.vue";
import useEventListener from "~/core/composables/useEventListener";
import useMenu from "~/core/composables/useMenu";
import { APP_NAV } from "~/core/constants/nav.constant";

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
        class="fixed top-0 left-0 z-40 flex h-dvh w-dvw items-center justify-center bg-back/30 transition-all duration-300"
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
                    <GrizzlLogo class="w-full fill-front" />
                </NuxtLink>
                <ul class="flex flex-col gap-6">
                    <li
                        v-for="[link, icon, disabled] in APP_NAV"
                        :key="link"
                        class="w-full"
                        :data-test-id="`menu-list-item-${link}`"
                        :aria-hidden="disabled || undefined"
                    >
                        <BlockLink :to="`/${link}`" :data-test-id="`menu-link-${link}`" :disabled @click="close">
                            <UIcon :name="icon" size="1.25rem" />
                            {{ $t(`ui.${link}`) }}
                        </BlockLink>
                    </li>
                    <li class="w-full"><SessionButton /></li>
                </ul>
            </nav>
        </div>
        <div
            class="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-6 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]"
        >
            <span class="select-none" data-test-id="app-version">
                {{ $config.public.version }}
            </span>
        </div>
        <ThemeToggle />
        <LangSelect />
    </div>
</template>
