export class LoggerService {
    static readonly deps = [];

    /* c8 ignore start */
    public info(msg: string) {
        // eslint-disable-next-line
        console.log(msg);
    }

    public error(msg: string) {
        // eslint-disable-next-line
        console.error(msg);
    }
    /* c8 ignore stop */
}
