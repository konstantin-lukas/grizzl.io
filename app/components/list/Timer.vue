<script setup lang="ts">
import type { TimerType } from "#shared/schema/timer";

const emit = defineEmits(["delete"]);
const props = defineProps<{ timers: (TimerType & { id: string })[] | undefined }>();
const confirmDeleteTimer = ref<{ id: string; title: string } | undefined>(undefined);
</script>

<template>
    <TransitionGroup name="list" tag="ul" class="relative">
        <ListTimerItem
            v-for="timer in props.timers"
            :key="timer.id"
            :timer="timer"
            @delete="confirmDeleteTimer = timer"
        />
    </TransitionGroup>
    <FormTimerDelete
        :timer="confirmDeleteTimer"
        @success="
            () => {
                emit('delete');
                confirmDeleteTimer = undefined;
            }
        "
        @cancel="confirmDeleteTimer = undefined"
    />
</template>

<style scoped></style>
