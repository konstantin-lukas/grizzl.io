<script setup lang="ts">
import VoteApprovalForm from "~/poll/components/vote/VoteApprovalForm.vue";
import { PollMethod } from "#shared/poll/enums/method.enum";
import VotePluralityForm from "~/poll/components/vote/VotePluralityForm.vue";
import VoteRunoffAndPositionalForm from "~/poll/components/vote/VoteRunoffAndPositionalForm.vue";
import VoteScoreForm from "~/poll/components/vote/VoteScoreForm.vue";

const props = defineProps<{ method: PollMethod }>();
</script>

<template>
    <VoteApprovalForm v-if="props.method === PollMethod.APPROVAL" />
    <VotePluralityForm v-else-if="props.method === PollMethod.PLURALITY" />
    <VoteScoreForm v-else-if="props.method === PollMethod.SCORE" />
    <VoteRunoffAndPositionalForm v-else />
</template>
