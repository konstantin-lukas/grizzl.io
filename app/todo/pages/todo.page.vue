<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import TodoListCard from "~/todo/components/TodoListCard.vue";
import useTodoLists from "~/todo/composables/useTodoLists";
import Button from "~/core/components/button/Button.vue";
import { ICON_CALENDAR, ICON_PLUS } from "~/core/constants/icons.constant";
import EmptyCard from "~/core/components/data/EmptyCard.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import ListModal from "~/todo/components/ListModalContent.vue";
import useOnSubmit from "~/core/composables/useOnSubmit";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import useEventListener from "~/core/composables/useEventListener";
import useSoftDelete from "~/core/composables/useSoftDelete";

const route = useRoute();
const { t } = useI18n();
const { todoLists } = useTodoLists();
const { openList, title, id, refreshOpenList } = useOpenList(true);
const { data, refresh } = await useFetch("/api/todo/lists");
const { queue, isFetching, error } = useMutationQueue(false);

const resource = computed(() => `/api/todo/lists/${id.value}`);
const interpolations = computed(() => ({
    title: title.value,
}));
const softDelete = useSoftDelete(resource, {
    successTitle: "todo.toast.deletedTitle",
    successDescription: "todo.toast.deletedDescription",
    interpolations,
    refresh: async () => {
        await refresh();
        openList.value = null;
    },
});

const createTodoList = useOnSubmit({
    url: () => "/api/todo/lists",
    method: () => "POST",
    state: {
        icon: "question-mark-rounded",
    },
    skipSuccess: true,
    transform: ({ ...state }) => ({ ...state, title: t("todo.newList") }),
    translationKey: "todo",
    refresh: () => refresh(),
});

useEventListener(window, "beforeunload", (event: BeforeUnloadEvent) => {
    if (queue.value.length === 0) return;
    event.preventDefault();
    event.returnValue = "";
    return "";
});

watchEffect(() => {
    if (!data.value) return;
    todoLists.value = data.value;
});

watch(error, () => {
    refresh().then(refreshOpenList);
});

watch(
    [queue, isFetching, openList],
    () => {
        if (isFetching.value || queue.value.length > 0 || openList.value) return;
        refresh();
    },
    { deep: true },
);

watch(
    () => route.query.list,
    id => {
        openList.value = data.value?.find(list => list.id === id) ?? null;
    },
    { immediate: true },
);
</script>

<template>
    <Wrapper class="max-w-xl">
        <H1 class="mb-12">{{ $t("todo.mainHeading") }}</H1>
        <div class="mt-4 mb-4 flex gap-4 not-xs:flex-col">
            <Button
                class="flex w-full justify-center"
                :icon="ICON_PLUS"
                :on-async-click="createTodoList"
                data-test-id="todo-list-add-button"
            >
                {{ $t("ui.add") }}
            </Button>
            <Button class="flex w-full justify-center" :icon="ICON_CALENDAR" to="/todo/calendar">
                {{ $t("todo.calendar") }}
            </Button>
        </div>
        <USeparator />
        <ul>
            <li v-if="todoLists?.length === 0">
                <EmptyCard class="mt-4" />
            </li>
            <TransitionGroup name="list">
                <TodoListCard
                    v-for="todoList in todoLists"
                    :key="todoList.id"
                    :list="todoList"
                    @open="openList = todoList"
                />
            </TransitionGroup>
        </ul>
        <ListModal @delete-list="softDelete" />
    </Wrapper>
</template>
