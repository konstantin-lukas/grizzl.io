import { tryCatchSync } from "#shared/core/utils/result.util";

export default function useLocalStorage<T extends object | string>(key: string, defaultValue: T) {
    const state = useState<T>(() => defaultValue);

    if (import.meta.client) {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            if (typeof defaultValue === "object") {
                const { data, error } = tryCatchSync(() => JSON.parse(stored));
                if (error) {
                    localStorage.removeItem(key);
                    state.value = defaultValue;
                } else {
                    state.value = data;
                }
            } else {
                state.value = stored as T;
            }
        }
    }

    watch(
        state,
        newValue => {
            if (import.meta.client && newValue) {
                localStorage.setItem(key, typeof newValue === "object" ? JSON.stringify(newValue) : newValue);
            }
        },
        { immediate: true, deep: true },
    );

    return state;
}
