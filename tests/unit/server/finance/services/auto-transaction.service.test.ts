import AutoTransactionService from "#server/finance/services/auto-transaction.service";
import { beforeEach, describe, expect, test, vi } from "vitest";
import NotFoundError from "~~/server/core/errors/not-found.error";
import { INTERNAL_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";

const accountRepositoryMock = {
    hasSubResource: vi.fn(),
};

const autoTransactionRepositoryMock = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    undelete: vi.fn(),
    transaction: (fn: () => Promise<unknown>) => fn(),
};

const categoryServiceMock = {
    upsert: vi.fn(),
};

const accountServiceMock = {
    getUserAccount: vi.fn(),
};

const autoTransactionService = new AutoTransactionService(
    autoTransactionRepositoryMock as never,
    accountRepositoryMock as never,
    categoryServiceMock as never,
    accountServiceMock as never,
);

const id = "9j3q9ohodjj3aa";
const userId = "awdk9t3j8sojfo";
const accountId = "12349ohodjj3aa";

beforeEach(() => {
    vi.resetAllMocks();
    autoTransactionRepositoryMock.update.mockResolvedValue(1);
});

describe("create", () => {
    test("calls on the transaction repository to create a new transaction when everything is in order", async () => {
        autoTransactionRepositoryMock.create.mockResolvedValueOnce(id);
        await expect(autoTransactionService.create(id, id, INTERNAL_AUTO_TRANSACTION)).resolves.toBe(id);
    });
});

describe("setDeletedStatus", () => {
    test("calls the transaction repository's delete method when deleted is true", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(true);
        await autoTransactionService.setDeletedStatus(id, userId, accountId, true);
        expect(autoTransactionRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(autoTransactionRepositoryMock.undelete).not.toHaveBeenCalled();
    });

    test("calls the transaction repository's undelete method when deleted is false", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(true);
        await autoTransactionService.setDeletedStatus(id, userId, accountId, false);
        expect(autoTransactionRepositoryMock.undelete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(autoTransactionRepositoryMock.delete).not.toHaveBeenCalled();
    });

    test("returns an error when the sub-resource doesn't exist", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(false);

        await expect(autoTransactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        accountRepositoryMock.hasSubResource.mockReturnValueOnce(true);
        autoTransactionRepositoryMock.delete.mockReturnValueOnce(0);

        await expect(autoTransactionService.setDeletedStatus(id, userId, accountId, true)).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });
});

describe("update", () => {
    test("does not throw when everything is in order", async () => {
        await expect(
            autoTransactionService.update(id, userId, accountId, INTERNAL_AUTO_TRANSACTION),
        ).resolves.not.toThrow();
    });

    test("throws a NotFoundError when the auto-transaction can't be updated", async () => {
        autoTransactionRepositoryMock.update.mockResolvedValue(0);
        await expect(
            autoTransactionService.update(id, userId, accountId, INTERNAL_AUTO_TRANSACTION),
        ).rejects.toBeInstanceOf(NotFoundError);
    });
});
