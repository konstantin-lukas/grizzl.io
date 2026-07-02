import PollRepository from "server/poll/repositories/poll.repository";
import { BASE_POLL } from "test-utils/constants/poll";
import { expect, test } from "test-utils/vitest";

test("creates a poll and returns the id of the created account", async ({ db, user }) => {
    const pollRepository = new PollRepository(db.client);
    const id = await pollRepository.create(user.id, BASE_POLL);

    const [poll] = await db.poll.select(id);

    expect(poll!.id).toBe(id);
    expect(poll).toHaveProperty("id", id);
    expect(poll).toHaveProperty("title", BASE_POLL.title);
    expect(poll).toHaveProperty("userId", user.id);
    expect(poll).toHaveProperty("choices", BASE_POLL.choices);
    expect(poll).toHaveProperty("voterIdentityMethod", BASE_POLL.voterIdentityMethod);
    expect(poll).toHaveProperty("method", BASE_POLL.method);
    expect(poll).toHaveProperty("majorityWinner", BASE_POLL.majorityWinner);
    expect(poll).toHaveProperty("closesAt", BASE_POLL.closesAt);
    expect(poll).toHaveProperty("deletedAt", null);
    expect(poll).toHaveProperty("createdAt", expect.any(Date));
});

test("throws an error when the input data is faulty", async ({ db, user }) => {
    const pollRepository = new PollRepository(db.client);
    await expect(pollRepository.create(user.id, "" as never)).rejects.toThrow();
});
