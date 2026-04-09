<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import useLocale from "~/core/composables/useLocale";
import useSoftDelete from "~/core/composables/useSoftDelete";
import { ICON_DELETE, ICON_EDIT } from "~/core/constants/icons.constant";
import { formatDate } from "~/core/utils/date";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import type { Transaction } from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { openAccount, openAccountId } = useAccounts();
const refresh = useRefreshTransactions();

const props = defineProps<{ transaction: Transaction }>();
const { language } = useLocale();
const dateAndReference = computed(() => {
    let date = formatDate(props.transaction.createdAt, language.value);
    if (props.transaction.reference) date += ` | ${props.transaction.reference}`;
    return date;
});
const isSpending = computed(() => props.transaction.amount < 0);
const amount = computed(() => {
    if (!openAccount.value) return "";
    return formatCurrency(language.value, openAccount.value.currency, props.transaction.amount);
});

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
    <li class="relative w-full pt-4">
        <div class="flex w-full justify-between rounded-xl bg-elevated p-4">
            <div class="flex items-center overflow-hidden">
                <CategoryIcon :category-name="props.transaction.category.icon" />
                <div class="mx-4 flex flex-col gap-1 overflow-hidden">
                    <span :title="props.transaction.category.name" class="overflow-hidden text-nowrap text-ellipsis">
                        {{ props.transaction.category.name }}
                    </span>
                    <span class="overflow-hidden text-nowrap text-ellipsis text-muted">
                        {{ dateAndReference }}
                    </span>
                </div>
            </div>
            <div class="flex shrink-0 items-center justify-end">
                <UBadge :color="isSpending ? 'error' : 'primary'" class="mr-3 text-back">
                    {{ amount }}
                </UBadge>
                <Button
                    square
                    variant="ghost"
                    class="hover:bg-accented focus-visible:bg-accented"
                    :icon="ICON_EDIT"
                    color="neutral"
                    :aria-label="$t('ui.edit')"
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
        </div>
    </li>
</template>
