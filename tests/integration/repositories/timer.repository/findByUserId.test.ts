import { expect, test } from "@@/test-utils/vitest";
import TimerRepository from "~~/server/features/timer/repositories/timer.repository";
import { anyId } from "~~/test-utils/vitest/patterns";

test("returns only the timers belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    const otherUserstimers = await db.timer.insert(5, { userId: otherUser.id });
    for (const timer of otherUserstimers) {
        await db.timerInterval.insert(2, { timerId: timer.id });
    }

    const timerRepository = new TimerRepository(db.client);
    await db.timer.insert(2, { userId: user.id });
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
    const [timer] = await db.timer.insert(1, { userId: user.id });
    await db.timerInterval.insert(2, { timerId: timer.id });
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
