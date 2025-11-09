<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead();
const title = computed(() => {
    const routeTitle = route.meta.title;
    if (typeof routeTitle === "string") {
        return `${t(routeTitle)} - ${t("meta.grizzl")}`;
    }
    return `${t("meta.grizzl")} - ${t("meta.tagline")}`;
});
const { isOpen, close } = useMenu();
watch(() => route.fullPath, close);
useHead({
    title,
    meta: [{ name: "description", content: t("meta.description") }],
});
</script>

<template>
    <div>
        <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" data-test-id="root">
            <Body>
                <teleport to="body">
                    <NuxtLoadingIndicator />
                </teleport>
                <NavMenu />
                <NavMenuButton />
                <main :aria-hidden="isOpen" :inert="isOpen" data-test-id="inert-elements" class="min-h-main-height">
                    <slot />
                </main>
                <NavFooter :aria-hidden="isOpen" :inert="isOpen" />
            </Body>
        </Html>
    </div>
</template>
