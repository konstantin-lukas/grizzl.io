<script setup lang="ts">
import { ICON_CLOUD_CHECK, ICON_LOAD } from "~/core/constants/icons.constant";
import useMutationQueue from "~/todo/composables/useMutationQueue";

const { queue } = useMutationQueue(false);
</script>

<template>
    <div
        class="center size-5 overflow-hidden rounded-full hover-none:size-6"
        :class="{ 'animate-spin': queue.length > 0 }"
    >
        <UIcon
            :name="queue.length === 0 ? ICON_CLOUD_CHECK : ICON_LOAD"
            :data-test-id="queue.length === 0 ? 'is-syncing' : 'is-not-syncing'"
            class="center size-5 scale-105 text-muted hover-none:size-6"
        />
    </div>
</template>
