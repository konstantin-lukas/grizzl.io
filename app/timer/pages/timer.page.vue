<script setup lang="ts">
import type { Timer } from "#shared/timer/validators/timer.validator";
import { useToast } from "#ui/composables";
import Empty from "~/core/components/data/Empty.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import Slideover from "~/core/components/overlay/Slideover.vue";
import OverviewList from "~/timer/components/overview/OverviewList.vue";
import PlaybackContainer from "~/timer/components/playback/PlaybackContainer.vue";
import UpsertForm from "~/timer/components/upsert-form/UpsertForm.vue";
import useTimer from "~/timer/composables/useTimer";

const open = ref(false);
const route = useRoute();
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

watchEffect(() => {
    const timerId = route.query.play;
    activeTimer.value = data.value?.find(timer => timer.id === timerId) ?? null;
});

watch(open, () => {
    if (!open.value) refresh();
});
</script>

<template>
    <Wrapper :class="{ 'max-w-xl': true }">
        <div class="flex min-h-main-height-no-padding w-full flex-col">
            <Slideover
                query-key="play"
                :query-value="activeTimer?.id"
                @close="
                    () => {
                        reset(true);
                        activeTimer = null;
                        mute = false;
                    }
                "
            >
                <template #title>{{ $t("timer.aria.slideover.title") }}</template>
                <Wrapper center-vertically>
                    <PlaybackContainer v-if="activeTimer" :timer="activeTimer" />
                </Wrapper>
            </Slideover>
            <div class="relative mb-16 flex w-full grow flex-col">
                <Drawer v-model:open="open">
                    <UpsertForm @success="open = false" />
                    <template #title>{{ $t("timer.aria.drawer.create") }}</template>
                    <template #description>{{ $t("timer.aria.drawer.description") }}</template>
                </Drawer>
                <OverviewList :timers="data" @create="open = true" @start="timer => (activeTimer = timer)" />
                <Transition name="fade">
                    <div v-if="data && data.length === 0" class="center absolute h-full w-full grow">
                        <Empty @open="() => (open = true)" />
                    </div>
                </Transition>
            </div>
        </div>
    </Wrapper>
</template>
