import { Beat } from "#shared/enum/timer";
import accentedAudio from "~/assets/sound/accented_beat.wav";
import beatAudio from "~/assets/sound/beat.wav";
import beep from "~/assets/sound/intermittent_beep.wav";

export default function useAnimateTimer(emit: (e: "finish") => void, rounds: number, voiceUri: string | null) {
    const {
        progress,
        intervalStartTime,
        elapsedIntervalTime,
        repetition,
        round,
        playing,
        mute,
        currentBeat,
        lastIntervalTitleRead,
        interval,
        reset,
    } = useTimer();
    const speak = useSpeakUtterance();
    const ttsVoices = useVoices();

    const animateTimer = () => {
        if (!interval.value?.duration || !interval.value?.id || !playing.value) return;
        elapsedIntervalTime.value = Date.now() - intervalStartTime.value;

        if (interval.value.beatPattern && interval.value.beatPattern.length > 0) {
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

        const newProgress = elapsedIntervalTime.value / interval.value.duration;
        if (newProgress >= 1) {
            if (!mute.value) {
                const beat = new Audio(beep);
                beat.play().then(undefined);
            }
            round.value++;
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
            const voice = voiceUri;
            const isVoiceValid = (uri: string | null): uri is string => ttsVoices.value.some(v => v.voiceURI === uri);
            if (t && p && lastIntervalTitleRead.value !== interval.value?.id && isVoiceValid(voice)) {
                if (!mute.value) setTimeout(() => speak(t, voice), 500);
                lastIntervalTitleRead.value = interval.value?.id;
            }
        },
    );

    watch(interval, () => {
        reset();
        animateTimer();
    });

    watch(round, r => {
        if (r > rounds) playing.value = false;
    });

    watch(playing, p => {
        if (p) {
            intervalStartTime.value = Date.now() - elapsedIntervalTime.value;
            // This gets put in the microtask queue to avoid the animation loop starting while the old one is running.
            // It prevents the first beat being played twice when clicking the play button after the timer has completed.
            queueMicrotask(() => animateTimer());
        }
    });

    return animateTimer;
}
