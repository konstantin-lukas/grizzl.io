import {
    ArcElement,
    CategoryScale,
    Chart,
    DoughnutController,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";

export default defineNuxtPlugin(() => {
    Chart.defaults.font.family = "Jost, sans-serif";
    Chart.defaults.font.size = 14;
    Chart.register(
        LineController,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        DoughnutController,
        ArcElement,
    );
});
