<script setup lang="ts">
import type { Poll } from "~/poll/types";

const props = defineProps<{ poll: Poll }>();
const winners = computed(() => props.poll.winners.map(winner => props.poll.choices[winner]));
</script>

<template>
    <div class="w-full rounded-lg border border-accented sm:py-6">
        <div class="flex not-sm:flex-col">
            <div class="w-full items-center px-8 not-sm:py-4 sm:flex sm:flex-col sm:justify-center">
                <b>{{ $t("poll.voters") }}: </b>
                <span>{{ poll.turnout }}</span>
            </div>
            <div
                class="w-full items-center border-accented px-8 not-sm:border-y not-sm:py-4 sm:flex sm:flex-col sm:justify-center sm:border-x"
            >
                <b>{{ $t(winners.length > 1 ? "poll.winners" : "poll.winner") }}: </b>
                <span>{{ winners.length === 0 ? "-" : winners.join(", ") }}</span>
            </div>
            <div class="w-full items-center px-8 not-sm:py-4 sm:flex sm:flex-col sm:justify-center">
                <b>{{ $t("poll.choices") }}: </b>
                <span>{{ poll.choices.length }}</span>
            </div>
        </div>
    </div>
</template>
