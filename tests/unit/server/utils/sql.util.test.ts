import { beforeEach, expect, test, vi } from "vitest";
import { purgeAll } from "~~/server/utils/sql.util";

const timerPurgeMock = vi.fn();

vi.mock("~~/server/features/timer/repositories/timer.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = timerPurgeMock;
                tableName = "timer";
            },
        ),
    };
});

const consoleErrorSpy = vi.spyOn(console, "error");
const consoleLogSpy = vi.spyOn(console, "log");

beforeEach(() => {
    vi.resetAllMocks();
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
