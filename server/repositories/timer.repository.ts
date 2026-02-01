import type { PostTimer, PutTimer, Timer } from "#shared/validators/timer";
import { and, desc, eq, isNull, notInArray, sql } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import { db } from "~~/server/database";
import { timerInterval } from "~~/server/database/schema";
import BaseRepository from "~~/server/repositories/base.repository";

const schema = "timer";

export default class TimerRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema);
    }

    async create(userId: string, { title, ttsVoice, intervals }: PostTimer) {
        return await db.transaction(async tx => {
            const [{ timerId }] = (await tx
                .insert(this.schema)
                .values({ userId, title, ttsVoice })
                .returning({ timerId: this.schema.id })) as [{ timerId: string }];

            await tx
                .insert(timerInterval)
                .values(intervals.map((interval, index) => ({ ...interval, timerId, index })));

            return timerId;
        });
    }

    public async findByUserId(userId: string) {
        return db
            .select({
                id: this.schema.id,
                title: this.schema.title,
                ttsVoice: this.schema.ttsVoice,
                createdAt: this.schema.createdAt,
                intervals: sql`
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ${timerInterval.id},
                            'title', ${timerInterval.title},
                            'repeatCount', ${timerInterval.repeatCount},
                            'duration', ${timerInterval.duration},
                            'beatPattern', ${timerInterval.beatPattern}
                        )
                        ORDER BY ${timerInterval.index}
                    ) FILTER (WHERE ${timerInterval.id} IS NOT NULL),
                    '[]'
                )
            `.as("intervals"),
            })
            .from(this.schema)
            .leftJoin(timerInterval, eq(this.schema.id, timerInterval.timerId))
            .where(and(eq(this.schema.userId, userId), isNull(this.schema.deletedAt)))
            .groupBy(this.schema.id)
            .orderBy(desc(this.schema.createdAt)) as unknown as (Timer & { createdAt: string })[];
    }

    public async update(
        id: string,
        userId: string,
        values: { title: string; ttsVoice: string | null; intervals: PutTimer["intervals"] },
    ) {
        return await db.transaction(async tx => {
            const { rowCount } = await tx
                .update(this.schema)
                .set({ title: values.title, ttsVoice: values.ttsVoice })
                .where(and(eq(this.schema.id, id), eq(this.schema.userId, userId)));

            if (!rowCount) return rowCount;

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
}
