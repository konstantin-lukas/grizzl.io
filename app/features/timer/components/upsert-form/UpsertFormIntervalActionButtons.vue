<script setup lang="ts">
import type { PutTimer } from "#shared/features/timer/validators/timer.validator";
import { LIST_MAX, LIST_MIN } from "#shared/validators/core.validator";
import { nanoid } from "nanoid";

const intervals = defineModel<PutTimer["intervals"]>("intervals");
const { index } = defineProps<{ index: number }>();
</script>

<template>
    <div
        class="invisible absolute left-0 mt-4 flex w-full items-center justify-center gap-4 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 sm:top-0 sm:left-full sm:-mt-3 sm:ml-4 sm:w-auto sm:flex-col"
    >
        <Button
            :content="{ side: 'top', sideOffset: 13 }"
            icon="heroicons:document-duplicate"
            variant="subtle"
            :aria-label="$t('ui.duplicate')"
            data-test-id="interval-duplicate-button"
            :disabled="intervals?.length === LIST_MAX"
            @click="
                () => {
                    if (intervals?.length === LIST_MAX) return;
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
            :aria-label="$t('ui.moveUp')"
            data-test-id="interval-move-up-button"
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
            data-test-id="interval-move-down-button"
            :aria-label="$t('ui.moveDown')"
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
            data-test-id="interval-delete-button"
            :aria-label="$t('ui.delete')"
            :disabled="intervals!.length === LIST_MIN"
            @click="
                () => {
                    if (intervals!.length === LIST_MIN) return;
                    intervals = deleteNthElement(intervals!, index);
                }
            "
        />
    </div>
</template>
