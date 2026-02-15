import { z } from "zod";

export const ID_LENGTH = 16;
export const TITLE_MIN = 1;
export const TITLE_MAX = 100;
export const LONG_TITLE_MAX = 200;
export const LIST_MIN = 1;
export const LIST_MAX = 100;
export const COUNT_MIN = 1;
export const COUNT_MAX = 100;

export const DatabaseIdSchema = z.string().regex(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{16}$/);

export const DatabaseDeletedSchema = z.object({
    deleted: z.boolean(),
});
