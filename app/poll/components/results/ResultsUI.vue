<script setup lang="ts">
import PollInfoBox from "~/poll/components/vote/PollInfoBox.vue";
import type { Poll } from "~/poll/types";
import EmptyResults from "~/poll/components/results/EmptyResults.vue";
import ResultsHeader from "~/poll/components/results/ResultsHeader.vue";
import { ICON_INFO } from "~/core/constants/icons.constant";
import ResultsBarChart from "~/poll/components/results/ResultsBarChart.vue";

defineProps<{ poll: Poll }>();
</script>

<template>
    <div class="w-full">
        <EmptyResults v-if="poll.turnout === 0" />
        <div v-else>
            <UAlert
                v-if="poll.majorityWinner"
                variant="subtle"
                class="mb-4"
                color="info"
                :icon="ICON_INFO"
                :title="$t('poll.needsMajority')"
            />
            <ResultsHeader :poll />
            <ResultsBarChart :poll />
        </div>
        <PollInfoBox :method="poll.method" />
    </div>
</template>
