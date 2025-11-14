import { z } from "zod";

export const DatabaseIdSchema = z.string().regex(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{16}$/);
