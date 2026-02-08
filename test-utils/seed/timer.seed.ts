import { Beat } from "#shared/enum/timer";
import { arr, int, maybe, str } from "@@/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";

test("insert timer test data", async ({ db }) => {
    for (let i = 0; i < 5; i++) {
        const [timer] = await db.timer.insert({
            count: 1,
            title: str({ length: int({ min: 1, max: 100, seed: i }), seed: i }),
        });

        const intervalCount = int({ min: 1, max: 10, seed: i });
        for (let j = 0; j < intervalCount; j++) {
            const seed = 10 * i + j;
            await db.timerInterval.insert(timer!.id, {
                count: 1,
                title: str({ length: int({ min: 1, max: 100, seed }), seed }),
                repeatCount: int({ min: 1, max: 5, seed }),
                duration: int({ min: 1000, max: 60 * 1000, seed }),
                beatPattern: maybe(() => arr(Object.values(Beat), { length: int({ min: 2, max: 30, seed }) }), seed),
            });
        }
    }
});
