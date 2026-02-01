import type { PutTimer } from "#shared/validators/timer";
import { and, eq, notInArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { timer, timerInterval } from "~~/server/database/schema";

export default async function update(
    id: string,
    userId: string,
    values: { deleted: boolean } | { title: string; ttsVoice: string | null; intervals: PutTimer["intervals"] },
) {
    const isDelete = "deleted" in values;
    return await db.transaction(async tx => {
        const { rowCount } = await tx
            .update(timer)
            .set(
                isDelete
                    ? { deletedAt: values.deleted ? new Date() : null }
                    : { title: values.title, ttsVoice: values.ttsVoice },
            )
            .where(and(eq(timer.id, id), eq(timer.userId, userId)));

        if (!rowCount || isDelete) return rowCount;

        const intervalIds = values.intervals.map(i => i.id).filter((id): id is string => !!id);

        await tx
            .delete(timerInterval)
            .where(and(eq(timerInterval.timerId, id), notInArray(timerInterval.id, intervalIds)));

        const promises = values.intervals.map(async (interval, index) => {
            const baseValue = {
                index,
                title: interval.title,
                repeatCount: interval.repeatCount,
                duration: interval.duration,
                beatPattern: interval.beatPattern,
            };
            if (interval.id) {
                const updateResult = await tx
                    .update(timerInterval)
                    .set(baseValue)
                    .where(and(eq(timerInterval.id, interval.id), eq(timerInterval.timerId, id)));
                if (updateResult.rowCount && updateResult.rowCount > 0) return updateResult;
            }
            return tx.insert(timerInterval).values({
                timerId: id,
                ...baseValue,
            });
        });
        const results = await Promise.all(promises);
        return results.reduce((acc, val) => acc + (val.rowCount ?? 0), rowCount);
    });
}
