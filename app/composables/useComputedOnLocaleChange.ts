import type { ComputedGetter } from "vue";

export default function useComputedOnLocaleChange<T>(callback: () => T | null, getter?: ComputedGetter<unknown>) {
    const { locale } = useI18n();
    const state = ref<T | null>(null);
    watch(
        [locale, getter],
        () => {
            state.value = callback();
        },
        { immediate: true },
    );
    return state;
}
