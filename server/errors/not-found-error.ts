import DomainError from "~~/server/errors/domain-error";

export default class NotFoundError extends DomainError {
    constructor(message: string, logMessage: string) {
        super(message, logMessage);
        this.name = "NotFoundError";
    }
}
