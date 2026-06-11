export default function useVirtualization(element: Ref<Element | null>, delayOnMounted = false) {
    const config = useRuntimeConfig();
    const isVisible = ref(config.public.appEnv === "test");
    let observer: IntersectionObserver | null = null;

    if (config.public.appEnv !== "test") {
        onMounted(async () => {
            if (delayOnMounted) {
                await new Promise(r => {
                    setTimeout(r, 0);
                });
            }
            observer = new IntersectionObserver(([entry]) => {
                if (!entry) return;
                isVisible.value = entry.isIntersecting;
            });

            if (element.value) {
                observer.observe(element.value);
            }
        });

        onBeforeUnmount(() => {
            if (observer && element.value) {
                observer.unobserve(element.value);
            }
        });
    }

    return isVisible;
}
