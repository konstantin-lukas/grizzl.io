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
        <FormCreateTimer v-model:open="open" @success="open = false" />
    </LayoutWrapper>
</template>
