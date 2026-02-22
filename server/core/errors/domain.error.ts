export default class DomainError extends Error {
    public logMessage: string;
    constructor(message: string, logMessage: string) {
        super();
        this.name = "DomainError";
        this.message = message;
        this.logMessage = logMessage;
    }
}
