export type TodoList = ReturnType<typeof useFetch<void, unknown, "/api/todo/lists">>["data"]["value"][number];

export default function useTodoLists() {
    const { data } = useFetch("/api/todo/lists");
    return data;
}
