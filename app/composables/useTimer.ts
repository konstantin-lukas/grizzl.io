export default function useTimer(duration: number = 1) {
    const progress = useState("timer-progress", () => 0 / duration);
    const intervalStartTime = useState("timer-start-interval-time", () => Date.now());
    const startTime = useState("timer-start-time", () => Date.now());
    const elapsedTime = useState("timer-elapsed-time", () => 0);
    const elapsedIntervalTime = useState("timer-elapsed-interval-time", () => 0);
    const repetition = useState("timer-repetition", () => 1);
    const round = useState("timer-round", () => 1);
    const playing = useState("timer-playing", () => false);
    const lastIntervalTitleRead = useState<string | undefined>("timer-last-interval-timer-read", () => undefined);

    const reset = (fullyReset = false) => {
        progress.value = 0;
        intervalStartTime.value = Date.now();
        elapsedIntervalTime.value = 0;
        repetition.value = 1;
        if (fullyReset) {
            playing.value = false;
            round.value = 1;
            lastIntervalTitleRead.value = undefined;
            elapsedTime.value = 0;
            startTime.value = Date.now();
        }
    };

    watch(
        () => duration,
        () => reset(),
    );

    return {
        progress,
        intervalStartTime,
        startTime,
        elapsedIntervalTime,
        elapsedTime,
        repetition,
        round,
        playing,
        lastIntervalTitleRead,
        reset,
    };
}
