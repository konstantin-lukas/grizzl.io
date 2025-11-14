export enum Beat {
    PAUSE = "pause",
    NORMAL = "low",
    ACCENTED = "high",
}

export const BeatSymbol = {
    [Beat.PAUSE]: "mdi:music-rest-quarter",
    [Beat.NORMAL]: "mdi:music-note-quarter",
    [Beat.ACCENTED]: "mdi:exclamation-thick",
};
