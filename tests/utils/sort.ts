export function sortByCreatedAt(arr: { createdAt: Date | string }[], order: "asc" | "desc" = "asc") {
    arr.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return order === "asc" ? dateA - dateB : dateB - dateA;
    });
}
