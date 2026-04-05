import { useToast } from "#ui/composables";
import { subMilliseconds, subMonths } from "date-fns";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export type Transaction = Awaited<
    ReturnType<typeof $fetch<unknown, `/api/finance/accounts/:accountId/transactions`>>
>[number];

export default function useTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const categoryId = useState<string | undefined>(() => undefined);
    const from = useState<Date>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return subMonths(now, 1);
    });
    const to = useState<Date>(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        return now;
    });
    const reference = useState<string | undefined>(() => undefined);

    const transactions = useState<Transaction[]>();
    const startBalance = useState<number>();

    watchEffect(async () => {
        if (!openAccountId.value || import.meta.server) {
            transactions.value = [];
            return;
        }

        const transactionsPromise = $fetch<Transaction[]>(`/api/finance/accounts/${openAccountId.value}/transactions`, {
            onResponseError: onResponseError(toast, t),
            query: {
                categoryId: categoryId.value,
                from: from.value.toISOString(),
                to: to.value.toISOString(),
                reference: reference.value,
            },
        });

        const balancePromise = $fetch<number>(`/api/finance/accounts/${openAccountId.value}/balance`, {
            onResponseError: onResponseError(toast, t),
            query: {
                categoryId: categoryId.value,
                to: subMilliseconds(from.value, 1).toISOString(),
                reference: reference.value,
            },
        });

        [transactions.value, startBalance.value] = await Promise.all([transactionsPromise, balancePromise]);
    });

    return { transactions, categoryId, from, to, reference, startBalance };
}
