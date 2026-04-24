<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import H2 from "~/core/components/typo/H2.vue";
import useToday from "~/core/composables/useToday";
import BaseTransactionCard from "~/finance/components/tabs/account/BaseTransactionCard.vue";
import BillsProgress from "~/finance/components/tabs/bills/BillsProgress.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";

const { monthName, today } = useToday();
const { autoTransactions } = useAutoTransactions();
const { openAccount } = useAccounts();
const currency = computed(() => openAccount.value?.currency ?? "USD");

const bills = computed(() =>
    Object.groupBy(autoTransactions.value, at => {
        if (at.amount >= 0) return "irrelevant";
        const lastExecDate = new CalendarDate(...(at.lastExec.split("-").map(Number) as [number, number, number]));

        if (lastExecDate.year === today.value?.year && lastExecDate.month === today.value?.month) {
            return "paid";
        }

        const nextExecDate = lastExecDate.add({ months: at.execInterval }).set({ day: at.execOn });
        if (nextExecDate.year !== today.value?.year || nextExecDate.month !== today.value?.month) {
            return "irrelevant";
        }

        at.createdAt = nextExecDate.toString();
        return "remaining";
    }),
);

const remaining = computed(() => (bills.value.remaining ?? []).reduce((sum, { amount }) => sum + Math.abs(amount), 0));
const paid = computed(() => (bills.value.paid ?? []).reduce((sum, { amount }) => sum + Math.abs(amount), 0));
</script>

<template>
    <H2 class="mb-4">{{ $t("finance.bills.upcoming", { month: monthName }) }}</H2>
    <BillsProgress :remaining :paid :currency />
    <ul>
        <BaseTransactionCard v-for="bill in bills.remaining" :key="bill.id" :transaction="bill" :currency="currency" />
    </ul>
</template>
