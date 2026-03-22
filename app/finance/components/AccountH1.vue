<script setup lang="ts">
import H1 from "~/core/components/typo/H1.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { openAccount } = useAccounts();
</script>

<template>
    <div class="inline-block text-center">
        <H1 aria-live="polite">{{ openAccount?.title }}</H1>
    </div>
</template>

<style scoped></style>
