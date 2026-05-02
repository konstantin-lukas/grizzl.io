import { getLocalTimeZone, today } from "@internationalized/date";
import useAccounts from "~/finance/composables/useAccounts";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import useTransactions from "~/finance/composables/useTransactions";

export default function useUpdateTransactions() {
    const { openAccountId } = useAccounts();

    const { categoryId, from, to, reference, isFetching } = useTransactions();
    const refresh = useRefreshTransactions();

    const lastParams = ref<string | null>(null);

    const resetFilters = () => {
        categoryId.value = undefined;
        reference.value = undefined;

        const tz = getLocalTimeZone();
        const end = today(tz);

        from.value = end.subtract({ months: 1 });
        to.value = end;
    };

    watch(openAccountId, () => {
        if (import.meta.server) return;
        resetFilters();
    });

    onMounted(resetFilters);

    watch([openAccountId, categoryId, from, to, reference], async () => {
        const params = JSON.stringify({
            openAccountId: openAccountId.value ?? null,
            categoryId: categoryId.value ?? null,
            from: from.value?.toString() ?? null,
            to: to.value?.toString() ?? null,
            reference: reference.value ?? null,
        });
        if (lastParams.value === params) return;
        lastParams.value = params;

        isFetching.value = true;
        await refresh().finally(() => (isFetching.value = false));
    });
}
