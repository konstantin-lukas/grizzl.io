import { z } from "zod";

export const DatabaseDeletedSchema = z.strictObject({
    deleted: z.boolean(),
});
