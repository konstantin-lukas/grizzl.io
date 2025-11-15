<script setup lang="ts">
import type { TimerType } from "#shared/schema/timer";

const props = defineProps<{ timers: (TimerType & { id: string })[] | undefined }>();
</script>

<template>
    <TransitionGroup name="list" tag="ul" class="relative">
        <ListTimerItem v-for="timer in props.timers" :key="timer.id" :timer="timer" />
    </TransitionGroup>
</template>

<style scoped></style>
