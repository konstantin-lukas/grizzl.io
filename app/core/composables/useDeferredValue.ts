export default function useDeferredValue<T>(source: Ref<T>, delay = 500) {
    const local = ref(source.value) as Ref<T>;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let syncingFromSource = false;

    const clearPending = () => {
        if (!timeout) return;
        clearTimeout(timeout);
        timeout = undefined;
    };

    watch(source, newValue => {
        clearPending();
        syncingFromSource = true;
        local.value = newValue;
        syncingFromSource = false;
    });

    watch(local, newValue => {
        if (syncingFromSource) return;

        clearPending();
        timeout = setTimeout(() => {
            source.value = newValue;
            timeout = undefined;
        }, delay);
    });

    onBeforeUnmount(() => {
        clearPending();
    });

    return local;
}
