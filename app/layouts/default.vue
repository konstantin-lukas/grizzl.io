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
                <main
                    :aria-hidden="isOpen"
                    :inert="isOpen"
                    data-test-id="inert-container"
                    class="box-border min-h-main-height py-20"
                >
                    <slot />
                </main>
                <NavFooter />
                <CursorGlow />
            </Body>
        </Html>
    </div>
</template>
