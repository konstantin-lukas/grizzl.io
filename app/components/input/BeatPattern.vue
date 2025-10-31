<script setup lang="ts">
import { Beat, BeatSymbol } from "#shared/enum/timer";

const { emitFormChange, color } = useFormField();
const { beats, barLength } = defineProps<{ beats: Beat[]; barLength: number }>();
const emit = defineEmits(["update:beats"]);
const playSound = ref(false);
const currentBeat = ref(0);
const startTime = ref(Date.now());

watch(
    () => [beats, barLength, playSound],
    () => {
        if (beats.length === 0) playSound.value = false;
    },
);

watch(
    () => [beats, barLength],
    () => {
        currentBeat.value = 0;
        startTime.value = Date.now();
    },
);

watch(playSound, () => {
    if (!playSound.value) return;
    startTime.value = Date.now() - currentBeat.value * ((barLength * 1000) / beats.length);
    const animateBeats = () => {
        if (!playSound.value) return;
        const barLengthInMs = barLength * 1000;
        const moduloTime = (Date.now() - startTime.value) % barLengthInMs;
        const beatLength = barLengthInMs / beats.length;
        currentBeat.value = Math.floor(moduloTime / beatLength);
        requestAnimationFrame(animateBeats);
        console.log(currentBeat.value);
    };
    animateBeats();
});
</script>

<template>
    <div
        class="flex flex-col gap-2 rounded-md border border-border-accented p-2"
        :class="{ 'border-error': color === 'error' }"
    >
        <div class="flex justify-between">
            <div>
                <UTooltip :text="playSound ? 'Pause Playback' : 'Start Playback'">
                    <UButton
                        :icon="playSound ? 'heroicons:pause-solid' : 'heroicons:play-solid'"
                        :aria-label="playSound ? 'Pause Playback' : 'Start Playback'"
                        variant="ghost"
                        :disabled="beats.length === 0"
                        @click="
                            () => {
                                playSound = !playSound;
                            }
                        "
                    />
                </UTooltip>
            </div>
            <div>
                <UTooltip text="Add Beat">
                    <UButton
                        icon="mdi:music-note-quarter"
                        aria-label="Add Beat"
                        variant="ghost"
                        :disabled="beats.length === 16"
                        @click="
                            () => {
                                if (beats.length === 16) return;
                                emit('update:beats', [...beats, Beat.NORMAL]);
                                emitFormChange();
                            }
                        "
                    />
                </UTooltip>
                <UTooltip text="Add Accented Beat">
                    <UButton
                        icon="mdi:exclamation-thick"
                        variant="ghost"
                        :disabled="beats.length === 16"
                        @click="
                            () => {
                                if (beats.length === 16) return;
                                emit('update:beats', [...beats, Beat.ACCENTED]);
                                emitFormChange();
                            }
                        "
                    />
                </UTooltip>
                <UTooltip text="Add Pause">
                    <UButton
                        icon="mdi:music-rest-quarter"
                        variant="ghost"
                        :disabled="beats.length === 16"
                        aria-label="Add Pause"
                        @click="
                            () => {
                                if (beats.length === 16) return;
                                emit('update:beats', [...beats, Beat.PAUSE]);
                                emitFormChange();
                            }
                        "
                    />
                </UTooltip>
                <UTooltip text="Delete Beat">
                    <UButton
                        variant="ghost"
                        icon="mdi:music-note-off"
                        color="error"
                        aria-label="Delete"
                        @click="
                            () => {
                                if (beats.length > 0) {
                                    emit('update:beats', beats.slice(0, -1));
                                    emitFormChange();
                                }
                            }
                        "
                    />
                </UTooltip>
            </div>
        </div>
        <USeparator v-if="beats.length > 0" />
        <div v-if="beats.length > 0" class="min-h-9.5">
            <UIcon
                v-for="[index, beat] in beats.entries()"
                :key="index"
                class="size-8"
                :class="{ 'bg-primary': index === currentBeat }"
                :name="BeatSymbol[beat]"
            />
        </div>
    </div>
</template>

<style scoped></style>
