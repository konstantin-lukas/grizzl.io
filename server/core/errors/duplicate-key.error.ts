import DomainError from "~~/server/core/errors/domain.error";

export default class DuplicateKeyError extends DomainError {
    constructor(message: string, logMessage: string) {
        super(message, logMessage);
        this.name = "DuplicateKeyError";
    }
}
