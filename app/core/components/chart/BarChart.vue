<script setup lang="ts">
import { Chart } from "chart.js";
import { CHART_COLORS, COLOR_FRONT_DARK_MODE, COLOR_FRONT_LIGHT_MODE } from "~/core/constants/colors.constant";
import useScreenSize from "~/core/composables/useScreenSize";
import { ellipsize } from "#shared/core/utils/string.util";

const props = withDefaults(
    defineProps<{
        labels: string[];
        datasets: { data: number[]; label?: string }[];
        colors?: string[];
        tooltipLabelCallback?: (value: number) => string;
    }>(),
    { colors: () => CHART_COLORS, tooltipLabelCallback: undefined },
);
const colorMode = useColorMode();
const canvasRef = ref();
const chart = shallowRef<Chart>();
const gridColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
const backgroundColor = computed(() => (colorMode.value === "dark" ? COLOR_FRONT_DARK_MODE : COLOR_FRONT_LIGHT_MODE));
const { sm } = useScreenSize();

const datasets = computed(() =>
    props.datasets.map((dataset, i) => {
        const color = props.colors[i % props.colors.length];
        return {
            ...dataset,
            backgroundColor: color,
            hoverBackgroundColor: backgroundColor.value,
            borderRadius: {
                topLeft: 8,
                topRight: 8,
                bottomLeft: 8,
                bottomRight: 8,
            },
            borderSkipped: false,
        };
    }),
);

onMounted(() => {
    chart.value = new Chart(canvasRef.value, {
        type: "bar",
        data: {
            labels: props.labels,
            datasets: datasets.value,
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
                        callback(value) {
                            return ellipsize(String(this.getLabelForValue(Number(value))), 20);
                        },
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
                        callback(value) {
                            return ellipsize(String(this.getLabelForValue(Number(value))), 20);
                        },
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
    () => [datasets.value, props.labels, gridColor.value, sm.value] as const,
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
                callback(value) {
                    return ellipsize(String(this.getLabelForValue(Number(value))), 20);
                },
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
                callback(value) {
                    return ellipsize(String(this.getLabelForValue(Number(value))), 20);
                },
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
