import type { TypedInternalResponse } from "nitropack";

export type TodoList = TypedInternalResponse<"/api/todo/lists">[number];
export type TodoItem = TodoList["items"]["completed"][number];

export default function useTodoLists() {
    const todoLists = useState<TodoList[]>("todo-lists", () => []);

    return { todoLists };
}
