<script setup lang="ts">
import { ICON_CLOUD_CHECK, ICON_LOAD } from "~/core/constants/icons.constant";
import useMutationQueue from "~/todo/composables/useMutationQueue";
import useEventListener from "~/core/composables/useEventListener";

const { queue } = useMutationQueue(true);
const confirmNavigation = (event: BeforeUnloadEvent) => {
    if (queue.value.length === 0) return;
    event.preventDefault();
    event.returnValue = "";
    return "";
};

useEventListener(window, "beforeunload", confirmNavigation);
</script>

<template>
    <UIcon
        :name="queue.length === 0 ? ICON_CLOUD_CHECK : ICON_LOAD"
        class="size-5 text-muted hover-none:top-7 hover-none:right-18 hover-none:size-6"
        :class="{ 'animate-spin': queue.length > 0 }"
    />
</template>
