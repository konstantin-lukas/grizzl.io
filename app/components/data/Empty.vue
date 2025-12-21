<script setup lang="ts">
const emit = defineEmits(["open"]);
const { titleAs = "h1" } = defineProps<{ titleAs?: string }>();
</script>

<template>
    <UEmpty variant="naked" icon="heroicons:inbox">
        <template #body>
            <component
                :is="titleAs"
                data-test-id="data-empty-title"
                class="-mt-2 mb-2 text-center text-base font-medium text-highlighted"
            >
                {{ $t("ui.noEntries") }}
            </component>
            <Button icon="heroicons:plus-small" @click="emit('open')">{{ $t("ui.create") }}</Button>
        </template>
    </UEmpty>
</template>
