import type { PostTimer } from "#shared/schema/timer";
import { db } from "~~/lib/db";
import { timer, timerInterval } from "~~/lib/db/schema";

export default async function insert(userId: string, { title, ttsVoice, intervals }: PostTimer) {
    return await db.transaction(async tx => {
        const [{ timerId }] = (await tx
            .insert(timer)
            .values({ userId, title, ttsVoice })
            .returning({ timerId: timer.id })) as [{ timerId: string }];

        await tx.insert(timerInterval).values(intervals.map((interval, index) => ({ ...interval, timerId, index })));
        return timerId;
    });
}
