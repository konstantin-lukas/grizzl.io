<script setup lang="ts">
import useLocale from "~/core/composables/useLocale";
import { formatDate } from "~/core/utils/date";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import type { Transaction } from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const props = defineProps<{ transaction: Transaction; currency: string }>();
const { language } = useLocale();
const dateAndReference = computed(() => {
    let date = formatDate(props.transaction.createdAt, language.value);
    if (props.transaction.reference) date += ` | ${props.transaction.reference}`;
    return date;
});
const isSpending = computed(() => props.transaction.amount < 0);
const amount = computed(() => {
    return formatCurrency(language.value, props.currency, props.transaction.amount);
});
</script>

<template>
    <li class="relative w-full pt-4">
        <div class="flex w-full justify-between rounded-xl bg-elevated py-1 pr-1.5 pl-3 sm:p-4">
            <div class="flex items-center overflow-hidden">
                <CategoryIcon :category-name="props.transaction.category.icon" class="not-sm:scale-90" />
                <div class="mx-3 flex flex-col gap-1 overflow-hidden sm:mx-4">
                    <span :title="props.transaction.category.name" class="overflow-hidden text-nowrap text-ellipsis">
                        {{ props.transaction.category.name }}
                    </span>
                    <span class="overflow-hidden text-nowrap text-ellipsis text-muted">
                        {{ dateAndReference }}
                    </span>
                </div>
            </div>
            <div class="flex shrink-0 items-center justify-end">
                <UBadge :color="isSpending ? 'error' : 'primary'" class="mr-2 text-back sm:mr-3">
                    {{ amount }}
                </UBadge>
                <slot name="controls" />
            </div>
        </div>
    </li>
</template>
