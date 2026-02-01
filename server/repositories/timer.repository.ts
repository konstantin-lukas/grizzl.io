import type { drizzle } from "drizzle-orm/node-postgres";
import BaseRepository from "~~/server/repositories/base.repository";

const schema = "timer";

export default class TimerRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema);
    }
}
