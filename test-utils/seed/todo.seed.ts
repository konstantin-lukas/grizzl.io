import { TODO_LIST_MAX_LENGTH } from "#shared/finance/todo/list.validator";
import { date, maybe } from "~~/test-utils/helpers/data";
import { seed } from "~~/test-utils/playwright";

const listTitles = ["Groceries", "Chores", "Studying"] as const;
const listIcons = ["grocery", "household-supplies-outline", "book-ribbon-outline-rounded"] as const;

const listItems = [
    [
        "Bananas",
        "Watermelon",
        "Nuts",
        "Tomatoes",
        "Strawberries",
        "Porridge",
        "Apples",
        "Bread",
        "Pasta",
        "Onions",
        "Tofu",
    ],
    ["Clean Kitchen", "Vacuum", "Laundry"],
    ["Reading in French", "Homework"],
] as const;

seed("insert realistic todo test data", async ({ db }) => {
    const lists = await db.todoList.insert(3, i => ({
        title: listTitles[i],
        icon: listIcons[i],
    }));

    for (const [i, list] of lists.entries()) {
        await db.todoListItem.insert(listItems[i]!.length, j => ({
            listId: list.id,
            text: listItems[i]![j],
            scheduledFor: maybe(
                () =>
                    date({ refDate: new Date(), seed: i * j + j, days: 4 })
                        .toISOString()
                        .split("T")[0],
            ),
            index: j < 7 ? j : null,
        }));
    }

    await db.todoPreset.insert(1, {
        listId: lists[0]!.id,
        title: "Tomato Salad",
        items: ["Tomatoes", "Cucumber", "Onions", "Olive oil", "Balsamic vinegar", "Pepper", "Salt"],
    });
});

seed("insert random todo test data", async ({ db }) => {
    const [list1, list2] = await db.todoList.insert(3);

    await db.todoListItem.insert<number>(TODO_LIST_MAX_LENGTH, { listId: list1.id });
    await db.todoPreset.insert(50, { listId: list1.id });

    await db.todoListItem.insert<number>(1, { listId: list2.id });
    await db.todoPreset.insert(1, { listId: list2.id });
});
