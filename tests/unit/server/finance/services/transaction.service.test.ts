import { beforeEach, describe, expect, test, vi } from "vitest";
import InvalidAccountBalanceError from "~~/server/core/errors/invalid-account-balance.error";
import NotFoundError from "~~/server/core/errors/not-found.error";
import UnknownError from "~~/server/core/errors/unknown.error";
import TransactionService from "~~/server/finance/services/transaction.service";
import { BASE_TRANSACTION } from "~~/test-utils/constants/finance";

const accountRepositoryMock = {
    findByUserId: vi.fn(),
    updateBalance: vi.fn(),
    hasSubResource: vi.fn(),
};

const transactionRepositoryMock = {
    findByUserId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    undelete: vi.fn(),
    getAmountByIdAndUserAndAccount: vi.fn(),
    transaction: (fn: () => Promise<unknown>) => fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
});

const transactionService = new TransactionService(transactionRepositoryMock as never, accountRepositoryMock as never);
const id = "9j3q9ohodjj3aa";
const userId = "awdk9t3j8sojfo";
const accountId = "12349ohodjj3aa";

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

describe("setDeletedStatus", () => {
    test("calls the transaction repository's delete method when deleted is true", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(true);
        await transactionService.setDeletedStatus(id, userId, accountId, true);
        expect(transactionRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(transactionRepositoryMock.undelete).not.toHaveBeenCalled();
    });

    test("calls the transaction repository's undelete method when deleted is false", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(true);
        await transactionService.setDeletedStatus(id, userId, accountId, false);
        expect(transactionRepositoryMock.undelete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(transactionRepositoryMock.delete).not.toHaveBeenCalled();
    });

    test("returns an error when the sub-resource doesn't exist", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(false);

        await expect(transactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(true);
        transactionRepositoryMock.delete.mockReturnValueOnce(0);

        await expect(transactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });
});

describe("update", () => {
    test("does not throw if everything is in order", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id: accountId }]);
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValueOnce(123);
        accountRepositoryMock.updateBalance.mockReturnValueOnce(1);
        transactionRepositoryMock.update.mockReturnValueOnce(1);
        await expect(transactionService.update(id, userId, accountId, BASE_TRANSACTION)).resolves.not.toThrow();
    });

    test("throws an UnknownError if the update of the transaction fails", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id: accountId }]);
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValueOnce(123);
        accountRepositoryMock.updateBalance.mockReturnValueOnce(1);
        transactionRepositoryMock.update.mockReturnValueOnce(0);
        await expect(transactionService.update(id, userId, accountId, BASE_TRANSACTION)).rejects.toBeInstanceOf(
            UnknownError,
        );
    });

    test("throws an UnknownError if the update of the account balance fails", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id: accountId }]);
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValueOnce(123);
        accountRepositoryMock.updateBalance.mockReturnValueOnce(0);
        await expect(transactionService.update(id, userId, accountId, BASE_TRANSACTION)).rejects.toBeInstanceOf(
            UnknownError,
        );
    });

    test("throws an InvalidAccountBalanceError if the resulting balance is invalid", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: Number.MAX_SAFE_INTEGER, id: accountId }]);
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValueOnce(0);
        await expect(transactionService.update(id, userId, accountId, BASE_TRANSACTION)).rejects.toBeInstanceOf(
            InvalidAccountBalanceError,
        );
    });

    test("throws a NotFoundError if the transaction can't be found", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id: accountId }]);
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValueOnce(undefined);
        await expect(transactionService.update(id, userId, accountId, BASE_TRANSACTION)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });

    test("throws a NotFoundError if the account can't be found", async () => {
        accountRepositoryMock.findByUserId.mockReturnValueOnce([{ balance: 0, id }]);
        await expect(transactionService.update(id, userId, accountId, BASE_TRANSACTION)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });
});
