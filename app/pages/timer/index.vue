<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const open = ref(false);
const { data, refresh } = useFetch("/api/timers", { key: "/api/timers" });
watch(open, () => {
    if (!open.value) refresh();
});
const activeTimer = ref<Timer | null>(null);
</script>

<template>
    <LayoutWrapper :class="{ 'max-w-xl': true }">
        <div class="relative min-h-main-height-no-padding w-full">
            <Transition name="swipe">
                <TimerDisplay v-if="activeTimer" :timer="activeTimer" />
                <div v-else class="absolute w-full">
                    <OverlayDrawer v-model:open="open">
                        <TimerForm @success="open = false" />
                        <template #title>Create a new timer</template>
                        <template #description>
                            Choose between different types of timer intervals to create a fully customized timer
                        </template>
                    </OverlayDrawer>
                    <TimerList :timers="data" @create="open = true" @start="timer => (activeTimer = timer)" />
                    <Transition name="fade">
                        <DataEmpty
                            v-if="data && data.length === 0"
                            :title="$t('timer.noTimersTitle')"
                            class="absolute top-1/2 left-1/2 -translate-1/2"
                            @open="() => (open = true)"
                        />
                    </Transition>
                </div>
            </Transition>
        </div>
    </LayoutWrapper>
</template>
