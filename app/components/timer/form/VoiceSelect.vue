<script setup lang="ts">
const ttsVoice = defineModel<string | null>("ttsVoice");

const ttsVoices = useVoices();
const speak = useSpeakUtterance();

const utteranceText = ref("");
const voiceOptions = computed(() => [
    [{ label: $t("timer.form.ttsDisable"), value: null }],
    ttsVoices.value.map(v => ({ label: v.name, value: v.voiceURI })),
]);
</script>

<template>
    <UFormField v-if="ttsVoices.length > 0" :label="$t('timer.form.ttsVoice')" name="ttsVoice" class="w-full">
        <USelect v-model="ttsVoice!" :items="voiceOptions" class="w-full">
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
        </USelect>
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
