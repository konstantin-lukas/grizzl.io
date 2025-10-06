<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead();
const title = computed(() => t((route.meta.title as string) || "", t("title")));
const { isOpen } = useMenu();
</script>

<template>
    <div>
        <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
            <Head>
                <Title>{{ title }}</Title>
            </Head>
            <Body>
                <Menu />
                <MenuButton />
                <main :aria-hidden="isOpen" :inert="isOpen" data-test-id="inert-container">
                    <slot />
                </main>
            </Body>
        </Html>
    </div>
</template>
