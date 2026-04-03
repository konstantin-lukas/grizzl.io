<script setup lang="ts">
import type { ChartItem } from "chart.js";
import { Chart } from "chart.js";

const canvasRef = ref<ChartItem>();
onMounted(() => {
    if (!canvasRef.value) return;
    new Chart(canvasRef.value, {
        type: "line",
        data: {
            labels: ["Jan", "Feb"],
            datasets: [
                {
                    label: "Users",
                    data: [10, 30],
                },
            ],
        },
    });
});
</script>

<template>
    <div class="rounded-xl bg-elevated p-6">
        <canvas ref="canvasRef" />
    </div>
</template>

<style scoped></style>
