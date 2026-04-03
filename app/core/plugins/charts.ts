import { CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement } from "chart.js";

export default defineNuxtPlugin(() => {
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);
});
