<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead();
const title = computed(() => t((route.meta.title as string) || "", t("title")));
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
                <slot />
            </Body>
        </Html>
    </div>
</template>
