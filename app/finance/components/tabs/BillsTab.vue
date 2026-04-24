<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import H2 from "~/core/components/typo/H2.vue";
import useToday from "~/core/composables/useToday";
import BillsProgress from "~/finance/components/tabs/bills/BillsProgress.vue";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";

const { monthName, today } = useToday();
const { autoTransactions } = useAutoTransactions();

const bills = computed(() =>
    Object.groupBy(autoTransactions.value, ({ lastExec, execInterval, execOn }) => {
        const lastExecDate = new CalendarDate(...(lastExec.split("-").map(Number) as [number, number, number]));
        const nextExecDate = lastExecDate.add({ months: execInterval }).set({ day: execOn });
        if (nextExecDate.year !== today.value?.year || nextExecDate.month === today.value?.month) return "irrelevant";
        return nextExecDate.day > today.value?.day ? "remaining" : "paid";
    }),
);

const remaining = computed(() => (bills.value.remaining ?? []).reduce((sum, { amount }) => sum + amount, 0));
const paid = computed(() => (bills.value.paid ?? []).reduce((sum, { amount }) => sum + amount, 0));
</script>

<template>
    <H2 class="mb-4">{{ $t("finance.bills.upcoming", { month: monthName }) }}</H2>
    <BillsProgress :remaining :paid />
</template>
