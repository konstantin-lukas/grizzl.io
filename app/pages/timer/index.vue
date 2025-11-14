<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => {
    if (!open.value) refresh();
});
</script>

<template>
    <LayoutWrapper>
        <div class="m-auto max-w-xl">
            <OverlayDrawer v-model:open="open">
                <FormTimerCreate @success="open = false" />
                <template #title>Create a new timer</template>
                <template #description>
                    Choose between different types of timer intervals to create a fully customized timer
                </template>
            </OverlayDrawer>
            <ListTimer :timers="data" @delete="refresh" />
            <div class="center h-main-height-no-padding">
                <Transition name="fade">
                    <DataEmpty
                        v-if="data?.length === 0"
                        :title="$t('timer.noTimersTitle')"
                        :description="$t('timer.noTimersDescription')"
                        @open="() => (open = true)"
                    />
                </Transition>
            </div>
        </div>
    </LayoutWrapper>
</template>
