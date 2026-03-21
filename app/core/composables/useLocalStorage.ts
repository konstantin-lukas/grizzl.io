export function useLocalStorage<T>(key: string, defaultValue: T) {
    const state = useState<T>(() => defaultValue);

    if (import.meta.client) {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            state.value = JSON.parse(stored);
        }
    }

    watch(state, newValue => {
        if (import.meta.client) {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    });

    return state;
}
