<script setup lang="ts">
const emit = defineEmits(["open"]);
</script>

<template>
    <UEmpty
        variant="naked"
        :title="$t('ui.noEntries')"
        icon="heroicons:inbox"
        :actions="[
            {
                icon: 'heroicons:plus-small',
                label: $t('ui.create'),
                size: 'xl',
                onClick: () => {
                    emit('open');
                },
            },
        ]"
    />
</template>
