import { tryCatchSync } from "#shared/core/utils/result.util";

export default function useLocalStorage<T extends object | string>(key: string, defaultValue: T) {
    const state = useState<T>(() => defaultValue);

    onMounted(() => {
        const stored = localStorage.getItem(key);
        if (stored === null) {
            localStorage.setItem(key, typeof defaultValue === "object" ? JSON.stringify(defaultValue) : defaultValue);
            return;
        }
        if (typeof defaultValue === "object") {
            const { data, error } = tryCatchSync(() => JSON.parse(stored));
            if (error) {
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify(defaultValue));
            } else {
                state.value = data;
            }
        } else {
            state.value = stored as T;
        }
    });

    watch(
        state,
        newValue => {
            if (!newValue) return;
            localStorage.setItem(key, typeof newValue === "object" ? JSON.stringify(newValue) : newValue);
        },
        { deep: true },
    );

    return state;
}
