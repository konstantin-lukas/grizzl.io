import { expect, test } from "vitest";
import { hash } from "~/utils/hash";

test("produces the correct SHA-1 hash for a known string", async () => {
    const result = await hash("hello world");
    expect(result).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
});

test("produces the correct SHA-1 hash for an empty string", async () => {
    const result = await hash("");
    expect(result).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709");
});

test("is deterministic for the same input", async () => {
    const a = await hash("test message");
    const b = await hash("test message");
    expect(a).toBe(b);
});

test("produces different hashes for different inputs", async () => {
    const a = await hash("message one");
    const b = await hash("message two");
    expect(a).not.toBe(b);
});

test("is case-sensitive", async () => {
    const lower = await hash("test");
    const upper = await hash("TEST");
    expect(lower).not.toBe(upper);
});
