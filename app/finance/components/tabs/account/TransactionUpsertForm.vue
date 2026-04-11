<script setup lang="ts">
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { PostTransactionSchema } from "#shared/finance/validators/transaction.validator";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import H1 from "~/core/components/typo/H1.vue";
import useLocale from "~/core/composables/useLocale";
import useOnSubmit from "~/core/composables/useOnSubmit";
import CurrencyInput from "~/finance/components/CurrencyInput.vue";
import CategoryIconSelect from "~/finance/components/tabs/account/CategoryIconSelect.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useCategories from "~/finance/composables/useCategories";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import type { Transaction } from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { initialState = null } = defineProps<{ initialState?: Transaction }>();
const emit = defineEmits(["success"]);
const isInsert = computed(() => initialState === null);

const { openAccountId, openAccount } = useAccounts();
const { categories } = useCategories();
const categoryNames = computed(() => categories.value.map(({ displayName }) => displayName));
const refresh = useRefreshTransactions();

const open = defineModel<boolean>("open");
const { language } = useLocale();

const state = reactive({
    ...{
        reference: "",
        category: { name: "", icon: "question-mark-rounded" },
        amount: 0,
    },
    ...{ ...initialState, reference: initialState?.reference || "" },
});

watch(open, newOpen => {
    if (!newOpen) return;

    if (initialState) {
        state.reference = initialState.reference ?? "";
        state.amount = initialState.amount;
        state.category.name = initialState.category.name;
        state.category.icon = initialState.category.icon;
        return;
    }
    const emptyState = {
        reference: "",
        category: { name: "", icon: "question-mark-rounded" },
        amount: 0,
    };

    state.reference = emptyState.reference;
    state.amount = emptyState.amount;
    state.category.name = "";
    state.category.icon = emptyState.category.icon;
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
    translationKey: "finance.transaction",
    interpolations: d => ({ amount: formatCurrency(language.value, openAccount.value!.currency, d.amount) }),
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
                <H1>{{ $t(`finance.transaction.aria.drawer.${isInsert ? "create" : "edit"}`) }}</H1>
            </template>
            <template #default>
                <UFormField :label="$t('finance.amount')" name="amount" class="w-full" required>
                    <CurrencyInput
                        v-model="state.amount"
                        :currency="openAccount!.currency"
                        :locale="language"
                        class="w-full"
                        data-test-id="transaction-upsert-amount-input"
                    />
                </UFormField>
                <div class="flex w-full">
                    <UFormField :label="$t('finance.category')" name="category.name" class="w-full" required>
                        <UInputMenu
                            v-model="state.category.name"
                            autocomplete
                            :items="categoryNames"
                            class="w-full"
                            :maxlength="TITLE_MAX"
                        />
                    </UFormField>
                    <div class="ml-4 translate-y-4">
                        <CategoryIconSelect
                            v-model="state.category.icon"
                            :category-name="state.category.name"
                            :categories
                        />
                    </div>
                </div>
                <UFormField :label="$t('finance.reference')" name="reference" class="w-full">
                    <UInput
                        v-model="state.reference"
                        class="w-full"
                        :maxlength="TITLE_MAX"
                        data-test-id="transaction-upsert-reference-input"
                    />
                </UFormField>
            </template>
        </BaseUpsertForm>
        <template #title>{{ $t(`finance.transaction.aria.drawer.${isInsert ? "create" : "edit"}`) }}</template>
        <template #description>{{ $t("finance.transaction.aria.drawer.description") }}</template>
    </Drawer>
</template>
