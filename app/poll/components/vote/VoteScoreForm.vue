<script setup lang="ts">
import type { Poll } from "~/poll/types";
import { SCORE_VOTE_MIN_POINTS, SCORE_VOTE_MAX_POINTS } from "#shared/poll/validators/vote.validator";

const model = defineModel<number[]>("selection", { required: true });
defineProps<{ poll: Poll }>();
const classNames = [
    "left-[1.25rem]!",
    "left-[11.1111%]!",
    "left-[22.2222%]!",
    "left-[33.3333%]!",
    "left-[44.4444%]!",
    "left-[55.5555%]!",
    "left-[66.6666%]!",
    "left-[77.7777%]!",
    "left-[88.8888%]!",
    "left-[calc(100%-1.25rem)]!",
];
</script>

<template>
    <div>
        <div v-for="(choice, index) in poll.choices" :key="index" class="relative mt-6 flex gap-4">
            <USlider
                :aria-label="choice"
                :model-value="model[index]"
                :min="SCORE_VOTE_MIN_POINTS"
                :max="SCORE_VOTE_MAX_POINTS"
                data-test-id="poll-voting-choice"
                :ui="{
                    track: 'h-10',
                    range: 'bg-front rounded-none',
                    thumb:
                        'size-10 bg-front ring-0 focus-visible:outline-primary focus-visible:outline-offset-0 focus-visible:outline-6 ' +
                        classNames[model[index]! - 1],
                }"
                @update:model-value="
                    value => {
                        if (value === undefined) return;
                        const copy = [...model];
                        copy[index] = value;
                        model = copy;
                    }
                "
            />
            <span
                data-hidden
                class="pointer-events-none absolute h-full w-[calc(100%-3.5rem)] overflow-hidden rounded-full px-16 pt-1.5 text-lg text-nowrap text-ellipsis text-white mix-blend-difference"
            >
                {{ choice }}
            </span>
            <div class="center size-10 shrink-0 rounded-full bg-accented text-xl">{{ model[index] }}</div>
        </div>
    </div>
</template>
