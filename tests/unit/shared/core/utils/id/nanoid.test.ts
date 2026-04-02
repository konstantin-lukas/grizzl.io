import { nanoid } from "#shared/core/utils/id.util";
import { ID_LENGTH } from "#shared/core/validators/core.validator";
import { expect, test, vi } from "vitest";
import { int } from "~~/test-utils/helpers/data";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const cryptoSpy = vi.spyOn(global.crypto, "getRandomValues");

test.each([
    ["2QVHgERDbcBMz5h4", 0],
    ["ds2xf8yxmSRDoZgh", 10],
    ["gZT6ZCrnt9RLT2zm", 20],
    ["ARXCQJw5HbXpZ73v", 30],
    ["ZspjfcfhCB4dnvz5", 40],
])(`generates an ID ($0) of length ${ID_LENGTH} containing only letters in allowed alphabet`, (expected, seed) => {
    cryptoSpy.mockImplementation((arr: any) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = int({ min: 0, max: 255, seed: i + seed });
        }
        return arr;
    });
    const id = nanoid();
    expect(id).toBe(expected);
    expect(id).toMatch(new RegExp(`^[${ALPHABET}]{${ID_LENGTH},}$`));
});
