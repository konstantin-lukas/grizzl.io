<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import useLocale from "~/core/composables/useLocale";
import useSoftDelete from "~/core/composables/useSoftDelete";
import { ICON_DELETE } from "~/core/constants/icons.constant";
import useAccounts from "~/finance/composables/useAccounts";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { openAccount, openAccountId } = useAccounts();
const { refresh } = useAutoTransactions();
const { language } = useLocale();

const props = defineProps<{ autoTransaction: { id: string; amount: number } }>();

const apiRoute = computed(
    () => `/api/finance/accounts/${openAccountId.value}/auto-transactions/${props.autoTransaction.id}`,
);

const interpolations = computed(() => ({
    amount: formatCurrency(language.value, openAccount.value!.currency, props.autoTransaction.amount),
}));

const execute = useSoftDelete(apiRoute, {
    refresh,
    successTitle: "finance.transaction.toast.deletedTitle",
    successDescription: "finance.transaction.toast.deletedDescription",
    interpolations,
});
</script>

<template>
    <Button
        :icon="ICON_DELETE"
        square
        variant="ghost"
        color="error"
        :aria-label="$t('ui.delete')"
        :on-async-click="execute"
    />
</template>
