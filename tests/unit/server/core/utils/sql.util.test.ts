import { beforeEach, expect, test, vi } from "vitest";
import { resetContainer } from "~~/server/core/utils/di.util";
import { purgeAll } from "~~/server/core/utils/sql.util";

const timerPurgeMock = vi.fn();
const accountPurgeMock = vi.fn();
const transactionPurgeMock = vi.fn();
const autoTransactionPurgeMock = vi.fn();
const listPurgeMock = vi.fn();
const presetPurgeMock = vi.fn();
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

vi.mock("#server/finance/repositories/account.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = accountPurgeMock;
                tableName = "finance_account";
                isSoftDeletable = true;
            },
        ),
    };
});

vi.mock("#server/finance/repositories/transaction.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = transactionPurgeMock;
                tableName = "finance_transaction";
                isSoftDeletable = true;
            },
        ),
    };
});

vi.mock("#server/finance/repositories/auto-transaction.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = autoTransactionPurgeMock;
                tableName = "finance_auto_transaction";
                isSoftDeletable = true;
            },
        ),
    };
});

vi.mock("#server/todo/repositories/list.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = listPurgeMock;
                tableName = "todo_list";
                isSoftDeletable = true;
            },
        ),
    };
});

vi.mock("#server/todo/repositories/preset.repository", () => {
    return {
        default: vi.fn(
            class {
                purge = presetPurgeMock;
                tableName = "todo_preset";
                isSoftDeletable = true;
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
    accountPurgeMock.mockReturnValueOnce(Promise.resolve(0));
    transactionPurgeMock.mockReturnValueOnce(Promise.resolve(0));
    autoTransactionPurgeMock.mockReturnValueOnce(Promise.resolve(0));
    listPurgeMock.mockReturnValueOnce(Promise.resolve(0));
    presetPurgeMock.mockReturnValueOnce(Promise.resolve(0));

    await purgeAll({ maxAge: 0 });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Successfully deleted 0 rows while purging table "timer".');
    expect(consoleLogSpy).toHaveBeenCalledWith('Successfully deleted 0 rows while purging table "finance_account".');
    expect(consoleLogSpy).toHaveBeenCalledWith(
        'Successfully deleted 0 rows while purging table "finance_transaction".',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
        'Successfully deleted 0 rows while purging table "finance_auto_transaction".',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Successfully deleted 0 rows while purging table "todo_list".');
    expect(consoleLogSpy).toHaveBeenCalledWith('Successfully deleted 0 rows while purging table "todo_preset".');

    expect(consoleLogSpy).toHaveBeenCalledTimes(6);

    expect(timerPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
    expect(accountPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
    expect(transactionPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
    expect(autoTransactionPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
    expect(listPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
    expect(presetPurgeMock).toHaveBeenCalledExactlyOnceWith({ maxAge: 0 });
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
