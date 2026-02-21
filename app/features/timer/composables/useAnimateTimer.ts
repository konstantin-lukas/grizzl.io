import { Beat } from "#shared/features/timer/enums/beat.enum";
import accentedAudio from "~/assets/sound/accented_beat.wav";
import beatAudio from "~/assets/sound/beat.wav";
import intervalCommenceAudio from "~/assets/sound/interval_commence.wav";
import intervalCompleteAudio from "~/assets/sound/interval_complete.wav";
import timerCompleteAudio from "~/assets/sound/timer_complete.wav";
import useTimer from "~/features/timer/composables/useTimer";
import useVoiceDigest from "~/features/timer/composables/useVoiceDigest";

export default function useAnimateTimer(emit: (e: "finish") => void, rounds: number, savedVoices: string[]) {
    const {
        progress,
        preparationTimeProgress,
        intervalStartTime,
        elapsedIntervalTime,
        repetition,
        round,
        playing,
        mute,
        currentBeat,
        preparationStartTime,
        elapsedPreparationTime,
        lastIntervalTitleRead,
        interval,
        isInPreparationTime,
    } = useTimer();
    const speak = useSpeakUtterance();
    const ttsVoices = useVoices();
    const wasBeepPlayed = ref(false);

    const voiceDigest = useVoiceDigest();
    const voiceUri = computed(() => {
        const voice = savedVoices.find(v => v.slice(0, voiceDigest.value.length) === voiceDigest.value);
        return voice?.slice(voiceDigest.value.length) || null;
    });

    const animateTimer = () => {
        if (!interval.value?.duration || !interval.value?.id || !playing.value) return;

        isInPreparationTime.value = elapsedPreparationTime.value < interval.value.preparationTime;
        if (isInPreparationTime.value) {
            elapsedPreparationTime.value = Date.now() - preparationStartTime.value;
            preparationTimeProgress.value = elapsedPreparationTime.value / interval.value.preparationTime;
            intervalStartTime.value = Date.now();
            if (!wasBeepPlayed.value && preparationTimeProgress.value >= 1 && !mute.value) {
                const beat = new Audio(intervalCommenceAudio);
                beat.play().then(undefined);
                wasBeepPlayed.value = true;
            }
        }

        elapsedIntervalTime.value = isInPreparationTime.value ? 0 : Date.now() - intervalStartTime.value;
        if (interval.value.beatPattern && interval.value.beatPattern.length > 0 && !isInPreparationTime.value) {
            const barLengthInMs = interval.value.duration;
            const moduloTime = (Date.now() - intervalStartTime.value) % barLengthInMs;
            const beatLength = barLengthInMs / interval.value.beatPattern.length;
            const nextBeat = Math.floor(moduloTime / beatLength);
            if (currentBeat.value < nextBeat) {
                currentBeat.value = nextBeat;
                if (!mute.value && interval.value.beatPattern[nextBeat] !== Beat.PAUSE) {
                    const beat = new Audio(
                        interval.value.beatPattern[nextBeat] === Beat.ACCENTED ? accentedAudio : beatAudio,
                    );
                    beat.play().then(undefined);
                }
            }
        }

        const newProgress = isInPreparationTime.value ? 0 : elapsedIntervalTime.value / interval.value.duration;
        if (newProgress >= 1) {
            round.value++;

            if (!mute.value) {
                const beat = new Audio(round.value - 1 === rounds ? timerCompleteAudio : intervalCompleteAudio);
                beat.play().then(undefined);
            }

            if (repetition.value === interval.value.repeatCount) {
                emit("finish");
                return;
            }

            progress.value = 0;
            intervalStartTime.value = Date.now();
            repetition.value++;
            currentBeat.value = -1;
        } else {
            progress.value = newProgress;
        }
        requestAnimationFrame(animateTimer);
    };

    watch(
        () => [interval.value?.title, playing.value] as const,
        ([t, p]) => {
            const isVoiceValid = (uri: string | null): uri is string => ttsVoices.value.some(v => v.voiceURI === uri);
            const voice = voiceUri.value;
            if (t && p && lastIntervalTitleRead.value !== interval.value?.id && isVoiceValid(voice)) {
                if (!mute.value) setTimeout(() => speak(t, voice), 500);
                lastIntervalTitleRead.value = interval.value?.id;
            }
        },
    );

    watch(interval, () => {
        animateTimer();
    });

    watch(round, r => {
        if (r > rounds) playing.value = false;
        wasBeepPlayed.value = false;
    });

    watch(playing, p => {
        if (p) {
            intervalStartTime.value = Date.now() - elapsedIntervalTime.value;
            preparationStartTime.value = Date.now() - elapsedPreparationTime.value;
            // This gets put in the microtask queue to avoid the animation loop starting while the old one is running.
            // It prevents the first beat being played twice when clicking the play button after the timer has completed.
            queueMicrotask(() => animateTimer());
        }
    });

    return animateTimer;
}
