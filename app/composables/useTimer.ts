export default function useTimer(duration: number = 1) {
    const progress = useState("timer-progress", () => 0 / duration);
    const startTime = useState("timer-start-time", () => Date.now());
    const elapsedTime = useState("timer-elapsed-time", () => 0);
    const repetition = useState("timer-repetition", () => 1);
    const round = useState("timer-round", () => 1);
    const playing = useState("timer-playing", () => false);
    const lastIntervalTitleRead = useState<string | undefined>("timer-last-interval-timer-read", () => undefined);

    const reset = (finishTimer = false) => {
        progress.value = 0;
        startTime.value = Date.now();
        elapsedTime.value = 0;
        repetition.value = 1;
        if (finishTimer) {
            playing.value = false;
            round.value = 1;
            lastIntervalTitleRead.value = undefined;
        }
    };

    watch(
        () => duration,
        () => reset(),
    );
    return { progress, startTime, elapsedTime, repetition, round, playing, lastIntervalTitleRead, reset };
}
