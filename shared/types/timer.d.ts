import type { TimerType } from "#shared/schema/timer";

export type TimerIntervalWithId = TimerType["intervals"][number] & {
    id: string;
};

export type TimerPostWithId = Omit<TimerType, "intervals"> & {
    intervals: TimerIntervalWithId[];
};
