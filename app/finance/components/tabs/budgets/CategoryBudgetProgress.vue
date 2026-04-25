<script setup lang="ts">
import useLocale from "~/core/composables/useLocale";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { categories } = useCategories();
const { language } = useLocale();

const props = defineProps<{ expense: PerMonthCategoryStatistics & { budget: number }; currency: string }>();
const category = computed(() => categories.value.find(category => category.id === props.expense.category));
const budget = computed(() => {
    return formatCurrency(language.value, props.currency, props.expense.budget);
});
const progress = computed(() => (props.expense.budget === 0 ? 1 : props.expense.spent / props.expense.budget));
const transform = computed(() => `rotate(${progress.value}turn)`);
const spentLess = computed(() => (props.expense?.change ?? -1) <= 0);
const change = computed(() => `${spentLess.value ? "" : "+"}${props.expense.change}%`);
const fullySpent = computed(() => progress.value >= 1);
const backgroundColor = computed(() => (fullySpent.value ? "bg-error" : "bg-primary"));
const backgroundImage = computed(
    () =>
        `conic-gradient(var(--ui-${fullySpent.value ? "error" : "primary"}) ${progress.value}turn, var(--ui-border) 0)`,
);
const spentAmount = computed(() => formatCurrency(language.value, props.currency, props.expense.spent));
</script>

<template>
    <div class="flex flex-col items-center gap-4">
        <div
            class="relative aspect-square w-full overflow-hidden rounded-full"
            role="progressbar"
            :aria-valuemin="0"
            :aria-valuemax="props.expense.budget"
            :aria-valuenow="props.expense.spent"
            :aria-labelledby="props.expense.category"
        >
            <div class="center aspect-square w-full scale-110" :style="{ backgroundImage }" :class="backgroundColor">
                <span
                    :id="props.expense.category"
                    class="center relative aspect-square w-[calc(100%-2rem)] scale-[calc(1/1.1)] gap-2 rounded-full bg-back xs:w-[calc(100%-3rem)] md:w-[calc(100%-5rem)]"
                >
                    <UIcon
                        :name="'material-symbols:' + (category?.icon ?? 'question-mark-rounded')"
                        class="size-8 xs:size-12"
                    />
                    <UBadge :color="spentLess ? 'primary' : 'error'">{{ change }}</UBadge>
                </span>
            </div>
            <span
                class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full xs:size-6 md:size-10"
                :class="backgroundColor"
            />
            <div class="pointer-events-none absolute top-0 left-0 aspect-square w-full" :style="{ transform }">
                <span
                    class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full xs:size-6 md:size-10"
                    :class="backgroundColor"
                />
            </div>
        </div>
        <span class="text-center">
            <b>
                {{ category?.displayName }}
            </b>
            <br />
            {{ $t("finance.budgets.usedAmount", { amount: spentAmount, max: budget }) }}
        </span>
    </div>
</template>
