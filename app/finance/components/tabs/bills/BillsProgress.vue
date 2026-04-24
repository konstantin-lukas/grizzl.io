<script setup lang="ts">
import useLocale from "~/core/composables/useLocale";
import { formatCurrency } from "~/finance/utils/currency";

const props = defineProps<{ remaining: number; paid: number; currency: string }>();
const { language } = useLocale();

const total = computed(() => props.paid + props.remaining);
const percentage = computed(() => (total.value === 0 ? "0%" : `${(props.paid / total.value) * 100}%`));
const progressLabel = computed(() => {
    const formattedTotal = props.currency ? formatCurrency(language.value, props.currency, total.value) : "";
    const formattedPaid = props.currency ? formatCurrency(language.value, props.currency, props.paid) : "";
    return `${formattedPaid} / ${formattedTotal}`;
});

const remaining = computed(() =>
    props.currency ? formatCurrency(language.value, props.currency, props.remaining) : "",
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
