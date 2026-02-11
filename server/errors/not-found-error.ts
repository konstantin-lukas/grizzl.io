import DomainError from "~~/server/errors/domain-error";

export default class NotFoundError extends DomainError {
    constructor() {
        super();
        this.name = "NotFoundError";
    }
}
