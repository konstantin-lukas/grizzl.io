<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { type Account, type PostAccount, PostAccountSchema } from "#shared/finance/validators/account.validator";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import H1 from "~/core/components/typo/H1.vue";
import useOnSubmit from "~/core/composables/useOnSubmit";
import useAccounts from "~/finance/composables/useAccounts";
import { getCurrencies } from "~/finance/utils/currency";

const { initialState = null } = defineProps<{ initialState?: Account }>();
const emit = defineEmits(["success"]);
const isInsert = computed(() => initialState === null);

const { refresh } = useAccounts();
const { locale } = useI18n();

const open = defineModel<boolean>("open");
const currencyOptions = computed(() => getCurrencies(LOCALES.find(({ code }) => code === locale.value)!.language));

const emptyState = {
    title: "",
    currency: "",
};

const state = reactive<PostAccount>({
    ...emptyState,
    ...initialState,
});

watch(open, newOpen => {
    if (!newOpen) return;
    Object.assign(state, initialState ?? emptyState);
});

const onSubmit = useOnSubmit({
    url: () => (isInsert.value ? "/api/finance/accounts" : `/api/finance/accounts/${initialState?.id}`),
    method: () => (isInsert.value ? "POST" : "PUT"),
    state,
    emit,
    refresh,
    translationKey: "finance.account",
    interpolations: d => ({ title: d.title }),
});
</script>

<template>
    <Drawer v-model:open="open">
        <BaseUpsertForm
            :schema="PostAccountSchema"
            :state="state"
            :mode="isInsert ? 'insert' : 'update'"
            @submit.prevent="onSubmit"
        >
            <template #heading>
                <H1>{{ $t(`finance.account.aria.drawer.${isInsert ? "create" : "edit"}`) }}</H1>
            </template>
            <template #default>
                <UFormField :label="$t('finance.account.form.title')" name="title" class="w-full" required>
                    <UInput
                        v-model="state.title"
                        class="w-full"
                        :maxlength="TITLE_MAX"
                        data-test-id="finance-upsert-title-input"
                    />
                </UFormField>
                <UFormField :label="$t('finance.account.form.currency')" name="currency" class="w-full" required>
                    <USelectMenu
                        v-model="state.currency"
                        :disabled="!isInsert"
                        class="w-full"
                        value-key="id"
                        :items="currencyOptions"
                        data-test-id="finance-upsert-currency-select"
                    >
                        <template #item-label="{ item }">
                            <span data-test-id="finance-upsert-currency-select-option">{{ item.label }}</span>
                        </template>
                    </USelectMenu>
                </UFormField>
            </template>
        </BaseUpsertForm>
        <template #title>{{ $t(`finance.account.aria.drawer.${isInsert ? "create" : "edit"}`) }}</template>
        <template #description>{{ $t("finance.account.aria.drawer.description") }}</template>
    </Drawer>
</template>
