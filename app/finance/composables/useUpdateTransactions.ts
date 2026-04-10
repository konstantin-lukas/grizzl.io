import useAccounts from "~/finance/composables/useAccounts";
import useRefreshTransactions from "~/finance/composables/useRefreshTransactions";
import useTransactions from "~/finance/composables/useTransactions";

export default function useUpdateTransactions() {
    const { openAccountId } = useAccounts();

    const { categoryId, from, to, reference } = useTransactions();
    const refresh = useRefreshTransactions();

    const lastParams = ref<string | null>(null);

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

        await refresh();
    });
}
