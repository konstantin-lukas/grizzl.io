<script setup lang="ts">
import useVoiceDigest from "~/features/timer/composables/useVoiceDigest";

const userTtsVoices = defineModel<string[]>("ttsVoices");

const ttsVoices = useVoices();
const speak = useSpeakUtterance();
const displayWarning = ref(false);
const selectedVoice = ref<string | null>(null);
const id = useId();
const alertId = computed(() => (displayWarning.value ? `${id}-alert` : null));

const utteranceText = ref("");
const tooltipOpen = ref(false);
const voiceDigest = useVoiceDigest();

watchEffect(() => {
    if (!userTtsVoices.value || !voiceDigest.value) return;
    const savedVoice = userTtsVoices.value.find(v => v.slice(0, voiceDigest.value.length) === voiceDigest.value);
    if (!savedVoice) return;
    selectedVoice.value = savedVoice.slice(voiceDigest.value.length);
});

watchEffect(() => {
    if (!userTtsVoices.value || !voiceDigest.value) return;

    const valueWithDigest = voiceDigest.value + selectedVoice.value;
    const voiceIndex = userTtsVoices.value.findIndex(v => v.slice(0, voiceDigest.value.length) === voiceDigest.value);
    const hasSavedVoice = voiceIndex !== -1;
    const hasSelectedVoice = selectedVoice.value !== null;

    if (hasSavedVoice && hasSelectedVoice) {
        userTtsVoices.value[voiceIndex] = valueWithDigest;
    } else if (hasSavedVoice && !hasSelectedVoice) {
        userTtsVoices.value = deleteNthElement(userTtsVoices.value, voiceIndex);
    } else if (!hasSavedVoice && hasSelectedVoice) {
        userTtsVoices.value.push(valueWithDigest);
    }
});

const voiceOptions = computed(() => [
    [{ label: $t("timer.form.ttsDisable"), value: null }],
    ttsVoices.value.map(v => ({ label: v.name, value: v.voiceURI })),
]);

const handleChange = (value: string | null) => {
    selectedVoice.value = value;
};
</script>

<template>
    <UFormField v-if="voiceOptions[1]?.length !== 0" name="ttsVoice" class="w-full" :v-bind="null">
        <USelect
            :items="voiceOptions"
            :model-value="selectedVoice"
            class="w-full"
            :aria-describedby="alertId"
            @update:model-value="handleChange"
        />
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
        <div v-if="voiceOptions[1]?.length !== 0 && selectedVoice !== null" class="flex w-full gap-4">
            <Button
                icon="heroicons:speaker-wave"
                :aria-label="$t('ui.play')"
                :content="{ side: 'left' }"
                @click="
                    () => {
                        if (selectedVoice) speak(utteranceText, selectedVoice);
                    }
                "
            />
            <UInput v-model="utteranceText" class="w-full" :placeholder="$t('timer.form.ttsPreview')" />
        </div>
    </Transition>
</template>
