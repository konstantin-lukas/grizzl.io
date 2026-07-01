<script setup lang="ts">
import EmptyCard from "~/core/components/data/EmptyCard.vue";
import { ICON_VOTE } from "~/core/constants/icons.constant";
</script>

<template>
    <EmptyCard
        class="mt-4"
        :icon="ICON_VOTE"
        title-translation-key="poll.emptyTitle"
        description-translation-key="poll.emptyDescription"
    />
</template>
