<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead();
const title = computed(() => t((route.meta.title as string) || "", `Grizzl - ${t("home.tagline")}`));
const { isOpen, close } = useMenu();
watch(() => route.fullPath, close);
</script>

<template>
    <div>
        <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
            <Head>
                <Title>{{ title }}</Title>
            </Head>
            <Body>
                <NavMenu />
                <NavMenuButton />
                <main :aria-hidden="isOpen" :inert="isOpen" data-test-id="inert-container">
                    <slot />
                </main>
                <NavFooter />
            </Body>
        </Html>
    </div>
</template>
