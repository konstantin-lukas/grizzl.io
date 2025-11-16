export default function useTimers() {
    const { data, refresh } = useAsyncData("GET:timers", () => $fetch("/api/timers"));
    const timers = useState<typeof data.value | undefined>("timers", () => data.value);
    watch(data, val => (timers.value = val));
    return { data, refresh };
}
