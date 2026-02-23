import { beforeEach, expect, test, vi } from "vitest";
import { resetContainer } from "~~/server/core/utils/di.util";
import { purgeAll } from "~~/server/core/utils/sql.util";

const timerPurgeMock = vi.fn();
let isSoftDeletable = true;

vi.mock("~~/server/timer/repositories/timer.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = timerPurgeMock;
                tableName = "timer";
                isSoftDeletable: boolean;

                constructor() {
                    this.isSoftDeletable = isSoftDeletable;
                }
            },
        ),
    };
});

const consoleErrorSpy = vi.spyOn(console, "error");
const consoleWarnSpy = vi.spyOn(console, "warn");
const consoleLogSpy = vi.spyOn(console, "log");

beforeEach(() => {
    vi.resetAllMocks();
    resetContainer();
    isSoftDeletable = true;
});

test("calls purge on all soft-deletable repositories", async () => {
    timerPurgeMock.mockReturnValueOnce(Promise.resolve(0));
    await purgeAll({ maxAge: 0 });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledExactlyOnceWith('Successfully deleted 0 rows while purging table "timer".');
    expect(timerPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
});

test("logs an error for each purge that was unsuccessful", async () => {
    timerPurgeMock.mockReturnValueOnce(Promise.reject(new Error("Yikes!")));
    await purgeAll({ maxAge: 0 });
    expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith(
        'An error occurred while trying to purge table "timer": Yikes!',
    );
    expect(timerPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
});

test("logs an error when purge returned null or undefined", async () => {
    timerPurgeMock.mockReturnValueOnce(Promise.resolve(null));
    await purgeAll({ maxAge: 0 });
    expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith(
        'An error occurred while trying to purge table "timer". Expected a number of deleted rows but got "null".',
    );
    expect(timerPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
});

test("logs an error and returns when an entity is not soft-deletable", async () => {
    isSoftDeletable = false;
    await purgeAll({ maxAge: 0 });

    expect(timerPurgeMock).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledExactlyOnceWith(
        'Attempting to purge table that is not soft-deletable: "timer".',
    );
});
