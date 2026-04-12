<script setup lang="ts">
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import {
    FINANCE_EXEC_INTERVAL_MAX,
    FINANCE_EXEC_INTERVAL_MIN,
    FINANCE_EXEC_ON_MAX,
    FINANCE_EXEC_ON_MIN,
    PostAutoTransactionSchema,
} from "#shared/finance/validators/auto-transaction.validator";
import { getLocalTimeZone, today } from "@internationalized/date";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import H1 from "~/core/components/typo/H1.vue";
import useLocale from "~/core/composables/useLocale";
import useOnSubmit from "~/core/composables/useOnSubmit";
import CurrencyInput from "~/finance/components/CurrencyInput.vue";
import CategoryIconSelect from "~/finance/components/tabs/account/CategoryIconSelect.vue";
import useAccounts from "~/finance/composables/useAccounts";
import type { AutoTransaction } from "~/finance/composables/useAutoTransactions";
import useCategories from "~/finance/composables/useCategories";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { initialState = null } = defineProps<{ initialState?: AutoTransaction }>();
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
        execInterval: 1,
        execOn: 1,
    },
    ...{ ...initialState, reference: initialState?.reference || "" },
});

watch(
    state,
    newState => {
        if (!isInsert.value) return;
        const date = today(getLocalTimeZone())
            .subtract({ months: newState.execInterval })
            .set({ day: newState.execOn });
        state.lastExec = date.toString();
    },
    { immediate: true },
);

watch(open, newOpen => {
    if (!newOpen) return;

    if (initialState) {
        state.reference = initialState.reference ?? "";
        state.amount = initialState.amount;
        state.category.name = initialState.category.name;
        state.category.icon = initialState.category.icon;
        state.execInterval = initialState.execInterval;
        state.execOn = initialState.execOn;
        state.lastExec = initialState.lastExec;
        return;
    }
    const emptyState = {
        reference: "",
        category: { name: "", icon: "question-mark-rounded" },
        amount: 0,
        execInterval: 1,
        execOn: 1,
    };

    state.reference = emptyState.reference;
    state.amount = emptyState.amount;
    state.category.name = "";
    state.category.icon = emptyState.category.icon;
    state.execInterval = 1;
    state.execOn = 1;
});

const onSubmit = useOnSubmit({
    url: () =>
        isInsert.value
            ? `/api/finance/accounts/${openAccountId.value}/auto-transactions`
            : `/api/finance/accounts/${openAccountId.value}/auto-transactions/${initialState?.id}`,
    method: () => (isInsert.value ? "POST" : "PUT"),
    state,
    emit,
    refresh,
    translationKey: "finance.autoTransaction",
    interpolations: d => ({ amount: formatCurrency(language.value, openAccount.value!.currency, d.amount) }),
});
</script>

<template>
    <Drawer v-model:open="open">
        <BaseUpsertForm
            :schema="PostAutoTransactionSchema"
            :state="state"
            :mode="isInsert ? 'insert' : 'update'"
            @submit.prevent="onSubmit"
        >
            <template #heading>
                <H1>{{ $t(`finance.autoTransaction.aria.drawer.${isInsert ? "create" : "edit"}`) }}</H1>
            </template>
            <template #default>
                <UFormField :label="$t('finance.amount')" name="amount" class="w-full" required>
                    <CurrencyInput
                        v-model="state.amount"
                        :currency="openAccount!.currency"
                        :locale="language"
                        class="w-full"
                        data-test-id="auto-transaction-upsert-amount-input"
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
                        data-test-id="auto-transaction-upsert-reference-input"
                    />
                </UFormField>
                <div class="flex w-full gap-4 not-xs:flex-col">
                    <UFormField
                        :label="$t('finance.autoTransaction.form.execInterval')"
                        name="execInterval"
                        class="w-full"
                    >
                        <UInputNumber
                            v-model="state.execInterval"
                            class="w-full"
                            :min="FINANCE_EXEC_INTERVAL_MIN"
                            :max="FINANCE_EXEC_INTERVAL_MAX"
                            :format-options="{ style: 'unit', unit: 'month', unitDisplay: 'long' }"
                            data-test-id="auto-transaction-upsert-exec-interval-input"
                        />
                    </UFormField>
                    <UFormField :label="$t('finance.autoTransaction.form.execOn')" name="execOn" class="w-full">
                        <UInputNumber
                            v-model="state.execOn"
                            class="w-full"
                            :min="FINANCE_EXEC_ON_MIN"
                            :max="FINANCE_EXEC_ON_MAX"
                            data-test-id="auto-transaction-upsert-exec-on-input"
                        />
                    </UFormField>
                </div>
            </template>
        </BaseUpsertForm>
        <template #title>{{ $t(`finance.autoTransaction.aria.drawer.${isInsert ? "create" : "edit"}`) }}</template>
        <template #description>{{ $t("finance.autoTransaction.aria.drawer.description") }}</template>
    </Drawer>
</template>
