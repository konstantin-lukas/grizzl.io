<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";

const emit = defineEmits(["close"]);
const route = useRoute();
const router = useRouter();
const open = ref(false);
const { queryKey, queryValue = null } = defineProps<{ queryKey: string; queryValue?: string }>();

watchEffect(() => {
    if (queryValue) {
        open.value = true;
        router.push(`${route.path}?${queryKey}=${queryValue}`);
    } else {
        open.value = false;
        router.push(route.path);
    }
});
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
                <div class="fixed top-4 left-4 size-10 hover-none:size-12">
                    <Button
                        icon="heroicons:arrow-uturn-left-16-solid"
                        variant="ghost"
                        color="neutral"
                        class="flex size-10 justify-center hover-none:size-12"
                        :aria-label="$t('ui.goBack')"
                        data-test-id="go-back-button"
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
