import { and, eq } from "drizzle-orm";
import { db } from "~~/lib/db";
import { timer } from "~~/lib/db/schema";

export default async function update(id: string, userId: string, values: { deleted: boolean }) {
    return db
        .update(timer)
        .set(values)
        .where(and(eq(timer.id, id), eq(timer.userId, userId)));
}
