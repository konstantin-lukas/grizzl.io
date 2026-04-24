<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import useToday from "~/core/composables/useToday";

const { month } = useToday();
</script>

<template>
    <div class="flex items-end justify-between">
        <H2 class="mb-4">{{ $t("finance.bills.upcoming", { month }) }}</H2>
    </div>
</template>
