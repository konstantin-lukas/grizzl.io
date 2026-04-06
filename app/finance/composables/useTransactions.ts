import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import useAccounts from "~/finance/composables/useAccounts";

export type Transaction = Awaited<
    ReturnType<typeof $fetch<unknown, `/api/finance/accounts/:accountId/transactions`>>
>[number];

export default function useTransactions() {
    const { openAccountId } = useAccounts();
    const categoryId = useState<string | undefined>("transaction-category", () => undefined);
    const from = useState<CalendarDate | undefined>("transaction-from", () => undefined);
    const to = useState<CalendarDate | undefined>("transaction-to", () => undefined);
    const reference = useState<string | undefined>("transaction-reference", () => undefined);

    const transactions = useState<Transaction[]>("transactions", () => []);
    const startBalance = useState<number>("account-start-balance", () => 0);

    const resetDateRange = () => {
        const tz = getLocalTimeZone();
        const end = today(tz);

        from.value = end.subtract({ months: 1 });
        to.value = end;
    };

    watch(openAccountId, () => {
        categoryId.value = undefined;
        reference.value = undefined;
        resetDateRange();
    });

    onMounted(resetDateRange);

    return { transactions, categoryId, from, to, reference, startBalance };
}
