<script setup lang="ts">
import { BEAT_PATTERN_MAX } from "#shared/constants/data";
import { Beat, BeatSymbol } from "#shared/enum/timer";
import accentedAudio from "~/assets/sound/accented_beat.wav";
import beatAudio from "~/assets/sound/beat.wav";

const { beats, barLength } = defineProps<{ beats: Beat[]; barLength: number }>();
const emit = defineEmits(["update:beats"]);

const currentBeat = ref(0);
const startTime = ref(Date.now());
const commonButtonProps = computed(
    () =>
        ({
            content: { sideOffset: 9 },
            variant: "ghost",
            disabled: beats.length === BEAT_PATTERN_MAX,
        }) as const,
);

const playingComponentId = useState("beat-pattern-input-playing", () => "");
const componentId = useId();
const { emitFormChange, color } = useFormField();

watch(
    () => [beats, playingComponentId],
    () => {
        if (beats.length <= 1 && playingComponentId.value === componentId) playingComponentId.value = "";
    },
);

watch(
    () => [beats, barLength],
    () => {
        currentBeat.value = 0;
        startTime.value = Date.now();
    },
);

watch(playingComponentId, () => {
    if (playingComponentId.value !== componentId) return;
    startTime.value = Date.now() - currentBeat.value * ((barLength * 1000) / beats.length);
    const animateBeats = () => {
        if (playingComponentId.value !== componentId) return;
        const barLengthInMs = barLength * 1000;
        const moduloTime = (Date.now() - startTime.value) % barLengthInMs;
        const beatLength = barLengthInMs / beats.length;
        const nextBeat = Math.floor(moduloTime / beatLength);
        if (nextBeat !== currentBeat.value) {
            if (beats[nextBeat] !== Beat.PAUSE) {
                const beat = new Audio(beats[nextBeat] === Beat.ACCENTED ? accentedAudio : beatAudio);
                beat.play();
            }
            currentBeat.value = nextBeat;
        }
        requestAnimationFrame(animateBeats);
    };
    animateBeats();
});

onBeforeUnmount(() => {
    if (playingComponentId.value === componentId) playingComponentId.value = "";
});

function addBeat(beat: Beat) {
    if (beats.length === BEAT_PATTERN_MAX) return;
    emit("update:beats", [...beats, beat]);
    emitFormChange();
}
</script>

<template>
    <div
        class="flex flex-col gap-2 rounded-md border border-border-accented p-2"
        :class="{ 'border-error': color === 'error' }"
    >
        <div class="flex justify-between">
            <div>
                <Button
                    :content="{ side: 'right', align: 'center' }"
                    :icon="playingComponentId === componentId ? 'heroicons:pause-solid' : 'heroicons:play-solid'"
                    :aria-label="playingComponentId ? 'Pause Playback' : 'Start Playback'"
                    variant="ghost"
                    :disabled="beats.length === 0"
                    @click="
                        () => {
                            if (playingComponentId === componentId) playingComponentId = '';
                            else playingComponentId = componentId;
                        }
                    "
                />
            </div>
            <div>
                <Button
                    v-bind="commonButtonProps"
                    icon="mdi:exclamation-thick"
                    aria-label="Add accented beat"
                    @click="addBeat(Beat.ACCENTED)"
                />
                <Button
                    v-bind="commonButtonProps"
                    icon="mdi:music-note-quarter"
                    aria-label="Add Beat"
                    @click="addBeat(Beat.NORMAL)"
                />
                <Button
                    v-bind="commonButtonProps"
                    icon="mdi:music-rest-quarter"
                    aria-label="Add Pause"
                    @click="addBeat(Beat.PAUSE)"
                />
                <Button
                    v-bind="commonButtonProps"
                    :disabled="beats.length === 0"
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
