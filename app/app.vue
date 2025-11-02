<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";
import { z } from "zod";
import * as zodLocales from "zod/locales";

const { locale } = useI18n();
onMounted(() => {
    z.config(zodLocales[locale.value]());
});
</script>

<template>
    <UApp :locale="locales[locale]">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
