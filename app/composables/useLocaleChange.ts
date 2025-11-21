export default function useComputedLocale<T>(callback: () => T) {
    const { locale } = useI18n();
    const state = ref<T>();
    watch(
        locale,
        () => {
            state.value = callback();
        },
        { immediate: true },
    );
    return state;
}
