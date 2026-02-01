import type { Timer } from "#shared/validators/timer";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { timer, timerInterval } from "~~/server/database/schema";

export default async function select(userId: string) {
    return db
        .select({
            id: timer.id,
            title: timer.title,
            ttsVoice: timer.ttsVoice,
            createdAt: timer.createdAt,
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
        .from(timer)
        .leftJoin(timerInterval, eq(timer.id, timerInterval.timerId))
        .where(and(eq(timer.userId, userId), isNull(timer.deletedAt)))
        .groupBy(timer.id)
        .orderBy(desc(timer.createdAt)) as unknown as (Timer & { createdAt: string })[];
}
