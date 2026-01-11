<script setup lang="ts">
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
</script>

<template>
    <div>
        <Html
            :lang="head.htmlAttrs.lang"
            :dir="head.htmlAttrs.dir"
            data-test-id="root"
            class="not-xs:text-sm"
            translate="no"
        >
            <Body>
                <teleport to="body">
                    <NuxtLoadingIndicator />
                </teleport>
                <DataOffline />
                <NavMenu />
                <NavMenuButton />
                <div id="back-button-portal" />
                <main :aria-hidden="isOpen" :inert="isOpen" data-test-id="inert-elements" class="min-h-main-height">
                    <slot />
                </main>
                <NavFooter :aria-hidden="isOpen" :inert="isOpen" />
            </Body>
        </Html>
    </div>
</template>
