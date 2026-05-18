<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import { ICON_CANCEL } from "~/core/constants/icons.constant";

const { t } = useI18n();
const emit = defineEmits(["close"]);
const route = useRoute();
const router = useRouter();
const props = defineProps<{ queryKey: string; queryValue?: string; unsavedChanges?: string }>();
const open = ref(!!props.queryValue);

const confirmClose = (key: string) => {
    return window.confirm(t(key));
};

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
        :scrollable="true"
        :dismissible="true"
        @update:open="
            v => {
                if (props.unsavedChanges && !confirmClose(props.unsavedChanges)) return;
                if (!v) emit('close');
            }
        "
    >
        <template #content>
            <div class="min-h-[calc(100dvh-4rem)]" data-test-id="modal">
                <div class="absolute top-4 right-4 size-10 hover-none:size-12">
                    <Button
                        :icon="ICON_CANCEL"
                        variant="ghost"
                        color="neutral"
                        class="flex size-10 justify-center hover-none:size-12"
                        :aria-label="$t('ui.close')"
                        data-test-id="go-back-button"
                        @click="
                            () => {
                                if (props.unsavedChanges && !confirmClose(props.unsavedChanges)) return;
                                emit('close');
                            }
                        "
                    />
                </div>
                <slot />
            </div>
        </template>
        <template #title><slot name="title" /></template>
        <template #description><slot name="description" /></template>
    </UModal>
</template>
