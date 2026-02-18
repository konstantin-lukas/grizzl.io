export class LoggerService {
    static readonly deps = [];

    /* c8 ignore start */
    public info(msg: string) {
        // eslint-disable-next-line
        console.log(msg);
    }

    public warn(msg: string) {
        // eslint-disable-next-line
        console.warn(msg);
    }

    public error(msg: string) {
        // eslint-disable-next-line
        console.error(msg);
    }
    /* c8 ignore stop */
}
