<script setup lang="ts">
import { ICON_VOTE } from "~/core/constants/icons.constant";
import EmptyCard from "~/core/components/data/EmptyCard.vue";
</script>

<template>
    <EmptyCard
        :icon="ICON_VOTE"
        title-translation-key="poll.emptyTitle"
        description-translation-key="poll.emptyDescription"
    />
</template>
