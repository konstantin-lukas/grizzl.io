import { IconTagsMap } from "../maps/icon-tags.map";

export const CATEGORY_ICONS = IconTagsMap.keys()
    .map(key => `material-symbols:${key}`)
    .toArray();

export const SHORT_CATEGORY_ICONS = IconTagsMap.keys().toArray();
