<script setup lang="ts">
import { ellipsize } from "#shared/core/utils/string.util";
import Button from "~/core/components/button/Button.vue";
import useSoftDelete from "~/core/composables/useSoftDelete";
import useAccounts from "~/finance/composables/useAccounts";

const { openAccount, openAccountId, refresh } = useAccounts();

const apiRoute = computed(() => `/api/finance/accounts/${openAccountId.value}`);
const interpolations = computed(() => ({ title: ellipsize(openAccount.value?.title ?? "", 15) }));

const execute = useSoftDelete(apiRoute, {
    refresh,
    successTitle: "finance.account.toast.deletedTitle",
    successDescription: "finance.account.toast.deletedDescription",
    interpolations,
});
</script>

<template>
    <Button
        variant="subtle"
        class="flex w-full justify-center"
        color="error"
        icon="heroicons:trash"
        :on-async-click="execute"
    >
        {{ $t("ui.delete") }}
    </Button>
</template>

<style scoped></style>
