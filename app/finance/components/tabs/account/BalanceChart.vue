<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { Chart } from "chart.js";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import useTransactions from "~/finance/composables/useTransactions";

const { from, to, transactions } = useTransactions();
const { locale } = useI18n();
const colorMode = useColorMode();

const dates = computed(() => {
    if (!from.value || !to.value) return [];
    return eachDayOfInterval({ start: from.value, end: to.value });
});

const labels = computed(() => {
    const loc = LOCALES.find(l => l.code === locale.value)!.fnsLocale;
    return dates.value.map(date => format(date, "P", { locale: loc }));
});

const data = computed(() => {
    return dates.value.map(date => {
        const transactionsOnCurrentDay = transactions.value.filter(transaction =>
            isSameDay(transaction.createdAt, date),
        );

        // TODO Show actual account balance
        return transactionsOnCurrentDay.reduce((acc, transaction) => acc + transaction.amount, 0);
    });
});

const canvasRef = ref();
const chart = shallowRef<Chart>(); // https://github.com/chartjs/Chart.js/issues/8970
onMounted(() => {
    if (!canvasRef.value || import.meta.server) return;
    chart.value = new Chart(canvasRef.value, {
        type: "line",
        data: {
            labels: labels.value,
            datasets: [
                {
                    borderColor: colorMode.value === "dark" ? "oklch(69.6% 0.17 162.48)" : "oklch(50.8% 0.118 165.612)",
                    data: data.value,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
            },
            scales: {
                x: {
                    type: "category",
                    grid: {
                        color: "rgba(255,255,255,0)",
                        lineWidth: 1,
                    },
                },
                y: {
                    type: "linear",
                    grid: {
                        color: "#808080",
                        tickColor: "rgba(0,0,0,0)",
                    },
                    border: {
                        width: 0,
                    },
                    beginAtZero: true,
                    suggestedMax: 10,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    displayColors: false,
                    titleMarginBottom: 0,
                    padding: 10,
                    /*callbacks: {
                        title: function(context) {
                            return text?.date_ + ': ' + context[0].label;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) label += new Intl.NumberFormat(language.code,
                                {
                                    style: 'currency',
                                    currency: currency.name
                                }).format(context.parsed.y);
                            return label;
                        }
                    }*/
                },
            },
        },
    });
});

watch(
    data,
    newData => {
        if (!chart.value || import.meta.server) return;

        chart.value.data.datasets[0]!.data = newData;
        chart.value.update();
    },
    { deep: true },
);
</script>

<template>
    <div class="rounded-xl bg-elevated p-6">
        <canvas ref="canvasRef" />
    </div>
</template>

<style scoped></style>
