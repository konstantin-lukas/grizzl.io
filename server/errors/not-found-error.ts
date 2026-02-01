export default class NotFoundError extends Error {
    constructor() {
        super();
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
