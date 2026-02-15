import { Beat } from "#shared/features/timer/enums/beat.enum";

export const BeatSymbol = {
    [Beat.PAUSE]: "mdi:music-rest-quarter",
    [Beat.NORMAL]: "mdi:music-note-quarter",
    [Beat.ACCENTED]: "mdi:exclamation-thick",
} as const;
