import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export default function useCategories() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const { data } = useFetch(() => `/api/finance/accounts/${openAccountId.value}/categories`, {
        onResponseError: onResponseError(toast, t),
    });
    return data;
}
