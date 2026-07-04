<script setup lang="ts">
import type { ChartDataset } from "chart.js";
import { Chart } from "chart.js";
import { COLOR_FRONT_DARK_MODE, COLOR_FRONT_LIGHT_MODE } from "~/core/constants/colors.constant";
import useScreenSize from "~/core/composables/useScreenSize";

const props = defineProps<{
    labels: string[];
    datasets: ChartDataset[];
    tooltipLabelCallback?: (value: number) => string;
}>();
const colorMode = useColorMode();
const canvasRef = ref();
const chart = shallowRef<Chart>();
const gridColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
const { sm } = useScreenSize();

onMounted(() => {
    chart.value = new Chart(canvasRef.value, {
        type: "bar",
        data: {
            labels: props.labels,
            datasets: props.datasets,
        },
        options: {
            indexAxis: sm.value ? "x" : "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: sm.value ? "category" : "linear",
                    stacked: true,
                    grid: {
                        color: "rgba(255,255,255,0)",
                    },
                    ticks: {
                        display: sm.value,
                        color: gridColor.value,
                        padding: 10,
                    },
                },
                y: {
                    type: sm.value ? "linear" : "category",
                    stacked: true,
                    grid: {
                        color: gridColor.value,
                    },
                    ticks: {
                        display: !sm.value,
                        color: gridColor.value,
                        padding: 10,
                    },
                    border: {
                        width: 0,
                    },
                },
            },
            plugins: {
                tooltip: {
                    displayColors: false,
                    titleMarginBottom: 0,
                    padding: 10,
                    callbacks: {
                        label(context) {
                            const value = context.parsed[sm.value ? "y" : "x"] ?? 0;
                            if (!props.tooltipLabelCallback) return value.toString();
                            return props.tooltipLabelCallback(value);
                        },
                        title(context) {
                            return context[0]?.dataset.label;
                        },
                    },
                },
            },
        },
    });
});

watch(
    () => [props.datasets, props.labels, gridColor.value, sm.value] as const,
    ([newDatasets, newLabels, newGridColor, newSm]) => {
        if (!chart.value || import.meta.server) return;

        chart.value.data.datasets = newDatasets;
        chart.value.data.labels = newLabels;

        chart.value.options.indexAxis = newSm ? "x" : "y";

        chart.value.options.scales!.x = {
            type: newSm ? "category" : "linear",
            stacked: true,
            grid: {
                color: "rgba(255,255,255,0)",
            },
            ticks: {
                display: newSm,
                color: newGridColor,
                padding: 10,
            },
        };

        chart.value.options.scales!.y = {
            type: newSm ? "linear" : "category",
            stacked: true,
            grid: {
                color: newGridColor,
            },
            ticks: {
                display: !newSm,
                color: newGridColor,
                padding: 10,
            },
            border: {
                width: 0,
            },
        };

        chart.value.update();
    },
);
</script>

<template>
    <canvas ref="canvasRef" />
</template>
