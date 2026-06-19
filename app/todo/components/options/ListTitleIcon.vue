<script setup lang="ts">
import CategoryIconSelect from "~/core/components/form/CategoryIconSelect.vue";
import { useOpenList } from "~/todo/composables/useOpenList";
import useDeferredValue from "~/core/composables/useDeferredValue";
import { onResponseError } from "~/core/utils/toast";
import { TITLE_MAX } from "#shared/core/validators/core.validator";

const { title, icon, id } = useOpenList();
const listTitle = useDeferredValue(title, 500, value => value === "");

const listIcon = ref(icon.value);
const { t } = useI18n();
const toast = useToast();

const handleListChange = (newIcon: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    icon.value = newIcon;
    $fetch(`/api/todo/lists/${id.value}`, {
        body: {
            title: newTitle,
            icon: newIcon,
        },
        method: "PUT",
        onResponseError: onResponseError(toast, t),
    });
};
</script>

<template>
    <UInput
        v-model="listTitle"
        :aria-label="$t('todo.aria.listName')"
        :maxlength="TITLE_MAX"
        class="grow"
        :color="listTitle.trim().length === 0 ? 'error' : 'primary'"
        data-test-id="list-options-title-input"
    />
    <div class="absolute top-1/2 right-0 -translate-y-1/2 hover-none:right-1">
        <CategoryIconSelect
            v-model="listIcon"
            :category-name="listTitle"
            class="scale-75 hover-none:scale-80"
            @suggestion="handleListChange"
            @select="handleListChange"
        />
    </div>
</template>
