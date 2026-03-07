export default function useLocalStorage(key: string, initialValue: string | null | undefined) {
    const data = ref<string | null | undefined>(initialValue);

    if (import.meta.client) data.value = localStorage.getItem(key);

    watch(data, newValue => {
        if (newValue === null || newValue === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, newValue);
        }
    });

    return { data };
}
