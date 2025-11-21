<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const { timer } = defineProps<{ timer: Timer }>();
const [activeInterval] = timer.intervals;
</script>

<template>
    <section aria-labelledby="timer-name" class="w-full">
        <TypoH1 id="timer-name">{{ timer.title }}</TypoH1>
        <TimerProgress :duration="activeInterval!.duration" />
    </section>
</template>
