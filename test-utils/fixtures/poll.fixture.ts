import { LIST_MAX, LONG_TITLE_MAX } from "#shared/core/validators/core.validator";
import { MAX_POLL_CHOICES } from "#shared/poll/validators/poll.validator";
import { PollMethod, VoterIdentityMethod } from "../../shared/poll/enums/method.enum";
import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import type { Database } from "~~/database";
import { boolean, date, enumValue, maybe, str, strArr } from "~~/test-utils/helpers/data";

export default class PollFixture extends BaseFixture<"poll"> {
    protected defaults = (seed: number) => ({
        title: str({ length: LONG_TITLE_MAX, seed }),
        closesAt: maybe(() => date({ seed }), { seed }),
        choices: strArr({ arrLength: MAX_POLL_CHOICES, seed, strLength: LIST_MAX }),
        method: enumValue(PollMethod, { seed }),
        voterIdentityMethod: enumValue(VoterIdentityMethod, { seed }),
        majorityWinner: boolean({ seed }),
    });

    constructor(db: Database) {
        super(db, "poll");
    }
}
