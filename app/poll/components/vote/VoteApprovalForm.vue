<script setup lang="ts">
import type { Poll } from "~/poll/types";
import { ICON_CANCEL, ICON_CHECK } from "~/core/constants/icons.constant";
import { deleteNthElement } from "#shared/core/utils/array.util";

const model = defineModel<number[]>("selection", { required: true });
defineProps<{ poll: Poll }>();
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-for="(choice, index) in poll.choices" :key="index" class="mt-6 flex cursor-pointer items-center">
        <input v-model="model" :value="index" type="checkbox" name="choice" class="peer hidden" />
        <span
            class="center mr-4 block size-10 shrink-0 grow rounded-full bg-error peer-checked:bg-primary"
            role="checkbox"
            tabindex="0"
            :aria-checked="model.includes(index)"
            :aria-labelledby="`choice-${index}-label`"
            @keydown.enter.prevent="
                () => {
                    if (model.includes(index)) {
                        model = deleteNthElement(model, index);
                        return;
                    }
                    model = [...model, index];
                }
            "
        >
            <UIcon v-if="model.includes(index)" class="size-6 text-back" :name="ICON_CHECK" />
            <UIcon v-else class="size-6 text-back" :name="ICON_CANCEL" />
        </span>
        <span
            :id="`choice-${index}-label`"
            class="w-full items-center overflow-hidden rounded-full border border-accented px-8 py-2 text-nowrap text-ellipsis select-none"
        >
            {{ choice }}
        </span>
    </label>
</template>
