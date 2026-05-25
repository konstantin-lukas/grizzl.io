import DomainError from "~~/server/core/errors/domain.error";

export default class OutOfBoundsError extends DomainError {
    constructor(message: string, logMessage: string) {
        super(message, logMessage);
        this.name = "OutOfBoundsError";
    }
}
