import { useToast } from "#ui/composables";
import type { CalendarDate } from "@internationalized/date";
import { Time, getLocalTimeZone, toCalendarDateTime, today } from "@internationalized/date";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";

export type Transaction = Awaited<
    ReturnType<typeof $fetch<unknown, `/api/finance/accounts/:accountId/transactions`>>
>[number];

export default function useTransactions() {
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();

    const categoryId = useState<string | undefined>("transaction-category", () => undefined);
    const from = useState<CalendarDate | undefined>("transaction-from", () => undefined);
    const to = useState<CalendarDate | undefined>("transaction-to", () => undefined);
    const reference = useState<string | undefined>("transaction-reference", () => undefined);

    const transactions = useState<Transaction[]>();
    const startBalance = useState<number>();

    onMounted(() => {
        const tz = getLocalTimeZone();
        const end = today(tz);

        from.value = end.subtract({ months: 1 });
        to.value = end;
    });

    watchEffect(async () => {
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

    return { transactions, categoryId, from, to, reference, startBalance };
}
