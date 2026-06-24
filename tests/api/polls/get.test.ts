import { expect, test } from "~~/test-utils/playwright";
import { makePollTestBuilder } from "~~/test-utils/playwright/builders/poll";

const testBuilder = makePollTestBuilder("get-collection");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .returnsAnEmptyArrayWhenThereAreNoResources()
    .doesNotReturnResourcesOfOtherUsers()
    .doesNotReturnSoftDeletedResources()
    .build();

test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
    await db.poll.insert(1, { choices: ["A", "B"], title: "Letter", createdAt: new Date("2025-01-01") });
    await db.poll.insert(1, { choices: ["A", "B"], title: "Letter", createdAt: new Date("2026-01-01") });
    const response = await request.get("/api/polls");

    expect(await response.json()).toStrictEqual([
        expect.objectContaining({
            choices: ["A", "B"],
            closesAt: null,
            createdAt: "2026-01-01T00:00:00.000Z",
            majorityWinner: false,
            method: "positional",
            title: "Letter",
            votes: [],
        }),
        expect.objectContaining({
            choices: ["A", "B"],
            closesAt: null,
            createdAt: "2025-01-01T00:00:00.000Z",
            majorityWinner: false,
            method: "positional",
            title: "Letter",
            votes: [],
        }),
    ]);
});
