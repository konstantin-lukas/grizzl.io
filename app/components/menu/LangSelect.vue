<script setup lang="ts">
import * as uiLocales from "@nuxt/ui/locale";

const { locale, setLocale, locales } = useI18n();
const selectedLang = ref(locale.value);
watch(locale, newLocale => {
    selectedLang.value = newLocale;
});
</script>

<template>
    <ULocaleSelect
        v-model="selectedLang"
        class="fixed bottom-4 right-4"
        :locales="locales.map(loc => uiLocales[loc.code])"
        @update:model-value="setLocale($event as never)"
    />
</template>

<style scoped></style>
