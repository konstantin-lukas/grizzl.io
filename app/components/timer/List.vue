<script setup lang="ts">
import type { Timer } from "#shared/validators/timer";

const emit = defineEmits<{ (e: "create"): void; (e: "start", value: Timer): void }>();
const props = defineProps<{ timers: Timer[] | undefined }>();
</script>

<template>
    <ul class="relative">
        <TransitionGroup name="list">
            <TimerListItem
                v-for="(timer, index) in props.timers"
                :key="timer.id"
                :is-last="index === props.timers!.length - 1"
                :timer="timer"
                @create="emit('create')"
                @start="t => emit('start', t)"
            />
        </TransitionGroup>
    </ul>
</template>
