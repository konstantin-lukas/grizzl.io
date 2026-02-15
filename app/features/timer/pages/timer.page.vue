<script setup lang="ts">
import type { Timer } from "#shared/features/timer/validators/timer.validator";
import OverviewList from "~/features/timer/components/overview/OverviewList.vue";
import PlaybackContainer from "~/features/timer/components/playback/PlaybackContainer.vue";
import UpsertForm from "~/features/timer/components/upsert-form/UpsertForm.vue";

const open = ref(false);
const toast = useToast();
const { data, refresh } = useFetch("/api/timers", {
    key: "/api/timers",
    onResponseError: () =>
        toast.add({
            title: $t("timer.toast.unableToFetchTitle"),
            description: $t("timer.toast.unableToFetchDescription"),
            color: "error",
        }),
});
const { reset, mute } = useTimer();

const activeTimer = ref<Timer | null>(null);

watch(open, () => {
    if (!open.value) refresh();
});
</script>

<template>
    <LayoutWrapper :class="{ 'max-w-xl': true }">
        <div class="flex min-h-main-height-no-padding w-full flex-col">
            <OverlaySlideover
                query-key="play"
                :open="!!activeTimer"
                @close="
                    () => {
                        reset(true);
                        activeTimer = null;
                        mute = false;
                    }
                "
            >
                <template #title>{{ $t("timer.aria.slideover.title") }}</template>
                <LayoutWrapper center-vertically>
                    <PlaybackContainer v-if="activeTimer" :timer="activeTimer" />
                </LayoutWrapper>
            </OverlaySlideover>
            <div class="mb-16 flex w-full grow flex-col">
                <OverlayDrawer v-model:open="open">
                    <UpsertForm @success="open = false" />
                    <template #title>{{ $t("timer.aria.drawer.create") }}</template>
                    <template #description>{{ $t("timer.aria.drawer.description") }}</template>
                </OverlayDrawer>
                <OverviewList :timers="data" @create="open = true" @start="timer => (activeTimer = timer)" />
                <Transition name="fade">
                    <div v-if="data && data.length === 0" class="center w-full grow">
                        <DataEmpty @open="() => (open = true)" />
                    </div>
                </Transition>
            </div>
        </div>
    </LayoutWrapper>
</template>
