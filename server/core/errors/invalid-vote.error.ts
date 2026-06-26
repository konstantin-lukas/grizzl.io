import DomainError from "~~/server/core/errors/domain.error";

export default class InvalidVoteError extends DomainError {
    constructor(message: string, logMessage: string) {
        super(message, logMessage);
        this.name = "InvalidVoteError";
    }
}
