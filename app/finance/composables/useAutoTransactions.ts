import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export default function useAutoTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const { data } = useFetch(() => `/api/finance/accounts/${openAccountId.value}/auto-transactions`, {
        onResponseError: onResponseError(toast, t),
    });
    return data;
}
