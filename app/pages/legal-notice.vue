<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
definePageMeta({
    title: "legal.notice",
});
</script>

<template>
    <LayoutWrapper>
        <TypoH1>
            {{ $t("legal.notice") }}
        </TypoH1>
        <p class="mb-4">
            {{ runtimeConfig.public.legalEntity }}
            <br />
            {{ runtimeConfig.public.legalStreet }}
            <br />
            {{ runtimeConfig.public.legalCity }}
        </p>
        <TypoH2>{{ $t("legal.contact") }}</TypoH2>
        <p class="mb-4">
            {{ $t("legal.phone") }}: {{ runtimeConfig.public.legalPhone }}
            <br />
            {{ $t("legal.email") }}:
            <NuxtLink :href="`mailto:${runtimeConfig.public.legalEmail}`" class="inline-link inline-link-resting">
                {{ runtimeConfig.public.legalEmail }}
            </NuxtLink>
            <br />
        </p>
    </LayoutWrapper>
</template>
