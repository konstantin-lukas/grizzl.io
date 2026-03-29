import UnknownError from "#server/core/errors/unknown.error";
import CategoryService from "#server/finance/services/category.service";
import { describe, expect, test, vi } from "vitest";

const categoryRepositoryMock = {
    upsert: vi.fn(),
};
const categoryService = new CategoryService(categoryRepositoryMock as never);

describe("upsert", () => {
    test.each([
        [[], 0],
        [[{ id: "" }, { id: "" }], 2],
    ])("throws an Unknown error when the amount of upserted categories is $1", async categories => {
        categoryRepositoryMock.upsert.mockReturnValueOnce(categories);
        await expect(categoryService.upsert("", "", "" as never)).rejects.toBeInstanceOf(UnknownError);
    });

    test("returns the upserted category's ID when exactly one category was upserted", async () => {
        categoryRepositoryMock.upsert.mockReturnValueOnce([{ id: "123" }]);
        await expect(categoryService.upsert("", "", "" as never)).resolves.toBe("123");
    });
});
