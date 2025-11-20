<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const emit = defineEmits(["create"]);
const props = defineProps<{ timers: Timer[] | undefined }>();
</script>

<template>
    <ul class="relative">
        <TransitionGroup name="list">
            <ListTimerItem
                v-for="[index, timer] in props.timers?.entries()"
                :key="timer.id"
                :is-last="index === props.timers!.length - 1"
                :timer="timer"
                @create="emit('create')"
            />
        </TransitionGroup>
    </ul>
</template>

<style scoped></style>
