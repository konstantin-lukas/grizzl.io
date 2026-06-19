<script setup lang="ts">
import { CATEGORY_ICONS } from "#shared/core/constants/category-icons.constant";
import useDeferredSourceValue from "~/core/composables/useDeferredSourceValue";
import { ICON_EDIT, ICON_LOAD } from "~/core/constants/icons.constant";
import CategoryIcon from "~/core/components/icon/CategoryIcon.vue";
import { normalize } from "#shared/core/utils/string.util";

const emptyIcon = "question-mark-rounded";
const model = defineModel<string>({ default: emptyIcon });
const props = defineProps<{ categoryName: string; categories?: { normalizedName: string; icon: string }[] }>();
const emit = defineEmits<{ (e: "suggestion" | "select", icon: string, text: string): void }>();

const open = ref(false);

const categoryName = toRef(props, "categoryName");
const ignoreSuggestion = ref(false);
const deferredCategoryName = useDeferredSourceValue(categoryName);
const query = computed(() => ({ categoryName: deferredCategoryName.value }));

const { data: suggestion, pending } = useFetch(`/api/icon-suggestion`, {
    query,
    default: () => ({ icon: emptyIcon }),
    immediate: false,
});

watch(categoryName, () => (ignoreSuggestion.value = false));

watch(suggestion, async newSuggestion => {
    emit("suggestion", newSuggestion.icon, categoryName.value);
    if (ignoreSuggestion.value) return;
    const icon = props.categories?.find(category => category.normalizedName === normalize(categoryName.value))?.icon;
    model.value = icon ?? newSuggestion.icon;
});
</script>

<template>
    <UPopover v-model:open="open">
        <button
            class="group/category-icon relative overflow-hidden rounded-full"
            type="button"
            :aria-label="$t('ui.selectIcon')"
            :disabled="pending"
            data-test-id="category-icon-select-button"
            :data-icon="model"
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
                <li v-for="ico in CATEGORY_ICONS" :key="ico">
                    <UButton
                        :icon="'material-symbols:' + ico"
                        :aria-label="ico"
                        square
                        variant="ghost"
                        color="neutral"
                        data-test-id="category-icon-select-option"
                        @click="
                            model = ico;
                            open = false;
                            ignoreSuggestion = true;
                            emit('select', ico, categoryName);
                        "
                    />
                </li>
            </ul>
        </template>
    </UPopover>
</template>
