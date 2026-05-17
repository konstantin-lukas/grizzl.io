<script setup lang="ts">
import { ICON_CLOUD_CHECK, ICON_LOAD } from "~/core/constants/icons.constant.ts";
import useMutationQueue from "~/todo/composables/useMutationQueue";

const { queue } = useMutationQueue();
</script>

<template>
    <UIcon
        :name="queue.length === 0 ? ICON_CLOUD_CHECK : ICON_LOAD"
        class="fixed top-6.5 right-16 size-5 text-muted hover-none:top-7 hover-none:right-18 hover-none:size-6"
        :class="{ 'animate-spin': queue.length > 0 }"
    />
</template>
