<script setup lang="ts">
const utteranceText = ref("");
const speak = useSpeakUtterance();
const ttsVoice = defineModel<string>("ttsVoice");
const ttsVoices = useVoices();
const voiceOptions = computed(() => [
    [{ label: "Don't read interval titles aloud", value: undefined }],
    ttsVoices.value.map(v => ({ label: v.name, value: v.voiceURI })),
]);
</script>

<template>
    <UFormField
        v-if="ttsVoices.length > 0"
        label="Text-to-speech voice for interval titles"
        name="ttsVoice"
        class="w-full"
    >
        <USelect
            v-model="ttsVoice!"
            :items="voiceOptions"
            class="w-full"
            placeholder="Don't read interval titles aloud"
        >
            <template #trailing>
                <UTooltip
                    text="Not all voices are available on all devices"
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
        </USelect>
    </UFormField>
    <Transition name="fade">
        <div v-if="ttsVoices.length > 0 && ttsVoice !== undefined" class="flex w-full gap-4">
            <Button
                icon="heroicons:speaker-wave"
                @click="
                    () => {
                        if (ttsVoice) speak(utteranceText, ttsVoice);
                    }
                "
            />
            <UInput
                v-model="utteranceText"
                class="w-full"
                placeholder="Enter some text to preview the selected voice"
            />
        </div>
    </Transition>
</template>
