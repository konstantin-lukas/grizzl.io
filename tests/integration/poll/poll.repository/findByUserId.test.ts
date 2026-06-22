import PollRepository from "~~/server/poll/repositories/poll.repository";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("returns only the polls belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    await db.poll.insert(5, { userId: otherUser.id });

    const pollRepository = new PollRepository(db.client);
    await db.poll.insert(2, { userId: user.id });
    const lists = await pollRepository.findByUserId(user.id);
    expect(lists).toStrictEqual([
        {
            choices: [
                "Lobortis pellentesque tortor volutpat aliquam lectus vivamus voluptate quisque sollicitudin. Nisiio.",
                "Pellentesque tortor volutpat aliquam lectus vivamus. Voluptate quisque sollicitudin nisi aenean fau.",
                "Tortor volutpat aliquam lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget. In.",
                "Volutpat aliquam lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer al.",
                "Aliquam lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer aliquam con.",
                "Lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur.",
                "Vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer. Aliquam consectetur biben.",
                "Voluptate quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur. Bibendum soda.",
                "Quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur bibendum sodales turpisi.",
                "Sollicitudin nisi aenean faucibus eget integer aliquam consectetur bibendum sodales turpis irure pr.",
                "Nisi aenean faucibus eget integer aliquam consectetur. Bibendum sodales turpis irure pretium phasel.",
                "Aenean faucibus eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus eg.",
                "Faucibus eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus egestasio.",
                "Eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus egestas praesentio.",
                "Integer aliquam consectetur bibendum sodales turpis irure pretium phasellus egestas praesent aliqua.",
                "Aliquam consectetur bibendum sodales turpis irure pretium phasellus egestas praesent aliqua. Except.",
                "Consectetur bibendum sodales turpis irure pretium phasellus. Egestas praesent aliqua excepteur eros.",
                "Bibendum sodales turpis irure pretium phasellus. Egestas praesent aliqua excepteur eros neque nonio.",
                "Sodales turpis irure pretium phasellus egestas praesent. Aliqua excepteur eros neque non nisi erati.",
                "Turpis irure pretium phasellus egestas praesent aliqua excepteur eros neque. Non nisi erat tristiqu.",
            ],
            closesAt: expect.any(Date),
            createdAt: expect.any(Date),
            id: anyId,
            majorityWinner: false,
            method: "approval",
            title: "Lobortis pellentesque tortor volutpat aliquam lectus vivamus voluptate quisque sollicitudin. Nisi aenean faucibus eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus. Ege.",
            votes: [],
        },
        {
            choices: [
                "Vitae lobortis pellentesque tortor volutpat aliquam lectus vivamus voluptate. Quisque sollicitudini.",
                "Lobortis pellentesque tortor volutpat aliquam lectus vivamus voluptate quisque sollicitudin. Nisiio.",
                "Pellentesque tortor volutpat aliquam lectus vivamus. Voluptate quisque sollicitudin nisi aenean fau.",
                "Tortor volutpat aliquam lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget. In.",
                "Volutpat aliquam lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer al.",
                "Aliquam lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer aliquam con.",
                "Lectus vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur.",
                "Vivamus voluptate quisque sollicitudin nisi aenean faucibus eget integer. Aliquam consectetur biben.",
                "Voluptate quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur. Bibendum soda.",
                "Quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur bibendum sodales turpisi.",
                "Sollicitudin nisi aenean faucibus eget integer aliquam consectetur bibendum sodales turpis irure pr.",
                "Nisi aenean faucibus eget integer aliquam consectetur. Bibendum sodales turpis irure pretium phasel.",
                "Aenean faucibus eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus eg.",
                "Faucibus eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus egestasio.",
                "Eget integer aliquam consectetur bibendum sodales turpis irure pretium phasellus egestas praesentio.",
                "Integer aliquam consectetur bibendum sodales turpis irure pretium phasellus egestas praesent aliqua.",
                "Aliquam consectetur bibendum sodales turpis irure pretium phasellus egestas praesent aliqua. Except.",
                "Consectetur bibendum sodales turpis irure pretium phasellus. Egestas praesent aliqua excepteur eros.",
                "Bibendum sodales turpis irure pretium phasellus. Egestas praesent aliqua excepteur eros neque nonio.",
                "Sodales turpis irure pretium phasellus egestas praesent. Aliqua excepteur eros neque non nisi erati.",
            ],
            closesAt: expect.any(Date),
            createdAt: expect.any(Date),
            id: anyId,
            majorityWinner: false,
            method: "positional",
            title: "Vitae lobortis pellentesque tortor volutpat aliquam lectus vivamus voluptate. Quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur. Bibendum sodales turpis irure pretium phasell.",
            votes: [],
        },
    ]);
});

test("automatically includes the votes belonging to a poll", async ({ db, user }) => {
    const pollRepository = new PollRepository(db.client);
    const [poll] = await db.poll.insert(1, { userId: user.id, choices: ["Bananas", "Oranges", "Pineapples"] });
    await db.pollVote.insert(2, index => ({ pollId: poll.id, selection: index ? [0, 1, 2] : [2, 0, 1] }));
    const [foundPoll] = await pollRepository.findByUserId(user.id);
    expect(foundPoll).toStrictEqual({
        choices: ["Bananas", "Oranges", "Pineapples"],
        closesAt: expect.any(Date),
        createdAt: expect.any(Date),
        id: anyId,
        majorityWinner: false,
        method: "positional",
        title: "Vitae lobortis pellentesque tortor volutpat aliquam lectus vivamus voluptate. Quisque sollicitudin nisi aenean faucibus eget integer aliquam consectetur. Bibendum sodales turpis irure pretium phasell.",
        votes: [
            [2, 0, 1],
            [0, 1, 2],
        ],
    });
});

test("returns an empty array when the user id doesn't exist", async ({ db }) => {
    const pollRepository = new PollRepository(db.client);
    const polls = await pollRepository.findByUserId("bananas");
    expect(polls).toHaveLength(0);
});

test("returns an empty array when no timers exist for the given user id", async ({ db, user }) => {
    const pollRepository = new PollRepository(db.client);
    const polls = await pollRepository.findByUserId(user.id);
    expect(polls).toHaveLength(0);
});
