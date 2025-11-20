import type { PutTimer } from "#shared/schema/timer";
import { and, eq } from "drizzle-orm";
import { db } from "~~/lib/db";
import { timer, timerInterval } from "~~/lib/db/schema";

export default async function update(
    id: string,
    userId: string,
    values: { deleted: boolean } | { title: string; ttsVoice: string | null; intervals: PutTimer["intervals"] },
) {
    return await db.transaction(async tx => {
        const { rowCount } = await tx
            .update(timer)
            .set("deleted" in values ? { deleted: values.deleted } : { title: values.title, ttsVoice: values.ttsVoice })
            .where(and(eq(timer.id, id), eq(timer.userId, userId)));

        if (rowCount === null || "deleted" in values) return rowCount;

        const promises = values.intervals.map((interval, index) => {
            if (interval.id) {
                return tx
                    .update(timerInterval)
                    .set({
                        title: interval.title,
                        index,
                        repeatCount: interval.repeatCount,
                        duration: interval.duration,
                        beatPattern: interval.beatPattern,
                    })
                    .where(and(eq(timerInterval.id, interval.id ?? ""), eq(timerInterval.timerId, id)));
            }
            return tx.insert(timerInterval).values({
                timerId: id,
                index,
                title: interval.title,
                repeatCount: interval.repeatCount,
                duration: interval.duration,
                beatPattern: interval.beatPattern,
            });
        });
        const results = await Promise.all(promises);
        return results.reduce((acc, val) => acc + (val.rowCount ?? 0), rowCount);
    });
}
