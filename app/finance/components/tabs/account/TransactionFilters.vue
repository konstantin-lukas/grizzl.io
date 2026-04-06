<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import DateRangePicker from "~/core/components/form/DateRangePicker.vue";
import { ICON_FILTER } from "~/core/constants/icons.constant";
import useCategories from "~/finance/composables/useCategories";

const categories = useCategories();
const categoryItems = computed(() => categories.value?.map(category => category.displayName) ?? []);
const value = ref();
</script>

<template>
    <UPopover>
        <Button :icon="ICON_FILTER" square variant="ghost" color="neutral" :aria-label="$t('ui.filters')" />
        <template #content>
            <div class="flex max-w-[calc(100dvw-1rem)] flex-col gap-4 p-4">
                <UFormField :label="$t('finance.reference')">
                    <UInput class="w-full" />
                </UFormField>
                <UFormField :label="$t('finance.category')">
                    <USelectMenu v-model="value" :items="categoryItems" class="w-full" />
                </UFormField>
                <UFormField :label="$t('finance.dateRange')">
                    <DateRangePicker class="max-w-full" />
                </UFormField>
            </div>
        </template>
    </UPopover>
</template>

<style scoped></style>
