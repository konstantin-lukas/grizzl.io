import { Beat } from "#shared/enum/timer";
import accentedAudio from "~/assets/sound/accented_beat.wav";
import beatAudio from "~/assets/sound/beat.wav";
import beep from "~/assets/sound/intermittent_beep.wav";

export default function useAnimateTimer(emit: (e: "finish") => void) {
    const {
        progress,
        startTime,
        intervalStartTime,
        elapsedIntervalTime,
        elapsedTime,
        repetition,
        round,
        playing,
        mute,
        currentBeat,
        interval,
    } = useTimer();

    const animateTimer = () => {
        if (!interval.value?.duration || !interval.value?.id || !playing.value) return;
        elapsedIntervalTime.value = Date.now() - intervalStartTime.value;
        elapsedTime.value = Date.now() - startTime.value;

        if (interval.value.beatPattern && interval.value.beatPattern.length > 0) {
            const barLengthInMs = interval.value.duration;
            const moduloTime = (Date.now() - intervalStartTime.value) % barLengthInMs;
            const beatLength = barLengthInMs / interval.value.beatPattern.length;
            const nextBeat = Math.floor(moduloTime / beatLength);
            if (currentBeat.value < nextBeat) {
                currentBeat.value = nextBeat;
                if (interval.value.beatPattern[nextBeat] !== Beat.PAUSE) {
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
        }
        progress.value = newProgress;
        requestAnimationFrame(animateTimer);
    };

    return animateTimer;
}
