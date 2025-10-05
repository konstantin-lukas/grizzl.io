import { customAlphabet } from "nanoid";

export function generateID() {
    const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 16);
    return nanoid();
}
