export type TodoList = UseFetchReturnValue<"/api/todo/lists">[number];
export type TodoItem = TodoList["items"]["completed"][number];

export default function useTodoLists() {
    const todoLists = useState<TodoList[]>("todo-lists", () => []);

    return { todoLists };
}
