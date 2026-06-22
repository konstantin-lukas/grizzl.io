import { PollMethod } from "#shared/poll/enums/method.enum";
import { date, int, intArr } from "~~/test-utils/helpers/data";
import { seed } from "~~/test-utils/playwright";

seed("insert realistic poll test data", async ({ db }) => {
    const [pluralityPoll] = await db.poll.insert(1, index => ({
        title: "Where should we go for our team lunch?",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["Pizza Place", "Sushi Bar", "Burger Joint", "Thai Restaurant"],
        method: PollMethod.PLURALITY,
        majorityWinner: false,
    }));

    await db.pollVote.insert(6, seed => ({ pollId: pluralityPoll.id, selection: [int({ min: 0, max: 3, seed })] }));

    const [approvalPoll] = await db.poll.insert(1, index => ({
        title: "Which features should be included in the next release?",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["Dark mode", "Offline support", "Push notifications", "Public API"],
        method: PollMethod.APPROVAL,
        majorityWinner: false,
    }));

    await db.pollVote.insert(2, seed => ({
        pollId: approvalPoll.id,
        selection: intArr({ min: 0, max: 3, length: int({ min: 0, max: 4, seed }), seed }),
    }));

    const [runoffPoll] = await db.poll.insert(1, index => ({
        title: "Who should host the next game night?",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["Alex", "Sam", "Jordan", "Taylor"],
        method: PollMethod.RUNOFF,
        majorityWinner: false,
    }));

    await db.pollVote.insert(24, seed => ({
        pollId: runoffPoll.id,
        selection: intArr({ unique: true, min: 0, max: 3, length: 4, seed }),
    }));

    const [scorePoll] = await db.poll.insert(1, index => ({
        title: "How should we spend the team budget?",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["New monitors", "Team outing", "Conference tickets", "Office snacks"],
        method: PollMethod.SCORE,
        majorityWinner: false,
    }));

    await db.pollVote.insert(9, seed => ({
        pollId: scorePoll.id,
        selection: intArr({ min: 1, max: 10, length: 4, seed }),
    }));

    const [positionalPoll] = await db.poll.insert(1, index => ({
        title: "Which destination should we pick for the company retreat?",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["Lisbon", "Barcelona", "Prague", "Amsterdam"],
        method: PollMethod.POSITIONAL,
        majorityWinner: false,
    }));

    await db.pollVote.insert(3, seed => ({
        pollId: positionalPoll.id,
        selection: intArr({ unique: true, min: 0, max: 3, length: 4, seed }),
    }));

    await db.poll.insert(1, index => ({
        title: "Which snack should we stock in the office? (No Votes)",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["Chips", "Granola Bars", "Fruit", "Chocolate"],
        method: PollMethod.POSITIONAL,
        majorityWinner: false,
    }));

    const [closedPoll] = await db.poll.insert(1, index => ({
        title: "What should be our next book club pick? (Closed)",
        closesAt: date({ seed: index, when: "beforeRef", refDate: new Date() }),
        choices: ["Project Hail Mary", "Dune", "The Pragmatic Programmer", "Atomic Habits"],
        method: PollMethod.POSITIONAL,
        majorityWinner: false,
    }));

    await db.pollVote.insert(3, seed => ({
        pollId: closedPoll.id,
        selection: intArr({ unique: true, min: 0, max: 3, length: 4, seed }),
    }));

    const [majorityPoll] = await db.poll.insert(1, index => ({
        title: "Who will win the World Cup? (Majority)",
        closesAt: date({ seed: index, when: "afterRef", refDate: new Date() }),
        choices: ["Spain", "Argentina", "Sweden"],
        method: PollMethod.POSITIONAL,
        majorityWinner: true,
    }));

    await db.pollVote.insert(3, seed => ({
        pollId: majorityPoll.id,
        selection: intArr({ unique: true, min: 0, max: 3, length: 4, seed }),
    }));
});

seed("insert random poll test data", async ({ db }) => {
    const [poll] = await db.poll.insert(1);

    await db.pollVote.insert(1, { pollId: poll.id });
});
