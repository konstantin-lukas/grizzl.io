<script setup lang="ts">
import { LOCALES } from "#shared/constants/i18n";

const { locale, setLocale } = useI18n();
const selectedLang = ref(locale.value);
watch(locale, newLocale => {
    selectedLang.value = newLocale;
});
</script>

<template>
    <ULocaleSelect
        v-model="selectedLang"
        class="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
        :locales="LOCALES.map(loc => loc.uiLocale)"
        data-test-id="lang-select"
        @update:model-value="setLocale($event as never)"
    />
</template>
