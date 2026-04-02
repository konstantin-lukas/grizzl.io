import { useToast } from "#ui/composables";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export default function useTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const categoryId = ref<string | undefined>(undefined);
    const from = ref<Date | undefined>();
    const to = ref<Date | undefined>(undefined);
    const reference = ref<string | undefined>(undefined);

    const query = computed(() => ({
        categoryId: categoryId.value,
        from: from.value?.toISOString(),
        to: to.value?.toISOString(),
        reference: reference.value,
    }));

    const { data } = useFetch(() => `/api/finance/accounts/${openAccountId.value}/transactions`, {
        onResponseError: onResponseError(toast, t),
        server: false,
        query,
    });

    return { transactions: data, categoryId, from };
}
