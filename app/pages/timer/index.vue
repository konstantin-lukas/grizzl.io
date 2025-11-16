<script setup lang="ts">
const open = ref(false);
const { data, refresh } = await useFetch("/api/timers", { key: "/api/timers" });
watch(open, () => {
    if (!open.value) refresh();
});
</script>

<template>
    <LayoutWrapper class="max-w-xl">
        <OverlayDrawer v-model:open="open">
            <FormTimerCreate @success="open = false" />
            <template #title>Create a new timer</template>
            <template #description>
                Choose between different types of timer intervals to create a fully customized timer
            </template>
        </OverlayDrawer>
        <ListTimer :timers="data" />
        <Transition name="fade">
            <DataEmpty
                v-if="data && data.length === 0"
                :title="$t('timer.noTimersTitle')"
                class="absolute top-1/2 left-1/2 -translate-1/2"
                @open="() => (open = true)"
            />
        </Transition>
    </LayoutWrapper>
</template>
