export default function useTimers() {
    const { data, refresh } = useFetch("/api/timers");
    const timers = useState<typeof data.value | undefined>("timers", () => undefined);
    watchEffect(() => {
        if (data.value) {
            timers.value = data.value;
        }
    });
    return { timers, refresh };
}
