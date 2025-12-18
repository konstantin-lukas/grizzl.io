<script setup lang="ts">
import { LOCALES } from "#shared/constants/i18n";
import { setDefaultOptions } from "date-fns";
import { z } from "zod";

const toaster = { duration: 15000 };
const { locale } = useI18n();
const uiLocale = ref();
watch(
    locale,
    () => {
        const localeInformation = LOCALES.find(loc => loc.code === locale.value)!;
        uiLocale.value = localeInformation.uiLocale;
        z.config({
            ...localeInformation.zodLocale,
            customError: ({ code, origin, minimum, maximum, ...rest }) => {
                if ($te(`zod.${origin}.${code}`)) {
                    if (typeof minimum === "number") return $t(`zod.${origin}.${code}`, minimum);
                    if (typeof maximum === "number") return $t(`zod.${origin}.${code}`, maximum);
                    return $t(`zod.${origin}.${code}`, rest);
                }
            },
        });
        setDefaultOptions({ locale: localeInformation.fnsLocale });
    },
    { immediate: true },
);
</script>

<template>
    <UApp :locale="uiLocale" :toaster>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
