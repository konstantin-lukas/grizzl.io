<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import useLocale from "~/core/composables/useLocale";
import useSoftDelete from "~/core/composables/useSoftDelete";
import { ICON_DELETE, ICON_EDIT } from "~/core/constants/icons.constant";
import BaseTransactionCard from "~/finance/components/tabs/account/BaseTransactionCard.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import type { Transaction } from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { openAccount, openAccountId } = useAccounts();
const refresh = useRefreshTransactions();
const emit = defineEmits(["edit"]);

const props = defineProps<{ transaction: Transaction }>();
const { language } = useLocale();

const apiRoute = computed(() => `/api/finance/accounts/${openAccountId.value}/transactions/${props.transaction.id}`);
const interpolations = computed(() => ({
    amount: formatCurrency(language.value, openAccount.value!.currency, props.transaction.amount),
}));

const execute = useSoftDelete(apiRoute, {
    refresh,
    successTitle: "finance.transaction.toast.deletedTitle",
    successDescription: "finance.transaction.toast.deletedDescription",
    interpolations,
});
</script>

<template>
    <BaseTransactionCard :transaction :currency="openAccount?.currency ?? 'USD'">
        <template #controls>
            <div class="flex not-sm:flex-col hover-none:scale-90">
                <Button
                    square
                    variant="ghost"
                    class="hover:bg-accented focus-visible:bg-accented"
                    :icon="ICON_EDIT"
                    color="neutral"
                    :aria-label="$t('ui.edit')"
                    @click="emit('edit')"
                />
                <Button
                    square
                    variant="ghost"
                    class="hover:bg-accented focus-visible:bg-accented"
                    :icon="ICON_DELETE"
                    color="error"
                    :on-async-click="execute"
                    :aria-label="$t('ui.delete')"
                />
            </div>
        </template>
    </BaseTransactionCard>
</template>
