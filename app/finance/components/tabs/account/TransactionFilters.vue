<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import DateRangePicker from "~/core/components/form/DateRangePicker.vue";
import useDeferredValue from "~/core/composables/useDeferredValue";
import { ICON_FILTER } from "~/core/constants/icons.constant";
import useCategories from "~/finance/composables/useCategories";
import useTransactions from "~/finance/composables/useTransactions";

const { categoryId, reference, from, to } = useTransactions();

const deferredReference = useDeferredValue(reference);

const categories = useCategories();
const categoryItems = computed(
    () => categories.value?.map(category => ({ id: category.id, label: category.displayName })) ?? [],
);
</script>

<template>
    <UPopover>
        <Button :icon="ICON_FILTER" square variant="ghost" color="neutral" :aria-label="$t('ui.filters')" />
        <template #content>
            <div class="flex max-w-[calc(100dvw-1rem)] flex-col gap-4 p-4">
                <UFormField :label="$t('finance.reference')">
                    <UInput
                        class="w-full"
                        @update:model-value="value => (deferredReference = value?.toString() || undefined)"
                    />
                </UFormField>
                <UFormField :label="$t('finance.category')">
                    <USelectMenu
                        :items="categoryItems"
                        class="w-full"
                        value-key="id"
                        clear
                        @update:model-value="value => (categoryId = value || undefined)"
                    />
                </UFormField>
                <UFormField :label="$t('finance.dateRange')">
                    <DateRangePicker
                        class="max-w-full"
                        :start="from"
                        :end="to"
                        @update="
                            value => {
                                from = value.start;
                                to = value.end;
                            }
                        "
                    />
                </UFormField>
            </div>
        </template>
    </UPopover>
</template>

<style scoped></style>
