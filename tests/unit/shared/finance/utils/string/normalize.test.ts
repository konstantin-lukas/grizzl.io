import { normalize } from "#shared/finance/utils/string";
import { expect, test } from "vitest";

test.each([
    ["replaces a space with an underscore", "Hello, world!", "hello,_world!"],
    ["replaces a tab with an underscore", "Hello,\tworld!", "hello,_world!"],
    ["replaces a line break with an underscore", "Hello,\nworld!", "hello,_world!"],
    ["replaces a carriage return with an underscore", "Hello,\rworld!", "hello,_world!"],
    ["trims space on the side and collapses multiple spaces", "  a  a  ", "a_a"],
    ["removes diacritics", "¡Buenos días desde España!", "¡buenos_dias_desde_espana!"],
    ["converts to lowercase", "ABC", "abc"],
    ["does not expand characters to create a longer string", "Straße", "straße"],
])("$0 (returns $2 when input is $1)", (_, input, expected) => {
    expect(normalize(input)).toBe(expected);
});
