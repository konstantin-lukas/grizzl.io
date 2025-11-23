<script setup lang="ts">
import { LOCALES } from "#shared/constants/i18n";
import { setDefaultOptions } from "date-fns";
import { z } from "zod";

const { locale } = useI18n();
const uiLocale = ref();
watch(
    locale,
    () => {
        const localeInformation = LOCALES.find(loc => loc.code === locale.value)!;
        uiLocale.value = localeInformation.uiLocale;
        z.config({
            ...localeInformation.zodLocale,
            customError: ({ code, origin }) => {
                if ($te(`zod.${origin}.${code}`)) {
                    return $t(`zod.${origin}.${code}`);
                }
            },
        });
        setDefaultOptions({ locale: localeInformation.fnsLocale });
    },
    { immediate: true },
);
</script>

<template>
    <UApp :locale="uiLocale">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
