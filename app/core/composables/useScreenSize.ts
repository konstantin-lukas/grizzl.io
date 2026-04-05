import { onMounted, onUnmounted, ref } from "vue";

export function useScreenSize() {
    const width = ref(import.meta.client ? window.innerWidth : 0);
    const height = ref(import.meta.client ? window.innerHeight : 0);
    const sm = computed(() => width.value >= 640);

    const updateSize = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    };

    onMounted(() => {
        window.addEventListener("resize", updateSize);
    });

    onUnmounted(() => {
        window.removeEventListener("resize", updateSize);
    });

    return {
        width,
        height,
        sm,
    };
}
