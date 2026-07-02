<script setup lang="ts">
import EmptyCard from "~/core/components/data/EmptyCard.vue";
import { ICON_VOTE } from "~/core/constants/icons.constant";
import PollInfoBox from "~/poll/components/vote/PollInfoBox.vue";
import type { Poll } from "~/poll/types";

defineProps<{ poll: Poll }>();
</script>

<template>
    <div class="w-full">
        <EmptyCard
            :icon="ICON_VOTE"
            title-translation-key="poll.emptyTitle"
            description-translation-key="poll.emptyDescription"
        />
        <PollInfoBox :method="poll.method" />
    </div>
</template>
