<script setup lang="ts">
const ttsVoice = defineModel<string | null>("ttsVoice");

const ttsVoices = useVoices();
const speak = useSpeakUtterance();
const displayWarning = ref(false);
const id = useId();
const alertId = computed(() => (displayWarning.value ? `${id}-alert` : null));
const tooltipOpen = ref(false);

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
    <UFormField v-if="ttsVoices.length > 0" name="ttsVoice" class="w-full">
        <USelect v-model="ttsVoice!" :items="voiceOptions" class="w-full" :aria-describedby="alertId" />
        <template #label>
            <span class="allow-tooltip flex items-center">
                {{ $t("timer.form.ttsVoice") }}
                <UTooltip
                    :text="$t('timer.form.ttsInfo')"
                    :delay-duration="0"
                    class="ml-1"
                    :open="tooltipOpen"
                    :content="{ side: 'top' }"
                    @update:open="o => (tooltipOpen = o)"
                >
                    <UIcon
                        name="mdi:information-outline"
                        tabindex="0"
                        class="size-5 opacity-50 transition-all hover:text-front hover:opacity-100 focus:text-front focus:opacity-100"
                        @touchstart="tooltipOpen = true"
                    />
                </UTooltip>
            </span>
        </template>
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
                @click="
                    () => {
                        if (ttsVoice) speak(utteranceText, ttsVoice);
                    }
                "
            />
            <UInput v-model="utteranceText" class="w-full" :placeholder="$t('timer.form.ttsPreview')" />
        </div>
    </Transition>
</template>
