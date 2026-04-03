<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import type { DropdownMenuItem } from "@nuxt/ui";
import { intlFormat } from "date-fns";
import Button from "~/core/components/button/Button.vue";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import useAccounts from "~/finance/composables/useAccounts";
import type { Transaction } from "~/finance/composables/useTransactions";
import { formatCurrency } from "~/finance/utils/currency";

const { openAccount } = useAccounts();
const items = ref<DropdownMenuItem[]>([
    {
        label: "edit",
        icon: "material-symbols:edit-outline-rounded",
        color: "primary",
        // onSelect: () => console.log(1),
    },
    {
        label: "delete",
        icon: "material-symbols:delete-outline-rounded",
        color: "error",
        // onSelect: () => console.log(1),
    },
]);

const props = defineProps<{ transaction: Transaction }>();
const { locale } = useI18n();
const language = computed(() => LOCALES.find(({ code }) => code === locale.value)?.language ?? "en-US");
const dateAndReference = computed(() => {
    let date = intlFormat(props.transaction.createdAt, { locale: language.value });
    if (props.transaction.reference) date += ` (${props.transaction.reference})`;
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
                    icon="material-symbols:more-vert"
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
