import { CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement } from "chart.js";

export default defineNuxtPlugin(() => {
    Chart.defaults.font.family = "Jost, sans-serif";
    Chart.defaults.font.size = 14;
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);
});
