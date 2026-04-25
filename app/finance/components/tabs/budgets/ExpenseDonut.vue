<script setup lang="ts">
import { Chart } from "chart.js";
import useLocale from "~/core/composables/useLocale";
import useCategories from "~/finance/composables/useCategories";
import type { PerMonthCategoryStatistics } from "~/finance/composables/usePerMonthTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { categories } = useCategories();
const { language } = useLocale();
const props = defineProps<{ expenses: PerMonthCategoryStatistics[]; currency: string }>();
const canvasRef = ref();
const chart = shallowRef<Chart>();

const data = computed(() => ({
    labels: props.expenses.map(({ category }) => {
        return categories.value.find(c => c.id === category)?.displayName ?? "";
    }),
    datasets: [
        {
            label: "My First Dataset",
            data: props.expenses.map(({ spent }) => spent),
        },
    ],
}));

onMounted(() => {
    chart.value = new Chart(canvasRef.value, {
        type: "doughnut",
        data: data.value,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label(context) {
                            const value = context.parsed;
                            if (value === null) return "";
                            return formatCurrency(language.value, props.currency, value);
                        },
                    },
                },
            },
        },
    });
});
</script>

<template>
    <div class="relative mx-auto my-8 aspect-square max-w-120">
        <canvas ref="canvasRef" />
    </div>
</template>
