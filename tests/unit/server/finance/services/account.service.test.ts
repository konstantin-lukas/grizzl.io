import { beforeEach, describe, expect, test, vi } from "vitest";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AccountService from "~~/server/finance/services/account.service";

const accountRepositoryMock = {
    delete: vi.fn(),
    undelete: vi.fn(),
    update: vi.fn(),
    findByUserId: vi.fn(),
    create: vi.fn(),
};

const accountService = new AccountService(accountRepositoryMock as never);

beforeEach(() => {
    vi.resetAllMocks();
});

const id = "9j3q9ohodjj3aa";
const userId = "awdk9t3j8sojfo";
const account = {
    title: "u83u83jf0j309fj",
} as never;

describe("setDeletedStatus", () => {
    test("calls the account repository's delete method when deleted is true", async () => {
        await accountService.setDeletedStatus(id, userId, true);
        expect(accountRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(accountRepositoryMock.undelete).not.toHaveBeenCalled();
    });

    test("calls the account repository's undelete method when deleted is false", async () => {
        await accountService.setDeletedStatus(id, userId, false);
        expect(accountRepositoryMock.undelete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(accountRepositoryMock.delete).not.toHaveBeenCalled();
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        accountRepositoryMock.delete.mockReturnValueOnce(0);

        await expect(accountService.setDeletedStatus(id, userId, true)).rejects.toBeInstanceOf(NotFoundError);
    });
});

describe("update", () => {
    test("calls the account repository's update function", async () => {
        await accountService.update(id, userId, account);
        expect(accountRepositoryMock.update).toHaveBeenCalledExactlyOnceWith(id, userId, account);
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        accountRepositoryMock.update.mockReturnValueOnce(0);
        await expect(accountService.update(id, userId, account)).rejects.toBeInstanceOf(NotFoundError);
    });

    test("does not throw an error when the repository returns null", async () => {
        accountRepositoryMock.update.mockReturnValueOnce(null);
        await expect(accountService.update(id, userId, account)).resolves.not.toThrow();
    });
});
