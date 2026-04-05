import { eachDayOfInterval, format } from "date-fns";
import useLocale from "~/core/composables/useLocale";
import useAccounts from "~/finance/composables/useAccounts";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";
import useTransactions from "~/finance/composables/useTransactions";
import { calculateAccountBalanceTimeSeries, calculateRemainingAutoTransactionSum } from "~/finance/utils/balance";
import { formatCurrency } from "~/finance/utils/currency";

export default function useAccountBalanceChartData() {
    const { openAccount } = useAccounts();
    const { from, to, transactions, startBalance } = useTransactions();
    const autoTransactions = useAutoTransactions();
    const { fnsLocale, language } = useLocale();

    const dates = computed(() => {
        if (!from.value || !to.value) return [];
        return eachDayOfInterval({ start: from.value, end: to.value });
    });

    const labels = computed(() => {
        return dates.value.map(date => format(date, "P", { locale: fnsLocale.value }));
    });

    const data = computed(() => {
        return calculateAccountBalanceTimeSeries(startBalance.value, transactions.value, dates.value);
    });

    const accountBalance = computed(() =>
        openAccount.value ? formatCurrency(language.value, openAccount.value.currency, openAccount.value.balance) : "",
    );

    const expectedBalance = computed(() => {
        if (!openAccount.value || !autoTransactions.value) return "";
        const { balance } = openAccount.value;
        const changesByEndOfMonth = calculateRemainingAutoTransactionSum(autoTransactions.value);
        const endOfMonthBalance = balance + changesByEndOfMonth;
        return formatCurrency(language.value, openAccount.value.currency, endOfMonthBalance);
    });

    return { labels, data, accountBalance, expectedBalance };
}
