<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import type { DropdownMenuItem } from "@nuxt/ui";
import Button from "~/core/components/button/Button.vue";
import { ICON_DELETE, ICON_EDIT, ICON_MORE_VERT } from "~/core/constants/icons.constant";
import { formatDate } from "~/core/utils/date";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import useAccounts from "~/finance/composables/useAccounts";
import type { Transaction } from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { openAccount } = useAccounts();
const items = ref<DropdownMenuItem[]>([
    {
        label: "edit",
        icon: ICON_EDIT,
        color: "primary",
        // onSelect: () => console.log(1),
    },
    {
        label: "delete",
        icon: ICON_DELETE,
        color: "error",
        // onSelect: () => console.log(1),
    },
]);

const props = defineProps<{ transaction: Transaction }>();
const { locale } = useI18n();
const language = computed(() => LOCALES.find(({ code }) => code === locale.value)?.language ?? "en-US");
const dateAndReference = computed(() => {
    let date = formatDate(props.transaction.createdAt, language.value);
    if (props.transaction.reference) date += ` | ${props.transaction.reference}`;
    return date;
});
const isSpending = computed(() => props.transaction.amount < 0);
const amount = computed(() => {
    if (!openAccount.value) return "";
    return formatCurrency(language.value, openAccount.value.currency, props.transaction.amount);
});
</script>

<template>
    <div class="flex justify-between rounded-xl bg-elevated p-4">
        <div class="flex items-center overflow-hidden">
            <div class="center aspect-square size-12 rounded-full bg-primary">
                <CategoryIcon class="size-8 bg-back" :name="props.transaction.category.icon" />
            </div>
            <div class="mx-4 flex flex-col gap-1 overflow-hidden">
                <span :title="props.transaction.category.name" class="overflow-hidden text-nowrap text-ellipsis">
                    {{ props.transaction.category.name }}
                </span>
                <span class="overflow-hidden text-nowrap text-ellipsis text-muted">
                    {{ dateAndReference }}
                </span>
            </div>
        </div>
        <div class="flex shrink-0 items-center justify-end gap-3">
            <UBadge :color="isSpending ? 'error' : 'primary'" class="text-back">
                {{ amount }}
            </UBadge>
            <UDropdownMenu :items="items">
                <Button
                    :icon="ICON_MORE_VERT"
                    square
                    variant="ghost"
                    color="neutral"
                    :aria-label="$t('ui.moreActions')"
                    class="hover:bg-accented focus-visible:bg-accented"
                />
                <template #item-label="{ item }"> {{ $t(`ui.${item.label}`) }}</template>
            </UDropdownMenu>
        </div>
    </div>
</template>
