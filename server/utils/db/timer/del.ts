import { and, eq } from "drizzle-orm";
import { db } from "~~/lib/db";
import { timer } from "~~/lib/db/schema";

export default async function del(id: string, userId: string) {
    return db.delete(timer).where(and(eq(timer.id, id), eq(timer.userId, userId)));
}
