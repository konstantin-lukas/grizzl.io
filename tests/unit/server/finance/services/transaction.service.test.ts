import { beforeEach, describe, expect, test, vi } from "vitest";
import InvalidAccountBalanceError from "~~/server/core/errors/invalid-account-balance.error";
import NotFoundError from "~~/server/core/errors/not-found.error";
import UnknownError from "~~/server/core/errors/unknown.error";
import TransactionService from "~~/server/finance/services/transaction.service";
import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";

const accountRepositoryMock = {
    findByUserId: vi.fn(),
    updateBalance: vi.fn(),
};

const transactionRepositoryMock = {
    findByUserId: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    undelete: vi.fn(),
    transaction: (fn: () => Promise<unknown>) => fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
});

const transactionService = new TransactionService(transactionRepositoryMock as never, accountRepositoryMock as never);
const id = "9j3q9ohodjj3aa";

describe("create", () => {
    test("throws a NotFoundError if no accounts exist for a given user", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([]);
        await expect(transactionService.create(id, id, BASE_TRANSACTION)).rejects.toThrow(NotFoundError);
    });

    test("throws an InvalidAccountBalanceError if no accounts exist for a given user", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: Number.MAX_SAFE_INTEGER, id }]);
        await expect(transactionService.create(id, id, BASE_TRANSACTION)).rejects.toThrow(InvalidAccountBalanceError);
    });

    test("throws an UnknownError if no accounts exist for a given user", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id }]);
        accountRepositoryMock.updateBalance.mockReturnValueOnce(null);
        await expect(transactionService.create(id, id, BASE_TRANSACTION)).rejects.toThrow(UnknownError);
    });

    test("calls on the transaction repository to create a new transaction if everything is in order", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id }]);
        accountRepositoryMock.updateBalance.mockReturnValueOnce(1);
        transactionRepositoryMock.create.mockReturnValueOnce(id);
        await expect(transactionService.create(id, id, BASE_TRANSACTION)).resolves.toBe(id);
    });
});

const userId = "awdk9t3j8sojfo";

describe("setDeletedStatus", () => {
    test("calls the transaction repository's delete method when deleted is true", async () => {
        await transactionService.setDeletedStatus(id, userId, true);
        expect(transactionRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(transactionRepositoryMock.undelete).not.toHaveBeenCalled();
    });

    test("calls the transaction repository's undelete method when deleted is false", async () => {
        await transactionService.setDeletedStatus(id, userId, false);
        expect(transactionRepositoryMock.undelete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(transactionRepositoryMock.delete).not.toHaveBeenCalled();
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        transactionRepositoryMock.delete.mockReturnValueOnce(0);

        await expect(transactionService.setDeletedStatus(id, userId, true)).rejects.toBeInstanceOf(NotFoundError);
    });
});
