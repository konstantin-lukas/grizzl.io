export type Poll = ReturnType<typeof useFetch<void, unknown, "/api/polls/:id">>["data"]["value"];
