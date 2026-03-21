<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import H1 from "~/core/components/typo/H1.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { openAccount } = useAccounts();
</script>

<template>
    <div class="inline-block text-center">
        <H1 class="mr-4 inline">{{ openAccount?.title }}</H1>
        <Button
            icon="heroicons:arrows-right-left-20-solid"
            variant="soft"
            class="inline-flex size-10 -translate-y-0.5"
        />
    </div>
</template>

<style scoped></style>
