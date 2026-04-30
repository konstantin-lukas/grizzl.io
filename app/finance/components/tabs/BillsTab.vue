<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import H2 from "~/core/components/typo/H2.vue";
import H3 from "~/core/components/typo/H3.vue";
import useLocale from "~/core/composables/useLocale";
import useToday from "~/core/composables/useToday";
import TransactionCardSkeleton from "~/finance/components/TransactionCardSkeleton.vue";
import BaseTransactionCard from "~/finance/components/tabs/account/BaseTransactionCard.vue";
import BillsProgress from "~/finance/components/tabs/bills/BillsProgress.vue";
import useAccounts from "~/finance/composables/useAccounts";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { monthName, today } = useToday();
const { autoTransactions, isFetching } = useAutoTransactions();
const { openAccount } = useAccounts();
const currency = computed(() => openAccount.value?.currency ?? "USD");
const { language } = useLocale();

const bills = computed(() =>
    Object.groupBy(autoTransactions.value, at => {
        if (at.amount >= 0) return "irrelevant";

        const lastExecDate = new CalendarDate(...(at.lastExec.split("-").map(Number) as [number, number, number]));
        if (lastExecDate.year === today.value?.year && lastExecDate.month === today.value?.month) {
            at.createdAt = lastExecDate.toString();
            return "paid";
        }

        const nextExecDate = lastExecDate.add({ months: at.execInterval }).set({ day: at.execOn });
        if (nextExecDate.year === today.value?.year && nextExecDate.month === today.value?.month) {
            at.createdAt = nextExecDate.toString();
            return "remaining";
        }

        return "irrelevant";
    }),
);

const remaining = computed(() => (bills.value.remaining ?? []).reduce((sum, { amount }) => sum + Math.abs(amount), 0));
const paid = computed(() => (bills.value.paid ?? []).reduce((sum, { amount }) => sum + Math.abs(amount), 0));
</script>

<template>
    <H2 class="mb-2">{{ $t("finance.bills.upcoming", { month: monthName }) }}</H2>
    <BillsProgress :remaining :paid :currency :is-fetching />
    <H3 class="mt-6 flex items-center gap-1">
        <span>{{ $t("finance.bills.remaining") }}:</span>
        <USkeleton v-if="isFetching" class="inline-block h-6 w-20" />
        <span v-else>{{ formatCurrency(language, currency, remaining) }}</span>
    </H3>
    <ul v-if="!isFetching">
        <BaseTransactionCard v-for="bill in bills.remaining" :key="bill.id" :transaction="bill" :currency="currency" />
    </ul>
    <div v-if="isFetching">
        <TransactionCardSkeleton v-for="n in bills.remaining?.length ?? 0" :key="n" />
    </div>
    <USeparator class="mt-4" />
    <H3 class="mt-3 flex items-center gap-1">
        <span>{{ $t("finance.bills.paid") }}: </span>
        <USkeleton v-if="isFetching" class="inline-block h-6 w-20" />
        <span v-else>{{ formatCurrency(language, currency, paid) }}</span>
    </H3>
    <ul v-if="!isFetching" class="opacity-50">
        <BaseTransactionCard v-for="bill in bills.paid" :key="bill.id" :transaction="bill" :currency="currency" />
    </ul>
    <div v-if="isFetching">
        <TransactionCardSkeleton v-for="n in bills.paid?.length ?? 0" :key="n" />
    </div>
</template>
