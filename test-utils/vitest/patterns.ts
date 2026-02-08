import { expect } from "~~/test-utils/vitest";

export const anyId = expect.stringMatching(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{16}$/);
