<script setup lang="ts">
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { PostTransactionSchema, type Transaction } from "#shared/finance/validators/transaction.validator";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import H1 from "~/core/components/typo/H1.vue";
import useLocale from "~/core/composables/useLocale";
import useOnSubmit from "~/core/composables/useOnSubmit";
import CurrencyInput from "~/finance/components/CurrencyInput.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useCategories from "~/finance/composables/useCategories";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { initialState = null } = defineProps<{ initialState?: Transaction }>();
const emit = defineEmits(["success"]);
const isInsert = computed(() => initialState === null);

const { openAccountId, openAccount } = useAccounts();
const categories = useCategories();
const categoryNames = computed(() => categories.value.map(({ displayName }) => displayName));
const refresh = useRefreshTransactions();

const open = defineModel<boolean>("open");
const { language } = useLocale();

const emptyState = {
    reference: "",
    category: { name: "", icon: "question-mark-rounded" },
    amount: 0,
} as const;

const state = reactive({
    ...emptyState,
    ...{ ...initialState, reference: initialState?.reference || "" },
});

watch(open, newOpen => {
    if (!newOpen) return;
    Object.assign(state, initialState ?? emptyState);
});

const onSubmit = useOnSubmit({
    url: () =>
        isInsert.value
            ? `/api/finance/accounts/${openAccountId.value}/transactions`
            : `/api/finance/accounts/${openAccountId.value}/transactions/${initialState?.id}`,
    method: () => (isInsert.value ? "POST" : "PUT"),
    state,
    emit,
    refresh,
    translationKey: "finance.account",
    resourceName: d => formatCurrency(language.value, openAccount.value!.currency, d.amount),
});
</script>

<template>
    <Drawer v-model:open="open">
        <BaseUpsertForm
            :schema="PostTransactionSchema"
            :state="state"
            :mode="isInsert ? 'insert' : 'update'"
            @submit.prevent="onSubmit"
        >
            <template #heading>
                <H1>{{ $t(`finance.account.aria.drawer.${isInsert ? "create" : "edit"}Transaction`) }}</H1>
            </template>
            <template #default>
                <UFormField :label="$t('finance.reference')" name="reference" class="w-full" required>
                    <UInput
                        v-model="state.reference"
                        class="w-full"
                        :maxlength="TITLE_MAX"
                        data-test-id="transaction-upsert-reference-input"
                    />
                </UFormField>
                <UFormField :label="$t('finance.amount')" name="amount" class="w-full" required>
                    <CurrencyInput
                        v-model="state.amount"
                        :currency="openAccount!.currency"
                        :locale="language"
                        class="w-full"
                        data-test-id="transaction-upsert-amount-input"
                    />
                </UFormField>
                <UFormField :label="$t('finance.category')" name="category.name" class="w-full" required>
                    <UInputMenu
                        v-model="state.category.name"
                        autocomplete
                        :items="categoryNames"
                        class="w-full"
                        :maxlength="TITLE_MAX"
                    />
                </UFormField>
            </template>
        </BaseUpsertForm>
        <template #title>{{ $t(`finance.account.aria.drawer.${isInsert ? "create" : "edit"}Transaction`) }}</template>
        <template #description>{{ $t("finance.account.aria.drawer.descriptionTransaction") }}</template>
    </Drawer>
</template>
