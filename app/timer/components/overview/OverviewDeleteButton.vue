<script setup lang="ts">
import { ellipsize } from "#shared/core/utils/string.util";
import Button from "~/core/components/button/Button.vue";
import useSoftDelete from "~/core/composables/useSoftDelete";
import { ICON_DELETE } from "~/core/constants/icons.constant";

const props = defineProps<{ timer: { id: string; title: string } | undefined }>();
const apiRoute = computed(() => `/api/timers/${props.timer?.id}`);
const interpolations = computed(() => ({
    title: ellipsize(props.timer?.title ?? "", 15),
}));
const execute = useSoftDelete(apiRoute, {
    refresh: async () => {
        await refreshNuxtData("/api/timers");
    },
    successTitle: "timer.toast.deletedTitle",
    successDescription: "timer.toast.deletedDescription",
    interpolations,
});
</script>

<template>
    <Button
        data-test-id="timer-list-item-delete-button"
        :aria-label="$t('ui.delete')"
        color="error"
        variant="subtle"
        :icon="ICON_DELETE"
        :on-async-click="execute"
    />
</template>
