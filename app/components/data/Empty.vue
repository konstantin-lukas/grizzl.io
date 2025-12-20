<script setup lang="ts">
const emit = defineEmits(["open"]);
</script>

<template>
    <UEmpty variant="naked" icon="heroicons:inbox">
        <template #body>
            <h1 data-test-id="data-empty-title" class="-mt-2 mb-2 text-center text-base font-medium text-highlighted">
                {{ $t("ui.noEntries") }}
            </h1>
            <Button icon="heroicons:plus-small" @click="emit('open')">{{ $t("ui.create") }}</Button>
        </template>
    </UEmpty>
</template>
