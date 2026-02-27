<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { setDefaultOptions } from "date-fns";
import { z } from "zod";
import Offline from "~/core/components/data/Offline.vue";
import Footer from "~/core/components/nav/Footer.vue";
import Menu from "~/core/components/nav/menu/Menu.vue";
import MenuButton from "~/core/components/nav/menu/MenuButton.vue";
import useMenu from "~/core/composables/useMenu";

const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead();
const title = computed(() => {
    const routeTitle = route.meta.title;
    if (typeof routeTitle === "string") {
        return `${t(routeTitle)} | ${t("meta.grizzl")} - ${t("meta.tagline")}`;
    }
    return `${t("meta.grizzl")} - ${t("meta.tagline")}`;
});
const description = computed(() => {
    return typeof route.meta.description === "string" ? t(route.meta.description) : t("meta.description");
});
const { isOpen, close } = useMenu();
watch(() => route.fullPath, close);
useHead({
    title,
    meta: [
        { name: "description", content: description },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "theme-color", content: "#047857" },
    ],
});

const toaster = { duration: 15000 };
const { locale } = useI18n();
const uiLocale = ref();
watch(
    locale,
    () => {
        const localeInformation = LOCALES.find(loc => loc.code === locale.value)!;
        uiLocale.value = localeInformation.uiLocale;
        z.config({
            ...localeInformation.zodLocale,
            customError: ({ code, origin, minimum, maximum, ...rest }) => {
                if ($te(`zod.${origin}.${code}`)) {
                    if (typeof minimum === "number") return $t(`zod.${origin}.${code}`, minimum);
                    if (typeof maximum === "number") return $t(`zod.${origin}.${code}`, maximum);
                    return $t(`zod.${origin}.${code}`, rest);
                }
            },
        });
        setDefaultOptions({ locale: localeInformation.fnsLocale });
    },
    { immediate: true },
);
</script>

<template>
    <UApp :locale="uiLocale" :toaster>
        <div>
            <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" data-test-id="root" translate="no">
                <Body>
                    <teleport to="body">
                        <NuxtLoadingIndicator />
                    </teleport>
                    <Offline />
                    <Menu />
                    <MenuButton />
                    <main :aria-hidden="isOpen" :inert="isOpen" data-test-id="inert-elements" class="min-h-main-height">
                        <slot />
                    </main>
                    <Footer :aria-hidden="isOpen" :inert="isOpen" />
                </Body>
            </Html>
        </div>
    </UApp>
</template>
