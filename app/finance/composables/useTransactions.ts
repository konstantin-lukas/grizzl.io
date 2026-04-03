import { useToast } from "#ui/composables";
import { subMonths } from "date-fns";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

type Transactions = Awaited<ReturnType<typeof $fetch<unknown, `/api/finance/accounts/:accountId/transactions`>>>;

export default function useTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const categoryId = useState<string | undefined>(() => undefined);
    const from = useState<Date | undefined>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return subMonths(now, 1);
    });
    const to = useState<Date | undefined>(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        return now;
    });
    const reference = useState<string | undefined>(() => undefined);

    const transactions = useState<Transactions>();

    watchEffect(async () => {
        if (!openAccountId.value) {
            transactions.value = [];
            return;
        }

        transactions.value = await $fetch<Transactions>(`/api/finance/accounts/${openAccountId.value}/transactions`, {
            onResponseError: onResponseError(toast, t),
            query: {
                categoryId: categoryId.value,
                from: from.value?.toISOString(),
                to: to.value?.toISOString(),
                reference: reference.value,
            },
        });
    });

    return { transactions, categoryId, from, to, reference };
}
