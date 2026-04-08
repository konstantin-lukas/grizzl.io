import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export default function useAutoTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();

    const { data, execute } = useFetch(() => `/api/finance/accounts/${openAccountId.value}/auto-transactions`, {
        immediate: false,
        watch: false,
        default: () => [],
        onResponseError: onResponseError(toast, t),
    });

    watch(
        openAccountId,
        async id => {
            if (!id) {
                data.value = [];
                return;
            }
            await execute();
        },
        { immediate: true },
    );

    return data;
}
