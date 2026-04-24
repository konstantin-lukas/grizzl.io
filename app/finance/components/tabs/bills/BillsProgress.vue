<script setup lang="ts">
import useLocale from "~/core/composables/useLocale";
import useAccounts from "~/finance/composables/useAccounts";
import { formatCurrency } from "~/finance/utils/currency";

const props = defineProps<{ remaining: number; paid: number }>();
const { language } = useLocale();
const { openAccount } = useAccounts();

const total = computed(() => props.paid + props.remaining);
const percentage = computed(() => `${((props.paid / total.value) * 100).toFixed(0)}%`);
const progressLabel = computed(() => {
    const formattedTotal = openAccount.value?.currency
        ? formatCurrency(language.value, openAccount.value.currency, total.value)
        : "";
    const formattedPaid = openAccount.value?.currency
        ? formatCurrency(language.value, openAccount.value.currency, props.paid)
        : "";
    return `${formattedPaid} / ${formattedTotal}`;
});

const remaining = computed(() =>
    openAccount.value?.currency ? formatCurrency(language.value, openAccount.value.currency, props.remaining) : "",
);
</script>

<template>
    <span>{{ $t("finance.bills.remaining", { amount: remaining }) }}</span>
    <div class="relative overflow-hidden select-none">
        <UProgress
            :model-value="props.paid"
            :max="total"
            :ui="{ base: 'h-8 my-2 rounded-lg', indicator: 'rounded-none' }"
        />
        <span class="absolute top-1/2 w-full -translate-y-1/2 overflow-hidden" :style="{ width: percentage }">
            <span class="ml-2 text-nowrap text-back">{{ progressLabel }}</span>
        </span>
        <span
            class="absolute top-1/2 h-6 w-full overflow-hidden"
            aria-hidden="true"
            :style="{ transform: `translate(${percentage}, -50%)` }"
        >
            <span
                class="absolute ml-2 w-full text-nowrap text-front"
                :style="{ transform: `translateX(-${percentage})` }"
            >
                {{ progressLabel }}
            </span>
        </span>
    </div>
</template>
