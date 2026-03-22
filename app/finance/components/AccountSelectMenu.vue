<script setup lang="ts">
import UpsertForm from "~/finance/components/UpsertForm.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { accounts, openAccountId } = useAccounts();
const selectOptions = computed(() =>
    accounts.value?.map(account => ({ id: account.id, label: `${account.title} (${account.currency})` })),
);
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
            icon="heroicons:arrows-right-left-20-solid"
            variant="ghost"
            :trailing-icon="false"
            value-key="id"
            :items="selectOptions"
            :aria-label="$t('finance.account.aria.switch')"
            :ui="{
                base: 'size-10 hover-none:size-12 p-0 flex items-center justify-center',
                leading: 'p-0 relative',
                content: 'w-[80dvw] xs:w-64',
                placeholder: 'hidden',
                value: 'hidden',
                leadingIcon: 'text-front size-6 hover-none:size-8',
            }"
            @update:model-value="value => (openAccountId = value)"
        >
            <UpsertForm v-model:open="upsertFormOpen" @success="upsertFormOpen = false" />
            <template #content-bottom>
                <USeparator />
                <UButton
                    class="m-1 flex justify-center"
                    icon="heroicons:plus-circle-16-solid"
                    @click="upsertFormOpen = true"
                >
                    {{ $t("ui.add") }}
                </UButton>
            </template>
        </USelectMenu>
        <template #content>
            <span data-test-id="tooltip">{{ $t("finance.account.aria.switch") }}</span>
        </template>
    </UTooltip>
</template>
