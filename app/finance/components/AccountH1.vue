<script setup lang="ts">
import H1 from "~/core/components/typo/H1.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { openAccount, openAccountId } = useAccounts();
</script>

<template>
    <div class="inline-block text-center">
        <Transition name="fade" mode="out-in">
            <H1 :key="openAccountId ?? undefined" aria-live="polite" class="min-h-12">{{ openAccount?.title }}</H1>
        </Transition>
    </div>
</template>

<style scoped></style>
