<script setup lang="ts">
import type { Language } from "#shared/core/constants/i18n.constant";
import Button from "~/core/components/button/Button.vue";
import { ICON_EDIT, ICON_EVENT_REPEAT, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import AutoTransactionDeleteButton from "~/finance/components/tabs/account/AutoTransactionDeleteButton.vue";
import AutoTransactionUpsertForm from "~/finance/components/tabs/account/AutoTransactionUpsertForm.vue";
import TransactionFilters from "~/finance/components/tabs/account/TransactionFilters.vue";
import useAutoTransactions, { type AutoTransaction } from "~/finance/composables/useAutoTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { autoTransactions, refresh } = useAutoTransactions();
const props = defineProps<{ locale: Language; currency: string }>();
const emit = defineEmits(["open-insert-transaction-form", "update-auto-transactions"]);
const isPopoverOpen = ref(false);
const isUpsertFormOpen = ref(false);

const initialState = ref<AutoTransaction>();

const handleOpen = (isOpen: boolean) => {
    setTimeout(() => (isPopoverOpen.value = isOpen), 0);
    if (autoTransactions.value.length === 0) refresh();
};
</script>

<template>
    <div class="flex shrink-0 -translate-y-3 gap-1">
        <Button
            :icon="ICON_PLUS_CIRCLE"
            square
            variant="ghost"
            color="neutral"
            :aria-label="$t('finance.account.addTransaction')"
            data-test-id="finance-transaction-create-button"
            @click="emit('open-insert-transaction-form')"
        />
        <UPopover @update:open="handleOpen">
            <Button
                :icon="ICON_EVENT_REPEAT"
                square
                variant="ghost"
                color="neutral"
                :aria-label="$t('finance.account.manageAutoTransactions')"
                data-test-id="finance-auto-transaction-menu-button"
            />
            <template #content>
                <ul class="relative max-h-64 max-w-[calc(100dvw-1rem)] overflow-auto py-2">
                    <li class="mx-4 my-2">
                        <Button
                            :icon="ICON_PLUS_CIRCLE"
                            class="flex w-full justify-center"
                            variant="subtle"
                            data-test-id="finance-auto-transaction-create-button"
                            @click="
                                initialState = undefined;
                                isUpsertFormOpen = true;
                            "
                        >
                            {{ $t("ui.create") }}
                        </Button>
                    </li>
                    <TransitionGroup name="list">
                        <li
                            v-for="autoTransaction in autoTransactions"
                            :key="autoTransaction.id"
                            class="relative flex w-full items-center justify-between px-3 py-1"
                            :class="{ 'transition-none!': !isPopoverOpen }"
                        >
                            <div class="flex max-w-[calc(100%-4rem)] items-center">
                                <CategoryIcon :category-name="autoTransaction.category.icon" class="scale-75" />
                                <div class="mx-2 flex flex-col overflow-hidden">
                                    <span class="overflow-hidden text-nowrap text-ellipsis">
                                        {{ autoTransaction.category.name }}
                                    </span>
                                    <span class="overflow-hidden text-nowrap text-ellipsis text-muted">
                                        {{ formatCurrency(props.locale, props.currency, autoTransaction.amount) }}
                                    </span>
                                </div>
                            </div>
                            <div class="shrink-0">
                                <Button
                                    :icon="ICON_EDIT"
                                    square
                                    variant="ghost"
                                    color="neutral"
                                    :aria-label="$t('ui.edit')"
                                    data-test-id="finance-auto-transaction-edit-button"
                                    @click="
                                        initialState = autoTransaction;
                                        isUpsertFormOpen = true;
                                    "
                                />
                                <AutoTransactionDeleteButton :auto-transaction="autoTransaction" />
                            </div>
                        </li>
                    </TransitionGroup>
                </ul>
            </template>
        </UPopover>
        <TransactionFilters />
        <AutoTransactionUpsertForm
            v-model:open="isUpsertFormOpen"
            :initial-state="initialState"
            @success="
                isUpsertFormOpen = false;
                emit('update-auto-transactions');
                refresh();
            "
        />
    </div>
</template>
