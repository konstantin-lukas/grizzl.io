<script setup lang="ts">
const emit = defineEmits(["close"]);
const route = useRoute();
const { open, queryKey = undefined } = defineProps<{ open: boolean; queryKey?: string }>();

watch(
    () => open,
    newOpen => {
        if (!queryKey) return;
        if (newOpen) window.history.pushState(null, "", `${route.path}?${queryKey}`);
    },
);
watch(
    () => route.query,
    newQuery => {
        if (!queryKey) return;
        const value = newQuery[queryKey];
        if (value === undefined) emit("close");
    },
);

function onClick() {
    window.history.pushState(null, "", route.path);
    emit("close");
}
</script>

<template>
    <UDrawer
        :open
        class="max-w-dvw"
        :dismissible="false"
        direction="right"
        :handle="false"
        :ui="{
            content: 'rounded-none',
        }"
    >
        <template #content>
            <div class="relative m-0 h-dvh w-dvw overflow-auto" data-test-id="slideover">
                <div class="fixed top-4 left-4 size-10">
                    <Button
                        icon="heroicons:arrow-uturn-left-16-solid"
                        variant="ghost"
                        color="neutral"
                        class="size-10"
                        :aria-label="$t('ui.goBack')"
                        data-test-id="go-back-button"
                        @click="onClick"
                    />
                </div>
                <slot />
            </div>
        </template>
        <template #title><slot name="title" /></template>
        <template #description><slot name="description" /></template>
    </UDrawer>
</template>
