<script setup lang="ts">
import type { Poll } from "~/poll/types";
import { ICON_DRAG_VERTICAL } from "~/core/constants/icons.constant";
import { VueDraggable } from "vue-draggable-plus";

const model = defineModel<number[]>("selection", { required: true });
defineProps<{ poll: Poll }>();
</script>

<template>
    <VueDraggable
        v-model="model"
        :animation="250"
        class="center relative mt-6 w-full gap-6"
        tag="div"
        handle="[data-handle]"
        ghost-class="ghost"
    >
        <TransitionGroup name="draggable-list">
            <div
                v-for="choiceIndex in model"
                :key="choiceIndex"
                data-handle
                class="flex w-full cursor-move items-center justify-start overflow-hidden rounded-full border border-accented py-2 pr-8 pl-4 text-nowrap text-ellipsis select-none"
            >
                <UIcon :name="ICON_DRAG_VERTICAL" class="size-6 shrink-0" />
                <span class="ml-2 min-w-0 truncate">{{ poll.choices[choiceIndex] }}</span>
            </div>
        </TransitionGroup>
    </VueDraggable>
</template>
