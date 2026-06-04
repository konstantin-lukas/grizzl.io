export default function useVirtualization(element: Ref<Element | null>) {
    const isVisible = ref(false);
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
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

    return isVisible;
}
