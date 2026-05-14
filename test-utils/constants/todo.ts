export const BASE_LIST_ITEM = {
    text: "Apples",
    scheduledFor: new Date("1999-12-31"),
};

export const BASE_LIST = {
    title: "Groceries",
    icon: "grocery",
    items: [BASE_LIST_ITEM],
};

export const FULL_LIST_ITEM = { ...BASE_LIST_ITEM, id: "VbvbykXQUeBBs5n8", listId: "VbvbykXQUeBBs5n8" };

export const FULL_LIST = {
    ...BASE_LIST,
    items: [FULL_LIST_ITEM],
    id: "VbvbykXQUeBBs5n8",
    userId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("1999-12-31"),
    deleted: false,
};
