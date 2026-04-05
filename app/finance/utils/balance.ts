import { addMonths, endOfMonth, getDate, isSameDay } from "date-fns";

export function calculateRemainingAutoTransactionSum(
    autoTransactions: { execOn: number; lastExec: string; execInterval: number; amount: number }[],
) {
    const upcomingAutoTransactions = autoTransactions.filter(({ execOn, lastExec, execInterval }) => {
        // This code assumes that all auto transactions in the past have already been executed and are part of the account balance
        const now = new Date();
        const today = now.getDate();
        const lastDay = getDate(endOfMonth(now));
        const lastExecution = new Date(lastExec);
        const nextExecution = addMonths(lastExecution, execInterval);
        const nextExecutionYear = nextExecution.getFullYear();
        const nextExecutionMonth = nextExecution.getMonth();

        const isUpcoming = execOn > today;
        const todayIsLastDayOfMonth = today === lastDay;
        const isExecutionMonth = nextExecutionYear === now.getFullYear() && nextExecutionMonth === now.getMonth();

        return isUpcoming && !todayIsLastDayOfMonth && isExecutionMonth;
    });

    return upcomingAutoTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
}

export function calculateAccountBalanceTimeSeries(
    startBalance: number,
    transactions: { amount: number; createdAt: string }[],
    dates: Date[],
) {
    const balance = { value: startBalance };

    const getBalanceOnDate = (date: Date) => {
        const transactionsOnCurrentDay = transactions.filter(transaction => isSameDay(transaction.createdAt, date));

        const amountOnCurrentDay = transactionsOnCurrentDay.reduce((acc, transaction) => acc + transaction.amount, 0);
        balance.value += amountOnCurrentDay;
        return balance.value;
    };

    return dates.map(getBalanceOnDate);
}
