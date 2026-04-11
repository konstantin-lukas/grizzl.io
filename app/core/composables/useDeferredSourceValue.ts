export default function useDeferredSourceValue<T>(source: Ref<T>, delay = 500): Ref<T> {
    const local = ref(source.value) as Ref<T>;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const clearPending = () => {
        if (!timeout) return;
        clearTimeout(timeout);
        timeout = undefined;
    };

    watch(source, newValue => {
        clearPending();
        timeout = setTimeout(() => {
            local.value = newValue;
            timeout = undefined;
        }, delay);
    });

    onBeforeUnmount(() => {
        clearPending();
    });

    return local;
}
