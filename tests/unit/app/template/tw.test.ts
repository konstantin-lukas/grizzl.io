import { tw } from "@@/app/utils/template";
import { expect, test } from "vitest";

test("returns a plain string when no interpolations exist", () => {
    const result = tw`hello world`;
    expect(result).toBe("hello world");
});

test("interpolates values correctly", () => {
    const foo = "bar";
    const result = tw`foo ${foo} baz`;
    expect(result).toBe("foo bar baz");
});

test("preserves whitespace and newlines exactly (String.raw behavior)", () => {
    const result = tw`
      line1
      line2
    `;
    expect(result).toBe(`
      line1
      line2
    `);
});

test("handles multiple interpolated values", () => {
    const a = "A";
    const b = "B";
    const result = tw`_${a}_${b}_`;
    expect(result).toBe("_A_B_");
});

test("escapes backslashes literally (ensures raw behavior)", () => {
    const result = tw`path\\to\\file`;
    expect(result).toBe("path\\to\\file");
});
