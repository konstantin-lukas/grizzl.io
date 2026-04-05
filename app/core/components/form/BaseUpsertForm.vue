<script setup lang="ts" generic="T">
import type { FormErrorEvent, FormSubmitEvent } from "#ui/types";
import Button from "~/core/components/button/Button.vue";
import FormErrorDigest from "~/core/components/form/FormErrorDigest.vue";
import { ICON_PLUS_CIRCLE, ICON_SAVE } from "~/core/constants/icons.constant";

const scrollContainer = useTemplateRef<HTMLDivElement>("scrollContainer");
const { isLoading } = useLoadingIndicator();

defineProps<{ mode: "insert" | "update" }>();
defineExpose({
    scrollContainer,
});
const emit = defineEmits<{
    error: [e: FormErrorEvent];
    submit: [e: FormSubmitEvent<T>];
}>();

const errors = ref<string[]>([]);

const onError = (e: FormErrorEvent) => {
    errors.value = e.errors.map(error => error.message).filter((error, index, array) => array.indexOf(error) === index);
    emit("error", e);
};
</script>

<template>
    <UForm @error="onError" @submit="e => emit('submit', e)">
        <div ref="scrollContainer" class="relative h-[calc(100dvh-7rem+2px)] overflow-auto">
            <span
                class="pointer-events-none fixed top-9 left-1/2 z-10 mt-[2px] h-8 w-[calc(100%-2rem)] -translate-x-1/2 bg-linear-to-b from-back"
            />
            <span
                class="pointer-events-none fixed bottom-18 left-1/2 z-10 h-8 w-[calc(100%-2rem)] -translate-x-1/2 bg-linear-to-t from-back"
            />
            <div class="flex min-h-full flex-col items-center justify-start overflow-hidden">
                <div class="center w-full max-w-120 gap-4 px-8 pt-8 pb-12 xl:w-120">
                    <slot name="heading" />
                    <FormErrorDigest :errors />
                    <slot :errors="errors" />
                </div>
            </div>
        </div>
        <div class="flex h-18 w-full justify-center gap-4 border-t border-t-accented py-4">
            <div class="flex w-120 justify-center gap-4 px-8">
                <slot name="before-submit" />
                <Button
                    size="xl"
                    type="submit"
                    :icon="mode === 'insert' ? ICON_PLUS_CIRCLE : ICON_SAVE"
                    class="flex w-full justify-center"
                    data-test-id="upsert-form-submit-button"
                    :disabled="isLoading"
                >
                    {{ mode === "insert" ? $t("ui.create") : $t("ui.save") }}
                </Button>
                <slot name="after-submit" />
            </div>
        </div>
    </UForm>
</template>
