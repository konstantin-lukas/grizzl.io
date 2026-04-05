<script setup lang="ts">
import { Chart } from "chart.js";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import useLocale from "~/core/composables/useLocale";
import { useScreenSize } from "~/core/composables/useScreenSize";
import {
    COLOR_FRONT_DARK_MODE,
    COLOR_FRONT_LIGHT_MODE,
    COLOR_PRIMARY_DARK_MODE,
    COLOR_PRIMARY_LIGHT_MODE,
} from "~/core/constants/colors";
import useAccounts from "~/finance/composables/useAccounts";
import useTransactions from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { sm } = useScreenSize();
const { openAccount } = useAccounts();
const { from, to, transactions, startBalance } = useTransactions();
const { fnsLocale, language } = useLocale();
const colorMode = useColorMode();

const dates = computed(() => {
    if (!from.value || !to.value) return [];
    return eachDayOfInterval({ start: from.value, end: to.value });
});

const labels = computed(() => {
    return dates.value.map(date => format(date, "P", { locale: fnsLocale.value }));
});

const data = computed(() => {
    const balance = { value: startBalance.value };

    const getBalanceOnDate = (date: Date) => {
        const transactionsOnCurrentDay = transactions.value.filter(transaction =>
            isSameDay(transaction.createdAt, date),
        );

        const amountOnCurrentDay = transactionsOnCurrentDay.reduce((acc, transaction) => acc + transaction.amount, 0);
        balance.value += amountOnCurrentDay;
        return balance.value;
    };

    return dates.value.map(getBalanceOnDate);
});

const gridColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
const dataColor = computed(() => (colorMode.value === "dark" ? COLOR_PRIMARY_DARK_MODE : COLOR_PRIMARY_LIGHT_MODE));
const accountBalance = computed(() =>
    openAccount.value ? formatCurrency(language.value, openAccount.value.currency, openAccount.value.balance) : "",
);

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
                    borderColor: dataColor.value,
                    data: data.value,
                    borderWidth: 2,
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
            elements: {
                point: {
                    radius: Math.min(200 / (data.value.length || 1), 10),
                },
            },
            scales: {
                x: {
                    type: "category",
                    grid: {
                        tickColor: gridColor.value,
                        color: "rgba(255,255,255,0)",
                        lineWidth: 1,
                    },
                    ticks: {
                        display: false,
                    },
                },
                y: {
                    type: "linear",
                    grid: {
                        color: gridColor.value,
                        tickColor: "rgba(0,0,0,0)",
                    },
                    border: {
                        width: 0,
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        crossAlign: "far",
                        callback(value) {
                            if (!openAccount.value) return "";
                            const cents = typeof value === "string" ? parseInt(value) : value;
                            return formatCurrency(language.value, openAccount.value.currency, cents);
                        },
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
                    callbacks: {
                        label(context) {
                            const value = context.parsed.y;
                            if (!openAccount.value || !value) return "";
                            return formatCurrency(language.value, openAccount.value.currency, value);
                        },
                    },
                },
            },
        },
    });
});

watch(
    [data, labels, gridColor, dataColor, sm, openAccount],
    ([newData, newLabels, newGridColor, newDataColor, newSm]) => {
        if (!chart.value || import.meta.server) return;

        chart.value.options.scales!.x!.grid!.tickColor = newGridColor;
        chart.value.options.scales!.x!.ticks!.color = newGridColor;
        chart.value.options.scales!.y!.ticks!.color = newGridColor;
        chart.value.options.scales!.y!.ticks!.display = newSm;
        chart.value.options.scales!.y!.grid!.color = newGridColor;
        chart.value.data.datasets[0]!.borderColor = newDataColor;
        chart.value.data.labels = newLabels;
        chart.value.data.datasets[0]!.data = newData;
        chart.value.update();
    },
    { deep: true },
);
</script>

<template>
    <div class="rounded-xl bg-elevated p-6">
        <div class="h-[60dvh] max-h-80 portrait:h-[40dvh]">
            <canvas ref="canvasRef" />
        </div>
        <span class="mt-4 block">Account Balance AAA: {{ accountBalance }}</span>
        <span class="block">Expected at end of month AAA: </span>
    </div>
</template>

<style scoped></style>
