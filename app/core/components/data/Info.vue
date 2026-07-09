<script setup lang="ts">
import { ICON_INFO } from "~/core/constants/icons.constant";
const { t } = useI18n();
const props = defineProps<{ text?: string; title?: string }>();
const title = computed(() => props.title ?? t("ui.whatsThis"));
</script>

<template>
    <UModal :text="props.text" :title>
        <button class="center group focus-visible:outline-none">
            <UIcon
                :name="ICON_INFO"
                class="size-5 opacity-50 transition-all group-focus:opacity-100 group-focus-visible:opacity-100 hover:text-front hover:opacity-100 focus:text-front"
            />
        </button>
        <template #body>
            <div tabindex="0">
                {{ text }}
                <slot />
            </div>
        </template>
    </UModal>
</template>
