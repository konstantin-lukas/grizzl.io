<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => {
    if (!open.value) refresh();
});
</script>

<template>
    <LayoutWrapper :class="{ center: data?.length === 0 }">
        <div class="m-auto max-w-xl">
            <DataEmpty
                v-if="data?.length === 0"
                :title="$t('timer.noTimersTitle')"
                :description="$t('timer.noTimersDescription')"
                @open="() => (open = true)"
            />
            <OverlayDrawer v-model:open="open">
                <FormTimerCreate @success="open = false" />
                <template #title>Create a new timer</template>
                <template #description>
                    Choose between different types of timer intervals to create a fully customized timer
                </template>
            </OverlayDrawer>
            <ListTimer :timers="data" @delete="refresh" />
        </div>
    </LayoutWrapper>
</template>
