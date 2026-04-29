import useLocale from "~/core/composables/useLocale";
import { eachDayOfInterval, formatDate } from "~/core/utils/date";
import useAccounts from "~/finance/composables/useAccounts";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";
import useTransactions from "~/finance/composables/useTransactions";
import { calculateAccountBalanceTimeSeries, calculateRemainingAutoTransactionSum } from "~/finance/utils/balance";
import { formatCurrency } from "~/finance/utils/currency";

export default function useAccountBalanceChartData() {
    const { openAccount, isFetching: accountsFetching } = useAccounts();
    const { from, to, transactions, startBalance } = useTransactions();
    const { autoTransactions, isFetching: autoTransactionsFetching } = useAutoTransactions();
    const { language } = useLocale();

    const dates = computed(() => {
        if (!from.value || !to.value) return [];
        return eachDayOfInterval(from.value, to.value);
    });

    const labels = computed(() => {
        return dates.value.map(date => formatDate(date, language.value));
    });

    const data = computed(() => {
        return calculateAccountBalanceTimeSeries(startBalance.value, transactions.value, dates.value);
    });

    const accountBalance = computed(() => {
        if (accountsFetching.value) return "";
        return openAccount.value
            ? formatCurrency(language.value, openAccount.value.currency, openAccount.value.balance)
            : "";
    });

    const expectedBalance = computed(() => {
        if (autoTransactionsFetching.value || !openAccount.value || !autoTransactions.value) return "";
        const { balance } = openAccount.value;
        const changesByEndOfMonth = calculateRemainingAutoTransactionSum(autoTransactions.value);
        const endOfMonthBalance = balance + changesByEndOfMonth;
        return formatCurrency(language.value, openAccount.value.currency, endOfMonthBalance);
    });

    return { labels, data, accountBalance, expectedBalance };
}
