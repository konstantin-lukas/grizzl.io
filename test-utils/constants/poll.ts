import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";

export const BASE_POLL = {
    title: "What is your favorite color?",
    closesAt: new Date("2100-12-31T00:00:00Z"),
    choices: ["Green", "Blue", "Yellow", "Orange", "Red"],
    method: PollMethod.APPROVAL,
    majorityWinner: false,
    voterIdentityMethod: VoterIdentityMethod.COOKIE,
};

export const FULL_POLL = {
    ...BASE_POLL,
    id: "VbvbykXQUeBBs5n8",
    userId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("1999-12-31"),
    deleted: false,
    votes: [[0, 1], [0, 3, 2], [4]],
};
