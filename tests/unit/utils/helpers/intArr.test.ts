import { intArr } from "@@/tests/utils/helpers";
import { expect, test } from "vitest";

test("generates near-evenly distributed numbers", () => {
    const length = 10000;
    const max = 5;
    const expectedHits = length / max;

    const array = intArr({ length, min: 1, max });
    const hitCounts = Array.from({ length: max }).map((_, index) => array.filter(item => item === index + 1).length);

    for (const hitCount of hitCounts) {
        const hitDeviation = Math.abs(expectedHits - hitCount);
        const fivePercent = expectedHits * 0.05;
        expect(hitDeviation).toBeLessThan(fivePercent);
    }
});
