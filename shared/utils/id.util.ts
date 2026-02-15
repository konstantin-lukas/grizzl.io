import { ID_LENGTH } from "#shared/validators/core.validator";
import { customAlphabet } from "nanoid";

export function generateId() {
    const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", ID_LENGTH);
    return nanoid();
}
