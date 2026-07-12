<script setup lang="ts">
import type { Poll } from "~/poll/types";
import { ICON_CANCEL, ICON_CHECK } from "~/core/constants/icons.constant";

const model = defineModel<number[] | null>("selection", { required: true });
defineProps<{ poll: Poll }>();

const selectedIndex = computed<number | null>({
    get() {
        return model.value?.[0] ?? null;
    },
    set(value) {
        model.value = value === null ? null : [value];
    },
});
</script>

<template>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-for="(choice, index) in poll.choices" :key="index" class="mt-6 flex cursor-pointer items-center">
        <input v-model="selectedIndex" type="radio" name="choice" class="peer hidden" :value="index" />
        <span
            class="center mr-4 block size-10 shrink-0 grow rounded-full bg-error peer-checked:bg-primary"
            role="radio"
            tabindex="0"
            data-test-id="poll-voting-choice"
            :aria-checked="selectedIndex === index"
            :aria-labelledby="`choice-${index}-label`"
            @keydown.enter.prevent="selectedIndex = index"
        >
            <UIcon v-if="selectedIndex === index" class="size-6 text-back" :name="ICON_CHECK" />
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
