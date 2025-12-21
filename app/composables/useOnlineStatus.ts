export default function useOnlineStatus() {
    const isOnline = useState("online-status", () => true);
    const interval = useState<NodeJS.Timeout | undefined>("online-polling-timeout", () => undefined);
    const instances = useState("online-status-composable-instance-count", () => 0);
    onMounted(() => {
        instances.value++;
        if (interval.value) return;
        interval.value = setInterval(() => {
            isOnline.value = navigator.onLine;
        }, 1000);
    });
    onBeforeUnmount(() => {
        instances.value--;
        if (instances.value === 0) clearInterval(interval.value);
    });
    return isOnline;
}
