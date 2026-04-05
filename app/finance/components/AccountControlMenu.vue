<script setup lang="ts">
import type { Account } from "#shared/finance/validators/account.validator";
import Button from "~/core/components/button/Button.vue";
import { ICON_EDIT, ICON_OPTIONS, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";
import AccountDeleteButton from "~/finance/components/AccountDeleteButton.vue";
import UpsertForm from "~/finance/components/UpsertForm.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { accounts, openAccount, openAccountId } = useAccounts();

const selectOptions = computed(() =>
    accounts.value?.map(account => ({ id: account.id, label: `${account.title} (${account.currency})` })),
);
const initialState = ref<Account | undefined>(undefined);
const selectOpen = ref(false);
const selectedOption = ref(selectOptions.value?.find(o => o.id === openAccountId.value)?.id);
watch(openAccountId, () => {
    selectedOption.value = openAccountId.value;
});
const upsertFormOpen = ref(false);

watch(upsertFormOpen, () => {
    selectOpen.value = false;
});
</script>

<template>
    <UTooltip :ui="{ content: 'hover-none:!hidden' }">
        <USelectMenu
            v-model:open="selectOpen"
            v-model="selectedOption"
            :icon="ICON_OPTIONS"
            variant="ghost"
            :trailing-icon="false"
            value-key="id"
            :items="selectOptions"
            :aria-label="$t('finance.account.aria.controls')"
            :ui="{
                base: 'size-10 hover-none:size-12 p-0 flex items-center justify-center',
                leading: 'p-0 relative',
                content: 'w-[calc(100dvw-1rem)] sm:w-64',
                placeholder: 'hidden',
                value: 'hidden',
                leadingIcon: 'text-front size-6 hover-none:size-8',
            }"
            @update:model-value="value => (openAccountId = value)"
        >
            <UpsertForm v-model:open="upsertFormOpen" :initial-state="initialState" @success="upsertFormOpen = false" />
            <template #content-bottom>
                <USeparator />
                <div class="m-1">
                    <Button
                        class="flex w-full justify-center"
                        :icon="ICON_PLUS_CIRCLE"
                        @click="
                            initialState = undefined;
                            upsertFormOpen = true;
                        "
                    >
                        {{ $t("ui.add") }}
                    </Button>
                    <div v-if="openAccountId" class="mt-1 flex gap-1">
                        <Button
                            variant="subtle"
                            class="flex w-full justify-center"
                            :icon="ICON_EDIT"
                            @click="
                                initialState = openAccount;
                                upsertFormOpen = true;
                            "
                        >
                            {{ $t("ui.edit") }}
                        </Button>
                        <AccountDeleteButton />
                    </div>
                </div>
            </template>
        </USelectMenu>
        <template #content>
            <span data-test-id="tooltip">{{ $t("finance.account.aria.controls") }}</span>
        </template>
    </UTooltip>
</template>
