export default function useWakeLock() {
    const wakeLock = ref<WakeLockSentinel | null>(null);

    const release = async () => {
        const current = wakeLock.value;
        if (!current) return;

        wakeLock.value = null;
        await tryCatch(current.release());
    };

    const request = async () => {
        if (!("wakeLock" in navigator)) return;
        await release();

        const { data, error } = await tryCatch(navigator.wakeLock.request("screen"));
        if (!error) wakeLock.value = data;
    };

    const listen = async () => {
        if (wakeLock.value !== null && document.visibilityState === "visible") await request();
    };

    onMounted(() => {
        if (!("wakeLock" in navigator)) return;
        document.addEventListener("visibilitychange", listen);
    });

    onBeforeUnmount(async () => {
        if (!("wakeLock" in navigator)) return;
        document.removeEventListener("visibilitychange", listen);
        await release();
    });

    return { request, release };
}
