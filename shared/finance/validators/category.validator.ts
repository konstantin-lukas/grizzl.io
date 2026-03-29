import { TITLE_MAX, TITLE_MIN } from "#shared/core/validators/core.validator";
import { CategoryIconsMap } from "#shared/finance/maps/category-icons.map";
import { normalize } from "#shared/finance/utils/string";
import { z } from "zod";

const VALID_ICONS = Object.keys(CategoryIconsMap) as (keyof typeof CategoryIconsMap)[];

export const CategorySchema = z
    .object({
        name: z.string().min(TITLE_MIN).max(TITLE_MAX),
        icon: z.enum(VALID_ICONS),
    })
    .transform(({ name, ...rest }) => ({
        displayName: name,
        normalizedName: normalize(name),
        ...rest,
    }));

export type CategoryInternal = z.output<typeof CategorySchema>;
export type CategoryExternal = z.input<typeof CategorySchema>;
