import { Time, getLocalTimeZone, toCalendarDateTime } from "@internationalized/date";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";
import usePerMonthTransactions from "~/finance/composables/usePerMonthTransactions";
import useTransactions, { type Transaction } from "~/finance/composables/useTransactions";

export default function useRefreshTransactions() {
    const { openAccountId, refresh: refreshAccounts } = useAccounts();

    const { transactions, categoryId, from, to, reference, startBalance } = useTransactions();
    const { refresh: refreshPerMonthTransactions, isFetching } = usePerMonthTransactions();
    const toast = useToast();
    const { t } = useI18n();

    return async () => {
        if (!from.value || !to.value || !openAccountId.value || import.meta.server) {
            transactions.value = [];
            return;
        }

        isFetching.value = true;
        const perMonthPromise = refreshPerMonthTransactions(openAccountId.value).finally(
            () => (isFetching.value = false),
        );

        const tz = getLocalTimeZone();
        const start = toCalendarDateTime(from.value, new Time(0, 0, 0, 0));
        const end = toCalendarDateTime(to.value, new Time(23, 59, 59, 999));

        const transactionsPromise = $fetch<Transaction[]>(`/api/finance/accounts/${openAccountId.value}/transactions`, {
            onResponseError: onResponseError(toast, t),
            query: {
                categoryId: categoryId.value,
                from: start.toDate(tz).toISOString(),
                to: end.toDate(tz).toISOString(),
                reference: reference.value,
            },
        });

        const balanceUntil = start.subtract({ milliseconds: 1 });

        const balancePromise = $fetch<number>(`/api/finance/accounts/${openAccountId.value}/balance`, {
            onResponseError: onResponseError(toast, t),
            query: {
                categoryId: categoryId.value,
                to: balanceUntil.toDate(tz).toISOString(),
                reference: reference.value,
            },
        });

        [transactions.value, startBalance.value] = await Promise.all([
            transactionsPromise,
            balancePromise,
            perMonthPromise,
        ]);
        await refreshAccounts();
    };
}
