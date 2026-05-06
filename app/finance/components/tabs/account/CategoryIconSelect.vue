<script setup lang="ts">
import { CategoryIconsMap } from "#shared/finance/maps/category-icons.map";
import { normalize } from "#shared/finance/utils/string";
import useDeferredSourceValue from "~/core/composables/useDeferredSourceValue";
import { ICON_EDIT, ICON_LOAD } from "~/core/constants/icons.constant";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";

const emptyIcon = "question-mark-rounded";
const icons = Object.keys(CategoryIconsMap);
const model = defineModel<string>({ default: emptyIcon });
const props = defineProps<{ categoryName: string; categories: { normalizedName: string; icon: string }[] }>();

const open = ref(false);

const categoryName = toRef(props, "categoryName");
const deferredCategoryName = useDeferredSourceValue(categoryName);
const query = computed(() => ({ categoryName: deferredCategoryName.value }));

const { data: suggestion, pending } = useFetch(`/api/finance/category-icon`, {
    query,
    default: () => ({ icon: emptyIcon }),
});

watch(suggestion, async newSuggestion => {
    const icon = props.categories.find(category => category.normalizedName === normalize(categoryName.value))?.icon;
    model.value = icon ?? newSuggestion.icon;
});
</script>

<template>
    <UPopover v-model:open="open">
        <button
            class="group/category-icon relative overflow-hidden rounded-full"
            type="button"
            :aria-label="$t('finance.transaction.aria.selectCategoryIcon')"
            :disabled="pending"
            data-test-id="finance-category-icon-select-button"
        >
            <CategoryIcon :category-name="model" />
            <span v-if="pending" class="center absolute top-0 left-0 size-full bg-theme-black/60 transition-opacity">
                <UIcon :name="ICON_LOAD" class="size-6 animate-spin text-theme-white" />
            </span>
            <span
                v-else
                class="center absolute top-0 left-0 size-full bg-theme-black/60 opacity-0 transition-opacity group-hover/category-icon:opacity-100 group-focus-visible/category-icon:opacity-100"
            >
                <UIcon :name="ICON_EDIT" class="size-6 text-theme-white" />
            </span>
        </button>
        <template #content>
            <ul class="flex w-52 max-w-[calc(100dvw-1rem)] flex-wrap p-2 xs:w-68">
                <li v-for="ico in icons" :key="ico">
                    <UButton
                        :icon="'material-symbols:' + ico"
                        :aria-label="ico"
                        square
                        variant="ghost"
                        color="neutral"
                        data-test-id="finance-category-icon-select-option"
                        @click="
                            model = ico;
                            open = false;
                        "
                    />
                </li>
            </ul>
        </template>
    </UPopover>
</template>
