import { Beat } from "#shared/features/timer/enums/beat.enum";

export const BASE_INTERVAL = {
    title: "Crunches",
    repeatCount: 1,
    preparationTime: 5000,
    duration: 10000,
    beatPattern: [Beat.ACCENTED, Beat.NORMAL],
};

export const HASH_40_CHARS = "5bf3993d4ee84019b7e5a8772745be07509b655f";
export const BASE_TIMER = {
    title: "Upper Body Workout",
    ttsVoices: [`${HASH_40_CHARS}Virtual Voice Victor`],
    intervals: [BASE_INTERVAL],
};

export const FULL_INTERVAL = { ...BASE_INTERVAL, id: "VbvbykXQUeBBs5n8", timerId: "VbvbykXQUeBBs5n8" };

export const FULL_TIMER = {
    ...BASE_TIMER,
    intervals: [FULL_INTERVAL],
    id: "VbvbykXQUeBBs5n8",
    userId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("1999-12-31"),
    deleted: false,
};
