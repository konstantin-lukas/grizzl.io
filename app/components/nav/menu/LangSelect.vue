<script setup lang="ts">
import LOCALES from "#shared/constants/i18n";

const { locale, setLocale } = useI18n();
const selectedLang = ref(locale.value);
watch(locale, newLocale => {
    selectedLang.value = newLocale;
});
</script>

<template>
    <ULocaleSelect
        v-model="selectedLang"
        class="fixed right-4 bottom-4"
        :locales="LOCALES.map(loc => loc.uiLocale)"
        @update:model-value="setLocale($event as never)"
    />
</template>
