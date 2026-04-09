<script setup lang="ts">
import { CategoryIconsMap } from "#shared/finance/maps/category-icons.map";
import { ICON_EDIT } from "~/core/constants/icons.constant";
import CategoryIcon from "~/finance/components/CategoryIcon.vue";
import useIconSuggestion from "~/finance/composables/useIconSuggestion";

const emptyIcon = "question-mark-rounded";
const icons = Object.keys(CategoryIconsMap);
const props = defineProps<{ categoryName: string; defaultIcon?: string }>();
const icon = ref(props.defaultIcon ?? emptyIcon);
const open = ref(false);

const suggest = useIconSuggestion();

watch(
    () => props.categoryName,
    async newName => {
        if (!newName) {
            icon.value = emptyIcon;
            return;
        }
        icon.value = (await suggest(newName)) ?? "";
    },
);
</script>

<template>
    <UPopover v-model:open="open">
        <button
            class="group/category-icon relative overflow-hidden rounded-full"
            type="button"
            :aria-label="$t('finance.aria.selectCategoryIcon')"
        >
            <CategoryIcon :category-name="icon" />
            <span
                class="center absolute top-0 left-0 size-full bg-theme-black/60 opacity-0 transition-opacity group-hover/category-icon:opacity-100"
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
                        @click="
                            icon = ico;
                            open = false;
                        "
                    />
                </li>
            </ul>
        </template>
    </UPopover>
</template>
