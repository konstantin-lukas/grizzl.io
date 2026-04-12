import { beforeEach, describe, expect, test, vi } from "vitest";
import InvalidAccountBalanceError from "~~/server/core/errors/invalid-account-balance.error";
import NotFoundError from "~~/server/core/errors/not-found.error";
import UnknownError from "~~/server/core/errors/unknown.error";
import TransactionService from "~~/server/finance/services/transaction.service";
import { INTERNAL_TRANSACTION } from "~~/test-utils/constants/finance";

const accountRepositoryMock = {
    updateBalance: vi.fn(),
    hasSubResource: vi.fn(),
};

const categoryServiceMock = {
    upsert: vi.fn(),
};

const accountServiceMock = {
    getUserAccount: vi.fn(),
    updateBalance: vi.fn(),
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

const autoTransactionsServiveMock = {
    expect: vi.fn(),
};

const id = "9j3q9ohodjj3aa";
const userId = "awdk9t3j8sojfo";
const accountId = "12349ohodjj3aa";

const transactionService = new TransactionService(
    transactionRepositoryMock as never,
    accountRepositoryMock as never,
    categoryServiceMock as never,
    accountServiceMock as never,
    autoTransactionsServiveMock as never,
);

beforeEach(() => {
    vi.resetAllMocks();
    accountRepositoryMock.updateBalance.mockReturnValue(1);
    accountRepositoryMock.hasSubResource.mockReturnValue(true);
    accountServiceMock.updateBalance.mockReturnValue(1);
    accountServiceMock.getUserAccount.mockReturnValue({ balance: 0 });
    transactionRepositoryMock.create.mockReturnValue(id);
    transactionRepositoryMock.update.mockReturnValue(1);
    transactionRepositoryMock.undelete.mockReturnValue(1);
    transactionRepositoryMock.delete.mockReturnValue(1);
    transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValue(123);
});

describe("create", () => {
    test("throws an InvalidAccountBalanceError when no accounts exist for a given user", async () => {
        accountServiceMock.getUserAccount.mockReturnValue({ balance: Number.MAX_SAFE_INTEGER });
        await expect(transactionService.create(id, id, INTERNAL_TRANSACTION)).rejects.toThrow(
            InvalidAccountBalanceError,
        );
    });

    test("throws an UnknownError when no accounts exist for a given user", async () => {
        accountRepositoryMock.updateBalance.mockReturnValue(null);
        await expect(transactionService.create(id, id, INTERNAL_TRANSACTION)).rejects.toThrow(UnknownError);
    });

    test("calls on the transaction repository to create a new transaction when everything is in order", async () => {
        await expect(transactionService.create(id, accountId, INTERNAL_TRANSACTION)).resolves.toBe(id);
    });
});

describe("setDeletedStatus", () => {
    test("returns a NotFoundError when the requested resource does not belong to the specified account", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValue(false);
        await expect(transactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toThrow(NotFoundError);
    });

    test("returns a NotFoundError when the undelete operation fails", async () => {
        transactionRepositoryMock.undelete.mockReturnValue(0);
        await expect(transactionService.setDeletedStatus(id, userId, accountId, false)).rejects.toThrow(NotFoundError);
    });

    test("returns a NotFoundError when the amount can't be retrieved", async () => {
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValue(null);
        await expect(transactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toThrow(NotFoundError);
    });

    test("returns an InvalidAccountBalanceError when resulting amount is not valid", async () => {
        accountServiceMock.getUserAccount.mockReturnValue({ balance: Number.MIN_SAFE_INTEGER });
        await expect(transactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toThrow(
            InvalidAccountBalanceError,
        );
    });

    test("throws an UnknownError when the update of the account balance fails", async () => {
        accountRepositoryMock.updateBalance.mockReturnValue(0);
        await expect(transactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toThrow(UnknownError);
    });

    test("calls the delete method if everything is in order", async () => {
        await transactionService.setDeletedStatus(id, userId, accountId, true);
        expect(transactionRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId }, undefined);
    });
});

describe("update", () => {
    test("does not throw when everything is in order", async () => {
        await expect(transactionService.update(id, userId, accountId, INTERNAL_TRANSACTION)).resolves.not.toThrow();
    });

    test("throws an UnknownError when the update of the transaction fails", async () => {
        transactionRepositoryMock.update.mockReturnValue(0);
        await expect(transactionService.update(id, userId, accountId, INTERNAL_TRANSACTION)).rejects.toBeInstanceOf(
            UnknownError,
        );
    });

    test("throws an UnknownError when the update of the account balance fails", async () => {
        accountRepositoryMock.updateBalance.mockReturnValue(0);
        await expect(transactionService.update(id, userId, accountId, INTERNAL_TRANSACTION)).rejects.toBeInstanceOf(
            UnknownError,
        );
    });

    test("throws an InvalidAccountBalanceError when the resulting balance is invalid", async () => {
        accountServiceMock.getUserAccount.mockReturnValue({ balance: Number.MAX_SAFE_INTEGER });
        await expect(transactionService.update(id, userId, accountId, INTERNAL_TRANSACTION)).rejects.toBeInstanceOf(
            InvalidAccountBalanceError,
        );
    });

    test("throws a NotFoundError when the transaction can't be found", async () => {
        transactionRepositoryMock.getAmountByIdAndUserAndAccount.mockReturnValue(undefined);
        await expect(transactionService.update(id, userId, accountId, INTERNAL_TRANSACTION)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });
});
