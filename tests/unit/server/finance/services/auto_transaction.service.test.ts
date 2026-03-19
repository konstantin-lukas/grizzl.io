import { beforeEach, describe, expect, test, vi } from "vitest";
import NotFoundError from "~~/server/core/errors/not-found.error";
import AutoTransactionService from "~~/server/finance/services/auto_transaction.service";
import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";

const accountRepositoryMock = {
    findByUserId: vi.fn(),
};

const autoTransactionRepositoryMock = {
    findByUserId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    undelete: vi.fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
});

const autoTransactionService = new AutoTransactionService(
    autoTransactionRepositoryMock as never,
    accountRepositoryMock as never,
);
const id = "9j3q9ohodjj3aa";
const userId = "awdk9t3j8sojfo";
const accountId = "12349ohodjj3aa";

describe("create", () => {
    test("throws a NotFoundError if no accounts exist for a given user", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([]);
        await expect(autoTransactionService.create(id, id, BASE_AUTO_TRANSACTION)).rejects.toThrow(NotFoundError);
    });

    test("calls on the transaction repository to create a new transaction if everything is in order", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id }]);
        autoTransactionRepositoryMock.create.mockReturnValueOnce(id);
        await expect(autoTransactionService.create(id, id, BASE_AUTO_TRANSACTION)).resolves.toBe(id);
    });
});

describe("setDeletedStatus", () => {
    test("calls the transaction repository's delete method when deleted is true", async () => {
        await autoTransactionService.setDeletedStatus(id, userId, true);
        expect(autoTransactionRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(autoTransactionRepositoryMock.undelete).not.toHaveBeenCalled();
    });

    test("calls the transaction repository's undelete method when deleted is false", async () => {
        await autoTransactionService.setDeletedStatus(id, userId, false);
        expect(autoTransactionRepositoryMock.undelete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(autoTransactionRepositoryMock.delete).not.toHaveBeenCalled();
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        autoTransactionRepositoryMock.delete.mockReturnValueOnce(0);

        await expect(autoTransactionService.setDeletedStatus(id, userId, true)).rejects.toBeInstanceOf(NotFoundError);
    });
});

describe("update", () => {
    test("does not throw if everything is in order", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id: accountId }]);
        autoTransactionRepositoryMock.update.mockReturnValueOnce(1);
        await expect(
            autoTransactionService.update(id, userId, accountId, BASE_AUTO_TRANSACTION),
        ).resolves.not.toThrow();
    });

    test("throws a NotFoundError if the account can't be found", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id }]);
        await expect(
            autoTransactionService.update(id, userId, accountId, BASE_AUTO_TRANSACTION),
        ).rejects.toBeInstanceOf(NotFoundError);
    });
});
