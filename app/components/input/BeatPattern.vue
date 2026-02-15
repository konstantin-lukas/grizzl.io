<script setup lang="ts">
import { Beat } from "#shared/features/timer/enums/beat.enum";
import { BeatSymbol } from "#shared/features/timer/maps/beat.map";
import { BEAT_PATTERN_MAX } from "#shared/features/timer/validators/timer.validator";
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
    startTime.value = Date.now() - currentBeat.value * (barLength / beats.length);
    const animateBeats = () => {
        if (playingComponentId.value !== componentId) return;
        const moduloTime = (Date.now() - startTime.value) % barLength;
        const beatLength = barLength / beats.length;
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
                    :aria-label="playingComponentId ? $t('ui.pause') : $t('ui.play')"
                    :data-test-id="`beat-pattern-input-${playingComponentId === componentId ? 'pause' : 'play'}-button`"
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
                    :aria-label="$t('timer.form.interval.addAccent')"
                    data-test-id="beat-pattern-input-add-accent-button"
                    @click="addBeat(Beat.ACCENTED)"
                />
                <Button
                    v-bind="commonButtonProps"
                    icon="mdi:music-note-quarter"
                    :aria-label="$t('timer.form.interval.addBeat')"
                    data-test-id="beat-pattern-input-add-beat-button"
                    @click="addBeat(Beat.NORMAL)"
                />
                <Button
                    v-bind="commonButtonProps"
                    icon="mdi:music-rest-quarter"
                    :aria-label="$t('timer.form.interval.addPause')"
                    data-test-id="beat-pattern-input-add-pause-button"
                    @click="addBeat(Beat.PAUSE)"
                />
                <Button
                    v-bind="commonButtonProps"
                    :disabled="beats.length === 0"
                    icon="mdi:music-note-off"
                    color="error"
                    :aria-label="$t('timer.form.interval.deleteBeat')"
                    data-test-id="beat-pattern-input-delete-button"
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
                v-for="(beat, index) in beats"
                :key="index"
                class="size-8"
                :class="{ 'bg-primary': index === currentBeat }"
                :data-test-id="`beat-pattern-input-beat-${index}`"
                :name="BeatSymbol[beat]"
            />
        </div>
    </div>
</template>
