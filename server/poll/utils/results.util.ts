type Vote = number[];

export function getPositionalResults(votes: Vote[], choiceCount: number) {
    const results = Array<number>(choiceCount).fill(0);

    for (const vote of votes) {
        for (const [position, choice] of vote.entries()) {
            results[choice]! += choiceCount - position;
        }
    }

    return results;
}

export function getApprovalOrPluralityResults(votes: Vote[], choiceCount: number) {
    const results = new Array<number>(choiceCount).fill(0);
    for (const vote of votes) {
        for (const choice of vote) {
            results[choice]!++;
        }
    }
    return results;
}

export function getScoreResults(votes: Vote[], choiceCount: number) {
    const results = new Array<number>(choiceCount).fill(0);
    for (const vote of votes) {
        for (const [index, choice] of vote.entries()) {
            if (results[index] === undefined) continue;
            results[index] += choice;
        }
    }
    return results;
}

export function getInstantRunoffResults(votes: Vote[], choiceCount: number) {
    const remainingVotes = votes.map(vote => [...vote]);
    const results = new Array<number>(choiceCount).fill(0);
    const eliminated = new Array<boolean>(choiceCount).fill(false);
    if (votes.length === 0) return results;

    // DISTRIBUTE FIRST CHOICES
    for (const vote of remainingVotes) {
        const [firstChoice] = vote;
        results[firstChoice!]!++;
    }

    // FIND THE FEWEST VOTES OF CANDIDATES STILL IN THE RACE
    for (let round = 0; round < choiceCount; round++) {
        // A: CHECK IF A SINGLE CANDIDATE HAS A MAJORITY; IF SO QUIT
        // B: FIND THE FEWEST AMOUNT OF VOTES OF NON-ELIMINATED CANDIDATES
        let fewestPossibleVotes = remainingVotes.length;
        for (const [index, result] of results.entries()) {
            if (result > remainingVotes.length / 2) return results;
            if (result < fewestPossibleVotes && !eliminated[index]) fewestPossibleVotes = result;
        }

        // GET THE INDICES OF THE CANDIDATES WITH FEWEST VOTES
        const losers = [];
        for (const index of results.keys()) {
            if (results[index] === fewestPossibleVotes) losers.push(index);
        }

        // REDISTRIBUTE VOTES FOR THE CANDIDATE(S) IN LAST PLACE
        for (let remainingVote of remainingVotes.values()) {
            if (remainingVote.length === 0) continue;
            let offset = 1;

            const index = losers.findIndex(loser => loser === remainingVote[0]);
            if (index === -1) continue;

            while (remainingVote.length > offset + 1 && eliminated[remainingVote[offset] ?? -1]) {
                offset++;
            }

            const nextPreference = remainingVote[offset];
            const loser = losers[index];
            results[nextPreference!]!++;
            results[loser!]!--;
            remainingVote = remainingVote.slice(offset);
        }

        // ELIMINATE CANDIDATES WHO WERE ELIMINATED
        for (const loser of losers) {
            eliminated[loser] = true;
        }
    }

    return results;
}
