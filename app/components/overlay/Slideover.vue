<script setup lang="ts">
const emit = defineEmits(["close"]);
</script>

<template>
    <UDrawer
        class="max-w-dvw"
        :dismissible="false"
        direction="right"
        :handle="false"
        :ui="{
            handle: '[&>span]:!w-dvw',
            content: 'rounded-none',
        }"
    >
        <template #content>
            <div class="relative m-0 h-dvh w-dvw overflow-auto">
                <div class="fixed top-4 left-4 size-10">
                    <Button
                        icon="heroicons:arrow-uturn-left-16-solid"
                        variant="ghost"
                        color="neutral"
                        class="size-10"
                        :aria-label="$t('ui.goBack')"
                        @click="emit('close')"
                    />
                </div>
                <slot />
            </div>
        </template>
        <template #title><slot name="title" /></template>
        <template #description><slot name="description" /></template>
    </UDrawer>
</template>
