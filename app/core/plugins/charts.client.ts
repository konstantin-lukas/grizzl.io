import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LineController,
    LineElement,
    LinearScale,
    PieController,
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
        BarController,
        BarElement,
        PieController,
        ArcElement,
    );

    const runtimeConfig = useRuntimeConfig();
    if (runtimeConfig.public.appEnv === "test") {
        Chart.defaults.animation = false;
    }
});
