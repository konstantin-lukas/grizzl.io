import { makeMap } from "#shared/core/utils/object.util";
import { Beat } from "#shared/timer/enums/beat.enum";
import { ICON_EXCLAMATION, ICON_MUSIC_NOTE, ICON_MUSIC_REST } from "~/core/constants/icons.constant";

export const BeatIconMap = makeMap<Beat, string>(
    [Beat.PAUSE, ICON_MUSIC_REST],
    [Beat.NORMAL, ICON_MUSIC_NOTE],
    [Beat.ACCENTED, ICON_EXCLAMATION],
);
