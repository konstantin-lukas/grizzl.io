<script setup lang="ts">
import { Chart } from "chart.js";
import useLocale from "~/core/composables/useLocale";
import { useScreenSize } from "~/core/composables/useScreenSize";
import {
    COLOR_ERROR_DARK_MODE,
    COLOR_ERROR_LIGHT_MODE,
    COLOR_FRONT_DARK_MODE,
    COLOR_FRONT_LIGHT_MODE,
    COLOR_PRIMARY_DARK_MODE,
    COLOR_PRIMARY_LIGHT_MODE,
} from "~/core/constants/colors.constant";
import useAccountBalanceChartData from "~/finance/composables/useAccountBalanceChartData";
import useAccounts from "~/finance/composables/useAccounts";
import { formatCurrency } from "~/finance/utils/currency";

const { sm } = useScreenSize();
const { openAccount } = useAccounts();
const { data, labels, expectedBalance, accountBalance } = useAccountBalanceChartData();

const { language } = useLocale();
const colorMode = useColorMode();

const gridColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
const dataColor = computed(() => (colorMode.value === "dark" ? COLOR_PRIMARY_DARK_MODE : COLOR_PRIMARY_LIGHT_MODE));
const errorColor = computed(() => (colorMode.value === "dark" ? COLOR_ERROR_DARK_MODE : COLOR_ERROR_LIGHT_MODE));

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
                    pointStyle: false,
                    borderWidth: 5,
                    borderJoinStyle: "round",
                    borderCapStyle: "round",
                    segment: {
                        borderColor: ctx => {
                            const y0 = ctx.p0.parsed.y;
                            const y1 = ctx.p1.parsed.y;
                            if (!chart.value || y0 === null || y1 === null || (y0 >= 0 && y1 >= 0)) {
                                return dataColor.value;
                            }

                            const { ctx: canvasCtx, chartArea, scales } = chart.value;

                            if (!chartArea) return dataColor.value;

                            const yScale = scales.y;
                            const yZero = yScale?.getPixelForValue(0) ?? 0;
                            const lineOffset = y0 === 0 || y1 === 0 ? 3 : 0;

                            const gradient = canvasCtx.createLinearGradient(
                                0,
                                chartArea.top + lineOffset,
                                0,
                                chartArea.bottom + lineOffset,
                            );

                            const offset = (yZero - chartArea.top) / (chartArea.bottom - chartArea.top);

                            gradient.addColorStop(0, dataColor.value);
                            gradient.addColorStop(offset, dataColor.value);
                            gradient.addColorStop(offset, errorColor.value);
                            gradient.addColorStop(1, errorColor.value);

                            return gradient;
                        },
                    },
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
                        maxTicksLimit: 12,
                        color: gridColor.value,
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
                            const prev = context.dataset.data[context.dataIndex - 1];

                            if (!openAccount.value || value === null) return "";

                            const formatted = formatCurrency(language.value, openAccount.value.currency, value);

                            if (typeof prev !== "number") return formatted;

                            const delta = value - prev;

                            return `${formatted} (${delta >= 0 ? "+" : ""}${formatCurrency(language.value, openAccount.value.currency, delta)})`;
                        },
                    },
                },
            },
        },
    });
});

onUnmounted(() => chart.value?.destroy());

watch(
    [data, labels, gridColor, sm, openAccount],
    ([newData, newLabels, newGridColor, newSm]) => {
        if (!chart.value || import.meta.server) return;

        chart.value.options.scales!.x!.grid!.tickColor = newGridColor;
        chart.value.options.scales!.x!.ticks!.color = newGridColor;
        chart.value.options.scales!.y!.ticks!.color = newGridColor;
        chart.value.options.scales!.y!.ticks!.display = newSm;
        chart.value.options.scales!.y!.grid!.color = newGridColor;
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
        <span class="mt-4 flex items-center gap-1">
            <span>{{ $t("finance.account.currentBalance") }}: </span>
            <USkeleton v-if="!accountBalance" class="inline-block h-5 w-20 bg-accented" />
            <span v-else>{{ accountBalance }}</span>
        </span>
        <span class="flex items-center gap-1 text-muted">
            <span>{{ $t("finance.account.expectedBalance") }}: </span>
            <USkeleton v-if="!expectedBalance" class="inline-block h-5 w-20 bg-accented" />
            <span v-else>{{ expectedBalance }}</span>
        </span>
    </div>
</template>
