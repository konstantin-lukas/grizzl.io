<script setup lang="ts">
import type { TimerInput } from "#shared/schema/timer";
import { nanoid } from "nanoid";

const intervals = defineModel<TimerInput["intervals"]>("intervals");
const { index } = defineProps<{ index: number }>();
</script>

<template>
    <div
        class="invisible absolute left-0 mt-4 flex w-full items-center justify-center gap-4 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 sm:top-0 sm:left-full sm:mt-0 sm:ml-4 sm:w-auto sm:flex-col"
    >
        <Button
            :content="{ side: 'top', sideOffset: 13 }"
            icon="heroicons:document-duplicate"
            variant="subtle"
            aria-label="Duplicate interval"
            :disabled="intervals?.length === 100"
            @click="
                () => {
                    if (intervals?.length === 100) return;
                    const newIntervals = duplicateNthElement(intervals!, index);
                    newIntervals[index + 1] = {
                        ...newIntervals[index + 1]!,
                        id: nanoid(),
                    };
                    intervals = newIntervals;
                }
            "
        />
        <Button
            :content="{ side: 'top', sideOffset: 13 }"
            icon="heroicons:arrow-small-up"
            variant="subtle"
            aria-label="Move interval up"
            :disabled="index === 0"
            @click="
                () => {
                    intervals = moveElement(intervals!, index, index - 1);
                }
            "
        />
        <Button
            :content="{ side: 'top', sideOffset: 13 }"
            icon="heroicons:arrow-small-down"
            variant="subtle"
            aria-label="Move interval down"
            :disabled="index === intervals!.length - 1"
            @click="
                () => {
                    intervals = moveElement(intervals!, index, index + 1);
                }
            "
        />
        <Button
            :content="{ side: 'top', sideOffset: 13 }"
            icon="heroicons:trash"
            color="error"
            variant="subtle"
            aria-label="Delete interval"
            :disabled="intervals!.length === 1"
            @click="
                () => {
                    if (intervals!.length === 1) return;
                    intervals = deleteNthElement(intervals!, index);
                }
            "
        />
    </div>
</template>
