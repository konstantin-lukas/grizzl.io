import type { Timer } from "#shared/schema/timer";
import { and, eq, sql } from "drizzle-orm";
import { db } from "~~/lib/db";
import { timer, timerInterval } from "~~/lib/db/schema";

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
        .where(and(eq(timer.userId, userId), eq(timer.deleted, false)))
        .groupBy(timer.id)
        .orderBy(timer.createdAt) as unknown as (Timer & { createdAt: string })[];
}
