import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export default function useAutoTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();

    const { data, refresh, pending } = useFetch(
        () => `/api/finance/accounts/${openAccountId.value}/auto-transactions`,
        {
            key: `/api/finance/accounts/:accountId/auto-transactions`,
            immediate: false,
            watch: false,
            server: false,
            default: () => [],
            onResponseError: onResponseError(toast, t),
        },
    );

    watch(
        openAccountId,
        async id => {
            if (!id) {
                data.value = [];
                return;
            }
            await refresh();
        },
        { immediate: true },
    );

    return { autoTransactions: data, refresh, isFetching: pending };
}

export type AutoTransaction = ReturnType<typeof useAutoTransactions>["autoTransactions"]["value"][number];
