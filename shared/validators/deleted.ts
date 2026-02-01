import { z } from "zod";

export const DatabaseDeletedSchema = z.object({
    deleted: z.boolean(),
});
