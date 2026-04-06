import {
    CalendarDate,
    endOfMonth,
    fromDateToLocal,
    getLocalTimeZone,
    today as getToday,
    isSameDay,
} from "@internationalized/date";

export function calculateRemainingAutoTransactionSum(
    autoTransactions: { execOn: number; lastExec: string; execInterval: number; amount: number }[],
) {
    const tz = getLocalTimeZone();
    const today = getToday(tz);
    const upcomingAutoTransactions = autoTransactions.filter(({ execOn, lastExec, execInterval }) => {
        // This code assumes that all auto transactions in the past have already been executed and are part of the account balance
        const lastDay = endOfMonth(today);
        const lastExecution = new CalendarDate(...(lastExec.split("-").map(Number) as [number, number, number]));
        const nextExecution = lastExecution.add({ months: execInterval });

        const isUpcoming = execOn > today.day;
        const todayIsLastDayOfMonth = today.compare(lastDay) === 0;
        const isExecutionMonth = nextExecution.year === today.year && nextExecution.month === today.month;

        return isUpcoming && !todayIsLastDayOfMonth && isExecutionMonth;
    });

    return upcomingAutoTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
}

export function calculateAccountBalanceTimeSeries(
    startBalance: number,
    transactions: { amount: number; createdAt: string }[],
    dates: CalendarDate[],
) {
    const balance = { value: startBalance };

    const getBalanceOnDate = (date: CalendarDate) => {
        const transactionsOnCurrentDay = transactions.filter(transaction => {
            const transactionDate = fromDateToLocal(new Date(transaction.createdAt));
            return isSameDay(transactionDate, date);
        });

        const amountOnCurrentDay = transactionsOnCurrentDay.reduce((acc, transaction) => acc + transaction.amount, 0);
        balance.value += amountOnCurrentDay;
        return balance.value;
    };

    return dates.map(getBalanceOnDate);
}
