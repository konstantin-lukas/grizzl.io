<script setup lang="ts">
import { ellipsize } from "#shared/core/utils/string.util";
import useSoftDelete from "~/core/composables/useSoftDelete";
import Button from "~/core/components/button/Button.vue";

const props = defineProps<{ timer: { id: string; title: string } | undefined }>();
const execute = useSoftDelete(`/api/timers/${props.timer?.id}`, {
    refresh: async () => {
        await refreshNuxtData("/api/timers");
    },
    successTitle: "timer.toast.deletedTitle",
    successDescription: "timer.toast.deletedDescription",
    interpolations: { title: ellipsize(props.timer?.title ?? "", 15) },
});
</script>

<template>
    <Button
        data-test-id="timer-list-item-delete-button"
        :aria-label="$t('ui.delete')"
        color="error"
        variant="subtle"
        icon="heroicons:trash"
        :on-async-click="execute"
    />
</template>
