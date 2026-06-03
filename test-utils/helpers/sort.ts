export function sortByCreatedAt(arr: { createdAt: Date | string }[], order: "asc" | "desc" = "asc") {
    arr.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return order === "asc" ? dateA - dateB : dateB - dateA;
    });
}

export function sortByStringField<T extends string>(
    field: T,
    arr: { [field]: string }[],
    order: "asc" | "desc" = "desc",
) {
    arr.sort((a, b) => {
        if (order === "asc") return a[field]!.localeCompare(b[field]!);
        return b[field]!.localeCompare(a[field]!);
    });
}
