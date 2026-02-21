import type { Timer } from "#shared/features/timer/validators/timer.validator";

export default function useTimer() {
    const progress = useState("timer-progress", () => 0);
    const intervalStartTime = useState("timer-start-interval-time", () => Date.now());
    const elapsedIntervalTime = useState("timer-elapsed-interval-time", () => 0);

    const preparationTimeProgress = useState("timer-preparation-time-progress", () => 0);
    const preparationStartTime = useState("timer-start-interval-preparation-time", () => Date.now());
    const elapsedPreparationTime = useState("timer-elapsed-interval-preparation-time", () => 0);
    const isInPreparationTime = useState("timer-is-in-preparation-time", () => false);

    const repetition = useState("timer-repetition", () => 1);
    const round = useState("timer-round", () => 1);

    const currentBeat = useState("timer-current-beat", () => -1);
    const lastIntervalTitleRead = useState<string | undefined>("timer-last-interval-timer-read", () => undefined);

    const playing = useState("timer-playing", () => false);
    const mute = useState("timer-mute", () => false);
    const interval = useState<Timer["intervals"][number] | undefined>("timer-interval", () => undefined);

    const reset = (fullyReset = false) => {
        progress.value = 0;
        isInPreparationTime.value = false;
        preparationTimeProgress.value = 0;
        intervalStartTime.value = Date.now();
        elapsedIntervalTime.value = 0;
        preparationStartTime.value = Date.now();
        elapsedPreparationTime.value = 0;
        repetition.value = 1;
        currentBeat.value = -1;
        if (fullyReset) {
            playing.value = false;
            round.value = 1;
            lastIntervalTitleRead.value = undefined;
        }
    };

    return {
        progress,
        preparationTimeProgress,
        intervalStartTime,
        elapsedIntervalTime,
        repetition,
        preparationStartTime,
        elapsedPreparationTime,
        round,
        isInPreparationTime,
        playing,
        lastIntervalTitleRead,
        currentBeat,
        mute,
        interval,
        reset,
    };
}
