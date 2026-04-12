<script setup lang="ts">
import type { Language } from "#shared/core/constants/i18n.constant";
import { ellipsize } from "#shared/core/utils/string.util";
import Button from "~/core/components/button/Button.vue";
import { ICON_DELETE, ICON_EDIT, ICON_EVENT_REPEAT, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import TransactionFilters from "~/finance/components/tabs/account/TransactionFilters.vue";
import useAutoTransactions from "~/finance/composables/useAutoTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const autoTransactions = useAutoTransactions();
const props = defineProps<{ locale: Language; currency: string }>();
const emit = defineEmits(["open-insert-transaction-form"]);
</script>

<template>
    <div class="flex shrink-0 -translate-y-3 gap-1">
        <Button
            :icon="ICON_PLUS_CIRCLE"
            square
            variant="ghost"
            color="neutral"
            :aria-label="$t('finance.account.addTransaction')"
            @click="emit('open-insert-transaction-form')"
        />
        <UPopover>
            <Button
                :icon="ICON_EVENT_REPEAT"
                square
                variant="ghost"
                color="neutral"
                :aria-label="$t('finance.account.manageAutoTransactions')"
            />
            <template #content>
                <ul class="max-h-64 max-w-[calc(100dvw-1rem)] overflow-auto py-2">
                    <li class="mx-4 my-2">
                        <Button :icon="ICON_PLUS_CIRCLE" class="flex w-full justify-center" variant="subtle">
                            {{ $t("ui.create") }}
                        </Button>
                    </li>
                    <li
                        v-for="autoTransaction in autoTransactions"
                        :key="autoTransaction.id"
                        class="flex items-center justify-between px-3 py-1"
                    >
                        <div class="flex items-center">
                            <CategoryIcon :category-name="autoTransaction.category.icon" class="scale-75" />
                            <div class="mx-2 flex flex-col">
                                <span :title="autoTransaction.category.name">
                                    {{ ellipsize(autoTransaction.category.name, 12) }}
                                </span>
                                <span class="text-muted">{{
                                    formatCurrency(props.locale, props.currency, autoTransaction.amount)
                                }}</span>
                            </div>
                        </div>
                        <div>
                            <Button
                                :icon="ICON_EDIT"
                                square
                                variant="ghost"
                                color="neutral"
                                :aria-label="$t('ui.edit')"
                            />
                            <Button
                                :icon="ICON_DELETE"
                                square
                                variant="ghost"
                                color="error"
                                :aria-label="$t('ui.delete')"
                            />
                        </div>
                    </li>
                </ul>
            </template>
        </UPopover>
        <TransactionFilters />
    </div>
</template>

<style scoped></style>
