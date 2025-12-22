<script setup lang="ts">
const ttsVoice = defineModel<string | null>("ttsVoice");

const ttsVoices = useVoices();
const speak = useSpeakUtterance();
const displayWarning = ref(false);
const id = useId();
const alertId = computed(() => (displayWarning.value ? `${id}-alert` : null));

watchEffect(() => {
    if (ttsVoices.value.length === 0) return;
    const isVoiceInvalid =
        typeof ttsVoice.value === "string" && ttsVoices.value.every(({ voiceURI }) => voiceURI !== ttsVoice.value);

    if (isVoiceInvalid) {
        ttsVoice.value = null;
        displayWarning.value = true;
    } else if (ttsVoice.value) {
        displayWarning.value = isVoiceInvalid;
    }
});

const utteranceText = ref("");
const voiceOptions = computed(() => [
    [{ label: $t("timer.form.ttsDisable"), value: null }],
    ttsVoices.value.map(v => ({ label: v.name, value: v.voiceURI })),
]);
</script>

<template>
    <UFormField v-if="ttsVoices.length > 0" :label="$t('timer.form.ttsVoice')" name="ttsVoice" class="w-full">
        <USelect
            v-model="ttsVoice!"
            :items="voiceOptions"
            class="w-full"
            :aria-describedby="alertId"
            data-test-id="timer-upsert-voice-select"
        >
            <template #trailing>
                <UTooltip
                    :text="$t('timer.form.ttsInfo')"
                    :delay-duration="0"
                    :content="{ side: 'right', align: 'center', sideOffset: 20 }"
                >
                    <UIcon
                        name="mdi:information-outline"
                        tabindex="0"
                        class="size-5 opacity-50 transition-all hover:text-front hover:opacity-100 focus:text-front focus:opacity-100"
                    />
                </UTooltip>
            </template>
            <template #item="{ item }">
                <span data-test-id="timer-upsert-voice-select-option">{{ item.label }}</span>
            </template>
        </USelect>
        <Transition name="fade">
            <UAlert
                v-if="displayWarning"
                :id="alertId"
                color="warning"
                class="mt-4"
                variant="subtle"
                role="alert"
                :title="$t('timer.ttsUnavailableTitle')"
                :description="$t('timer.ttsUnavailableDescription')"
                icon="heroicons:exclamation-triangle"
            />
        </Transition>
    </UFormField>
    <Transition name="fade">
        <div v-if="ttsVoices.length > 0 && ttsVoice !== null" class="flex w-full gap-4">
            <Button
                icon="heroicons:speaker-wave"
                :aria-label="$t('ui.play')"
                :content="{ side: 'left' }"
                data-test-id="timer-upsert-voice-preview-button"
                @click="
                    () => {
                        if (ttsVoice) speak(utteranceText, ttsVoice);
                    }
                "
            />
            <UInput
                v-model="utteranceText"
                class="w-full"
                :placeholder="$t('timer.form.ttsPreview')"
                data-test-id="timer-upsert-voice-preview-input"
            />
        </div>
    </Transition>
</template>
