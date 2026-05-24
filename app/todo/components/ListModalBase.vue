<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import { ICON_CANCEL } from "~/core/constants/icons.constant";

const emit = defineEmits(["close"]);
const route = useRoute();
const router = useRouter();
const props = defineProps<{ queryKey: string; queryValue?: string }>();
const open = ref(!!props.queryValue);

watch(
    () => [props.queryKey, props.queryValue, route.path],
    () => {
        if (props.queryValue) {
            open.value = true;
            router.push(`${route.path}?${props.queryKey}=${props.queryValue}`);
        } else {
            open.value = false;
            router.push(route.path);
        }
    },
    { immediate: true },
);
</script>

<template>
    <UModal
        :open
        :default-open="open"
        :dismissible="true"
        @update:open="
            v => {
                if (!v) emit('close');
            }
        "
    >
        <template #content>
            <div class="relative h-[calc(100dvh-4rem)]" data-test-id="modal">
                <div
                    class="absolute top-0 left-0 z-1 h-14 w-full border-b border-b-muted bg-back px-4 py-2 hover-none:h-16"
                >
                    <slot name="header" />
                    <Button
                        :icon="ICON_CANCEL"
                        variant="ghost"
                        color="neutral"
                        class="absolute top-2 right-4 flex size-10 justify-center hover-none:size-12"
                        :aria-label="$t('ui.close')"
                        data-test-id="go-back-button"
                        @click="
                            () => {
                                emit('close');
                            }
                        "
                    />
                </div>
                <div class="mt-14 h-[calc(100%-3.5rem)] overflow-y-auto">
                    <slot />
                </div>
            </div>
        </template>
        <template #title><slot name="title" /></template>
        <template #description><slot name="description" /></template>
    </UModal>
</template>
