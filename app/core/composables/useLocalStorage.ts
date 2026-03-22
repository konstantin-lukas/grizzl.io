export default function useLocalStorage<T extends object | string>(key: string, defaultValue: T) {
    const state = useState<T>(() => defaultValue);

    if (import.meta.client) {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            state.value = typeof defaultValue === "object" ? JSON.parse(stored) : stored;
        }
    }

    watch(
        state,
        newValue => {
            if (import.meta.client) {
                localStorage.setItem(key, typeof newValue === "object" ? JSON.stringify(newValue) : newValue);
            }
        },
        { immediate: true, deep: true },
    );

    return state;
}
