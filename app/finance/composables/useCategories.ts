import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export default function useCategories() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const { data, execute } = useFetch(() => `/api/finance/accounts/${openAccountId.value}/categories`, {
        onResponseError: onResponseError(toast, t),
        immediate: false,
        watch: false,
        default: () => [],
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
