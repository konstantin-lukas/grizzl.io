import { filterMap } from "#shared/core/utils/array.util";
import { fromDateToLocal } from "@internationalized/date";
import useToday from "~/core/composables/useToday";
import { onResponseError } from "~/core/utils/toast";
import useCategories from "~/finance/composables/useCategories";
import type { Transaction } from "~/finance/composables/useTransactions";

export interface PerMonthCategoryStatistics {
    spent: number;
    category: string;
    change: number | null;
}

export default function usePerMonthTransactions() {
    const { timeZone, today } = useToday();
    const { categories } = useCategories();
    const toast = useToast();
    const { t } = useI18n();
    const perMonthTransactions = useState<Transaction[][]>("per-month-transactions", () => []);
    const perMonthPerCategory = useState<PerMonthCategoryStatistics[][]>(
        "per-month-per-category-transaction-data",
        () => [],
    );
    const expectedTransactionSumByEndOfMonth = useState<number>("end-of-month-transaction-sum", () => 0);
    const isFetching = useState("is-fetching-per-month-transactions", () => false);

    const refresh = async (id: string) => {
        if (!today.value || !timeZone.value || !id || import.meta.server) return;

        const start = today.value.subtract({ months: 11 }).set({ day: 1 });

        const transactions = await $fetch<Transaction[]>(`/api/finance/accounts/${id}/transactions`, {
            onResponseError: onResponseError(toast, t),
            query: {
                from: start.toDate(timeZone.value).toISOString(),
            },
        });

        expectedTransactionSumByEndOfMonth.value = transactions
            .filter(transaction => {
                if (transaction.automaticallyCreated || !today.value) return false;
                const refDate = today.value.subtract({ months: 1 });
                const createdAt = fromDateToLocal(new Date(transaction.createdAt));
                return createdAt.compare(refDate) > 0 && createdAt.month === refDate.month;
            })
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const filterMappedTransactions = filterMap(transactions, transaction => {
            if (transaction.amount < 0) return { ...transaction, amount: Math.abs(transaction.amount) };
        });

        const perMonthArray = Array.from({ length: 12 }, () => []) as Transaction[][];
        const thisMonth = today.value.month;

        for (const transaction of filterMappedTransactions) {
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
            }).sort((a, b) => {
                const aDisplayName = categories.value.find(c => c.id === a.category)?.displayName ?? "";
                const bDisplayName = categories.value.find(c => c.id === b.category)?.displayName ?? "";
                return aDisplayName.localeCompare(bDisplayName);
            });
        }

        perMonthTransactions.value = perMonthArray;
        perMonthPerCategory.value = perCategoryArray;
    };

    return {
        transactions: perMonthTransactions,
        perMonthPerCategory,
        refresh,
        isFetching,
        expectedTransactionSumByEndOfMonth,
    };
}
