import { expect, test } from "@@/test-utils/vitest";
import TimerRepository from "~~/server/repositories/timer.repository";

const anyId = expect.stringMatching(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{16}$/);
test.beforeEach(async ({ db }) => {
    const user = await db.user.insert({ name: "Smithers", email: "smithers@burns.com" });
    const timers = await db.timer.insert({ userId: user.id });
    for (const timer of timers) {
        await db.timerInterval.insert(timer.id);
    }
});

test("returns only the timers belonging to the requested user", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    await db.timer.insert({ userId: user.id, count: 2 });
    const timers = await timerRepository.findByUserId(user.id);
    expect(timers).toStrictEqual([
        {
            createdAt: new Date("2025-05-18T01:18:19.000Z"),
            id: anyId,
            intervals: [],
            title: "lobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfaucibus",
            ttsVoice: null,
        },
        {
            createdAt: new Date("2025-01-23T02:17:18.000Z"),
            id: anyId,
            intervals: [],
            title: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfau",
            ttsVoice: null,
        },
    ]);
});

test("automatically includes the intervals belonging to a timer", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    const [timer] = await db.timer.insert({ userId: user.id, count: 1 });
    await db.timerInterval.insert(timer!.id);
    const [foundTimer] = await timerRepository.findByUserId(user.id);
    expect(foundTimer).toStrictEqual({
        createdAt: new Date("2025-01-23T02:17:18.000Z"),
        id: anyId,
        intervals: [
            {
                beatPattern: ["low", "low", "low"],
                duration: 3000,
                id: anyId,
                repeatCount: 2,
                title: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfau",
            },
            {
                beatPattern: null,
                duration: 3000,
                id: anyId,
                repeatCount: 2,
                title: "lobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfaucibus",
            },
        ],
        title: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfau",
        ttsVoice: null,
    });
});

test("returns an empty array when the user id doesn't exist", async ({ db }) => {
    const timerRepository = new TimerRepository(db.client);
    const timers = await timerRepository.findByUserId("bananas");
    expect(timers).toHaveLength(0);
});

test("returns an empty array when no timers exist for the given user id", async ({ db, user }) => {
    const timerRepository = new TimerRepository(db.client);
    const timers = await timerRepository.findByUserId(user.id);
    expect(timers).toHaveLength(0);
});
