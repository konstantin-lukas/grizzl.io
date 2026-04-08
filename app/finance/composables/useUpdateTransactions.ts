import { Time, getLocalTimeZone, toCalendarDateTime } from "@internationalized/date";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";
import useTransactions, { type Transaction } from "~/finance/composables/useTransactions";

export default function useUpdateTransactions() {
    const { openAccountId } = useAccounts();

    const { transactions, categoryId, from, to, reference, startBalance } = useTransactions();
    const toast = useToast();
    const { t } = useI18n();

    const lastParams = ref<string | null>(null);

    watch([openAccountId, categoryId, from, to, reference], async () => {
        const params =
            (openAccountId.value ?? "") +
            (categoryId.value ?? "") +
            from.value?.toString() +
            to.value?.toString() +
            reference.value;
        if (lastParams.value === params) return;
        lastParams.value = params;

        if (!from.value || !to.value || !openAccountId.value || import.meta.server) {
            transactions.value = [];
            return;
        }

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

        [transactions.value, startBalance.value] = await Promise.all([transactionsPromise, balancePromise]);
    });
}
