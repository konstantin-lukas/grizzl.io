import { IconTagsMap } from "#shared/core/maps/icon-tags.map";
import { TITLE_MAX, TITLE_MIN, preTrim } from "#shared/core/validators/core.validator";
import { normalize } from "#shared/finance/utils/string";
import { z } from "zod";

const VALID_ICONS = Object.keys(IconTagsMap) as (keyof typeof IconTagsMap)[];

export const CategorySchema = z
    .object({
        name: preTrim(z.string().min(TITLE_MIN).max(TITLE_MAX)),
        icon: z.enum(VALID_ICONS),
    })
    .transform(({ name, ...rest }) => ({
        displayName: name,
        normalizedName: normalize(name),
        ...rest,
    }));

export const CategoryIconSuggestionSchema = z.object({
    categoryName: preTrim(z.string().max(TITLE_MAX)),
});

export type CategoryInternal = z.output<typeof CategorySchema>;
export type CategoryExternal = z.input<typeof CategorySchema>;
