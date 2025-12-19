<script setup lang="ts">
const emit = defineEmits(["open"]);
</script>

<template>
    <UEmpty
        variant="naked"
        icon="heroicons:inbox"
        :actions="[
            {
                icon: 'heroicons:plus-small',
                label: $t('ui.create'),
                onClick: () => {
                    emit('open');
                },
            },
        ]"
    >
        <template #title>
            <span data-test-id="data-empty-title">{{ $t("ui.noEntries") }}</span>
        </template>
    </UEmpty>
</template>
