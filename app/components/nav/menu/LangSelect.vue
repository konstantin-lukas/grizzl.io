<script setup lang="ts">
import * as uiLocales from "@nuxt/ui/locale";
import { z } from "zod";
import * as zodLocales from "zod/locales";

const { locale, setLocale, locales } = useI18n();
const selectedLang = ref(locale.value);
watch(locale, newLocale => {
    selectedLang.value = newLocale;
    z.config(zodLocales[newLocale]());
});
</script>

<template>
    <ULocaleSelect
        v-model="selectedLang"
        class="fixed right-4 bottom-4"
        :locales="locales.map(loc => uiLocales[loc.code])"
        @update:model-value="setLocale($event as never)"
    />
</template>
