export function useOnlineStatus() {
    const isOnline = ref(true);
    const interval = ref<NodeJS.Timeout | undefined>(undefined);
    onMounted(() => {
        interval.value = setInterval(() => {
            isOnline.value = navigator.onLine;
        }, 1000);
    });
    onBeforeUnmount(() => clearInterval(interval.value));
    return isOnline;
}
