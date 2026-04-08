export default function useLocalStorage(key: string) {
    const state = useState<string | null>(`local-storage-${key}`, () => null);

    onMounted(() => {
        state.value = localStorage.getItem(key);
    });

    watch(
        state,
        newValue => {
            if (newValue === null) {
                localStorage.removeItem(key);
                return;
            }
            localStorage.setItem(key, newValue);
        },
        { deep: true },
    );

    return state;
}
