<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => refresh());
</script>

<template>
    <LayoutWrapper class="flex flex-col items-center justify-center">
        <UEmpty
            v-if="data?.length === 0"
            :title="$t('timer.noTimersTitle')"
            :description="$t('timer.noTimersDescription')"
            variant="naked"
            icon="heroicons:inbox"
            :actions="[
                {
                    icon: 'heroicons:plus-small',
                    label: $t('ui.create'),
                    size: 'xl',
                    onClick: () => {
                        open = true;
                    },
                },
            ]"
        />
        <FormCreateTimer v-model:open="open" @success="open = false" />
        <div v-for="timer in data" :key="timer.id">
            {{ timer.title }}
        </div>
    </LayoutWrapper>
</template>
