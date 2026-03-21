<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import type { PostAccount } from "#shared/finance/validators/account.validator";
import Drawer from "~/core/components/overlay/Drawer.vue";
import { getCurrencies } from "~/finance/utils/currency";

const state = reactive<PostAccount>({
    title: "",
    currency: "",
});

const { locale } = useI18n();

const currencyOptions = computed(() => getCurrencies(LOCALES.find(({ code }) => code === locale.value)!.language));
</script>

<template>
    <Drawer>
        <UForm>
            <UFormField :label="'Title (add translation)'" name="title" class="w-full" required>
                <UInput
                    v-model="state.title"
                    class="w-full"
                    :maxlength="TITLE_MAX"
                    data-test-id="finance-upsert-title-input"
                />
            </UFormField>
            <UFormField :label="'Currency (add translation)'" name="currency" class="w-full" required>
                <USelectMenu
                    v-model="state.currency"
                    class="w-full"
                    value-key="id"
                    :items="currencyOptions"
                    data-test-id="finance-upsert-currency-select"
                />
            </UFormField>
        </UForm>
        <template #title>{{ $t("timer.aria.drawer.create") }}</template>
        <template #description>{{ $t("timer.aria.drawer.description") }}</template>
    </Drawer>
</template>
