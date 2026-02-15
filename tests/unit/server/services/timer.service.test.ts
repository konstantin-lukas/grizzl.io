import { beforeEach, describe, expect, test, vi } from "vitest";
import NotFoundError from "~~/server/errors/not-found-error";
import TimerService from "~~/server/features/timer/timer.service";

const timerRepositoryMock = {
    delete: vi.fn(),
    undelete: vi.fn(),
    update: vi.fn(),
    findByUserId: vi.fn(),
    create: vi.fn(),
};

const timerService = new TimerService(timerRepositoryMock as never);

beforeEach(() => {
    vi.resetAllMocks();
});

const id = "9j3q9ohodjj3aa";
const userId = "awdk9t3j8sojfo";
const timer = {
    title: "u83u83jf0j309fj",
} as never;

describe("setDeletedStatus", () => {
    test("calls the timer repository's delete method when deleted is true", async () => {
        await timerService.setDeletedStatus(id, userId, true);
        expect(timerRepositoryMock.delete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(timerRepositoryMock.undelete).not.toHaveBeenCalled();
    });

    test("calls the timer repository's undelete method when deleted is false", async () => {
        await timerService.setDeletedStatus(id, userId, false);
        expect(timerRepositoryMock.undelete).toHaveBeenCalledExactlyOnceWith({ id, userId });
        expect(timerRepositoryMock.delete).not.toHaveBeenCalled();
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        timerRepositoryMock.delete.mockReturnValueOnce(0);

        await expect(timerService.setDeletedStatus(id, userId, true)).rejects.toBeInstanceOf(NotFoundError);
    });
});

describe("update", () => {
    test("calls the timer repository's update function", async () => {
        await timerService.update(id, userId, timer);
        expect(timerRepositoryMock.update).toHaveBeenCalledExactlyOnceWith(id, userId, timer);
    });

    test("returns an error when the repository returns 0 affected rows", async () => {
        timerRepositoryMock.update.mockReturnValueOnce(0);
        await expect(timerService.update(id, userId, timer)).rejects.toBeInstanceOf(NotFoundError);
    });

    test("does not throw an error when the repository returns null", async () => {
        timerRepositoryMock.update.mockReturnValueOnce(null);
        await expect(timerService.update(id, userId, timer)).resolves.not.toThrow();
    });
});
