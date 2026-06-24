import { SHA_256_CHAR_COUNT } from "#shared/core/validators/core.validator";
import { MAX_POLL_CHOICES } from "#shared/poll/validators/poll.validator";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { Database } from "~~/database";
import { arr, str } from "~~/test-utils/helpers/data";

export default class PollVoteFixture extends BaseFixture<"pollVote"> {
    protected defaults = (seed: number) => ({
        voterIdentifierHash: str({ length: SHA_256_CHAR_COUNT, seed, spaces: false }),
        selection: arr(
            Array.from({ length: MAX_POLL_CHOICES }).map((_, i) => i),
            { length: MAX_POLL_CHOICES, unique: true, seed: seed * MAX_POLL_CHOICES },
        ),
    });

    constructor(db: Database) {
        super(db, "pollVote");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"pollVote", { pollId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}
