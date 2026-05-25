<script setup lang="ts">
import { useOpenList } from "~/todo/composables/useOpenList";
import H1 from "~/core/components/typo/H1.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_OPTIONS, ICON_PLUS } from "~/core/constants/icons.constant";
import DataSyncIndicator from "~/todo/components/DataSyncIndicator.vue";
import TodoTask from "./TodoTask.vue";
import QueryModal from "~/todo/components/ListModalBase.vue";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import UAccordion from "#ui/components/Accordion.vue";
import { type SortableEvent, VueDraggable } from "vue-draggable-plus";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";

const { openList, title, completedItems, uncompletedItems, id, persistChanges, generateNewID } = useOpenList();
const { queue } = useMutationQueue();
const { t } = useI18n();

const listFullWarning = computed(() => {
    if (completedItems.value.length + uncompletedItems.value.length >= TODO_LIST_MAX_LENGTH) {
        return t("todo.tooManyItems");
    }
    return undefined;
});

const addItem = () => {
    const newId = generateNewID();
    queue.value.push({ action: "create", id: newId, listId: id.value, text: "", index: uncompletedItems.value.length });
    uncompletedItems.value.push({ id: newId, text: "", scheduledFor: null });
};

const moveItem = (event: SortableEvent & { data: { id: string } }) => {
    if (!id.value || typeof event.oldIndex !== "number" || typeof event.newIndex !== "number") return;
    queue.value.push({ action: "move", id: event.data.id, from: event.oldIndex, to: event.newIndex, listId: id.value });
};

const handleShiftFocus = async (index: number, caretPos: number, repeat = true) => {
    const target = document.querySelector(`[data-task-item]:nth-of-type(${index + 1}) [data-task-text-input]`);
    if (target instanceof HTMLInputElement) {
        target.focus();
        await nextTick();
        target.selectionStart = caretPos;
        target.selectionEnd = caretPos;
    }
    if (!repeat) return;
    setTimeout(() => handleShiftFocus(index, caretPos, false), 50);
};

watch(id, async value => {
    if (!value) return;

    await nextTick();

    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
});
</script>

<template>
    <QueryModal
        query-key="list"
        :query-value="openList?.id"
        @close="
            persistChanges();
            openList = null;
        "
    >
        <div class="p-6 pt-8">
            <H1>{{ title }}</H1>
            <div v-if="uncompletedItems.length > 0">
                <VueDraggable
                    v-model="uncompletedItems"
                    :animation="250"
                    class="mt-6"
                    tag="ul"
                    handle="[data-handle]"
                    ghost-class="ghost"
                    @end="moveItem"
                >
                    <TodoTask
                        v-for="(item, index) in uncompletedItems"
                        :key="item.id"
                        :index
                        :item
                        type="uncompleted"
                        :list-full-warning="listFullWarning"
                        :merge-warning="$t('todo.cannotMerge')"
                        @shift-focus="handleShiftFocus"
                    />
                </VueDraggable>
            </div>
            <div class="mt-2 mb-4" :class="{ 'mt-8': uncompletedItems.length === 0 }">
                <Button
                    :icon="ICON_PLUS"
                    variant="ghost"
                    class="w-full pl-6"
                    :disabled="!!listFullWarning"
                    @click="addItem"
                >
                    {{ $t("ui.add") }}
                </Button>
            </div>
            <USeparator v-if="completedItems.length > 0" />
            <Transition name="fade">
                <UAccordion
                    v-if="completedItems.length > 0"
                    :items="[{ label: $t('todo.completedItems', completedItems.length) }]"
                    :ui="{ trailingIcon: 'mr-1.5', label: 'ml-2 text-muted' }"
                >
                    <template #content>
                        <ul>
                            <TodoTask
                                v-for="(item, index) in completedItems"
                                :key="item.id"
                                :index
                                :item
                                type="completed"
                                :merge-warning="$t('todo.cannotMerge')"
                                :list-full-warning="listFullWarning"
                            />
                        </ul>
                    </template>
                </UAccordion>
            </Transition>
        </div>
        <template #header>
            <Button
                :icon="ICON_OPTIONS"
                color="neutral"
                variant="ghost"
                class="absolute top-2 left-4 aspect-square"
                :aria-label="$t('todo.aria.todoListSettings')"
            />
            <DataSyncIndicator class="absolute top-4.5 left-16 hover-none:top-5 hover-none:left-18" />
        </template>
        <template #title>{{ $t("todo.aria.modal.title") }}</template>
        <template #description>{{ $t("todo.aria.modal.description") }}</template>
    </QueryModal>
</template>
