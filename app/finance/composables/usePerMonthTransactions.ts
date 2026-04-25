import useToday from "~/core/composables/useToday";
import { onResponseError } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";
import type { Transaction } from "~/finance/composables/useTransactions";

export default function usePerMonthTransactions() {
    const { timeZone, today } = useToday();
    const { openAccountId } = useAccounts();
    const toast = useToast();
    const { t } = useI18n();
    const perMonthTransactions = useState<Transaction[][]>("per-month-transactions", () => []);
    const perMonthPerCategory = useState<{ spent: number; category: string }[][]>(
        "per-month-per-category-transaction-data",
        () => [],
    );

    const refresh = async () => {
        if (!today.value || !timeZone.value || import.meta.server) return;

        const start = today.value.subtract({ months: 11 }).set({ day: 1 });

        const transactions = (
            await $fetch<Transaction[]>(`/api/finance/accounts/${openAccountId.value}/transactions`, {
                onResponseError: onResponseError(toast, t),
                query: {
                    from: start.toDate(timeZone.value).toISOString(),
                },
            })
        )
            .filter(transaction => transaction.amount < 0)
            .map(transaction => ({ ...transaction, amount: Math.abs(transaction.amount) }));

        const perMonthArray = Array.from({ length: 12 }, () => []) as Transaction[][];
        const thisMonth = today.value.month;

        for (const transaction of transactions) {
            const date = new Date(transaction.createdAt);
            const month = date.getMonth();
            const index = (month - thisMonth + 12) % 12;
            perMonthArray[index]!.push(transaction);
        }

        const perCategoryArray = perMonthArray.map(monthTransactions => {
            const categories = Object.groupBy(monthTransactions, transaction => transaction.category.id);
            const categoryArray = Object.values(categories).filter(c => c !== undefined);
            return categoryArray.map(categoryTransactions => {
                const spent = categoryTransactions.reduce((sum, { amount }) => sum + amount, 0);
                return { spent, category: categoryTransactions[0]?.category.id ?? "", change: null as number | null };
            });
        });

        for (let i = perCategoryArray.length - 1; i > 0; i--) {
            perCategoryArray[i] = perCategoryArray[i]!.map(item => {
                const previous = perCategoryArray[i - 1]!.find(item2 => item.category === item2.category)?.spent ?? 0;
                const current = item.spent;
                const change = Math.round(previous === 0 ? 0 : (100 * (current - previous)) / previous);
                return { ...item, change };
            });
        }

        perMonthTransactions.value = perMonthArray;
        perMonthPerCategory.value = perCategoryArray;
    };

    watchEffect(refresh);

    return { transactions: perMonthTransactions, refresh };
}
