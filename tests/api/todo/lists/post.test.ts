import { BASE_LIST } from "~~/test-utils/constants/todo";
import { expect, test } from "~~/test-utils/playwright";
import { makeTodoListTestBuilder } from "~~/test-utils/playwright/builders/todo";

const testBuilder = makeTodoListTestBuilder("post");

testBuilder
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .ignoresAnyProvidedIdForDeterminingOwnership()
    .rejectsRequestsWhenPayloadIsInvalid()
    .acceptsRequestsWhenPayloadIsValid()
    .build();

test("returns a 409 error when the user tries to create more todo lists than allowed", async ({ request, db }) => {
    await db.todoList.insert(100);
    const response = await request.post("/api/todo/lists", { data: BASE_LIST });
    expect(response.status()).toBe(409);
});

test("does not allow creating more todo lists than allowed through concurrent requests", async ({ request, db }) => {
    await db.todoList.insert(99);
    await Promise.all(Array.from({ length: 20 }).map(() => request.post("/api/todo/lists", { data: BASE_LIST })));

    const lists = await db.todoList.select();
    expect(lists).toHaveLength(100);
});
