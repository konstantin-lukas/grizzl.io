<script setup lang="ts">
const open = ref(false);
</script>

<template>
    <LayoutWrapper class="flex flex-col items-center justify-center">
        <UEmpty
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
        <UDrawer v-model:open="open" class="max-h-dvh">
            <template #content>
                <FormCreateTimer @close="() => (open = false)" />
            </template>
            <template #title>Create a new timer</template>
            <template #description>
                Choose between different types of timer intervals to create a fully customized timer
            </template>
        </UDrawer>
    </LayoutWrapper>
</template>
