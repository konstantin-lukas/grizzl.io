export type TodoList = ReturnType<typeof useFetch<void, unknown, "/api/todo/lists">>["data"]["value"][number];
export type TodoItem = TodoList["items"]["completed"][number];

export default function useTodoLists() {
    const todoLists = useState<TodoList[]>("todo-lists", () => []);

    return { todoLists };
}
