import type { CalendarDate } from "@internationalized/date";

export type Transaction = Awaited<
    ReturnType<typeof $fetch<unknown, `/api/finance/accounts/:accountId/transactions`>>
>[number];

export default function useTransactions() {
    const categoryId = useState<string | undefined>("transaction-category", () => undefined);
    const from = useState<CalendarDate | undefined>("transaction-from", () => undefined);
    const to = useState<CalendarDate | undefined>("transaction-to", () => undefined);
    const reference = useState<string | undefined>("transaction-reference", () => undefined);
    const isFetching = useState<boolean>("transactions-fetching", () => false);

    const transactions = useState<Transaction[]>("transactions", () => []);
    const startBalance = useState<number>("account-start-balance", () => 0);

    return { transactions, categoryId, from, to, reference, startBalance, isFetching };
}
