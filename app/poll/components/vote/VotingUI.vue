<script setup lang="ts">
import VoteApprovalForm from "~/poll/components/vote/VoteApprovalForm.vue";
import { PollMethod } from "#shared/poll/enums/method.enum";
import VotePluralityForm from "~/poll/components/vote/VotePluralityForm.vue";
import VoteRunoffAndPositionalForm from "~/poll/components/vote/VoteRunoffAndPositionalForm.vue";
import VoteScoreForm from "~/poll/components/vote/VoteScoreForm.vue";
import type { Poll } from "~/poll/types";
import H2 from "~/core/components/typo/H2.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_VOTE } from "~/core/constants/icons.constant";
import PollInfoBox from "~/poll/components/vote/PollInfoBox.vue";
import { onResponseError } from "~/core/utils/toast";

const props = defineProps<{ poll: Poll }>();
const emit = defineEmits(["success"]);

const initialSelection = (() => {
    if (props.poll.method === PollMethod.APPROVAL) return [];
    if (props.poll.method === PollMethod.SCORE)
        return Array.from({ length: props.poll.choices.length }).fill(1) as number[];
    if (props.poll.method === PollMethod.RUNOFF || props.poll.method === PollMethod.POSITIONAL)
        return props.poll.choices.map((_, i) => i) as number[];
    return null;
})();

const selection = ref(initialSelection);
const toast = useToast();
const { t } = useI18n();
const { start, finish, isLoading } = useLoadingIndicator();

const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (selection.value === null) return;
    start();
    await $fetch(`/api/polls/${props.poll.id}/votes`, {
        method: "POST",
        body: { selection: selection.value },
        onResponseError: onResponseError(toast, t),
    }).finally(finish);

    emit("success");
};

const voteFormComponents = {
    [PollMethod.APPROVAL]: VoteApprovalForm,
    [PollMethod.PLURALITY]: VotePluralityForm,
    [PollMethod.SCORE]: VoteScoreForm,
    [PollMethod.RUNOFF]: VoteRunoffAndPositionalForm,
    [PollMethod.POSITIONAL]: VoteRunoffAndPositionalForm,
} satisfies Record<PollMethod, Component>;

const voteFormComponent = computed(() => voteFormComponents[props.poll.method]);

const disableSubmitButton = computed(() => selection.value === null);
</script>

<template>
    <div class="w-full">
        <form class="w-full" autocomplete="off" @submit="onSubmit">
            <H2>{{ $t(`poll.voting.${poll.method}.action`) }}</H2>
            <component
                :is="voteFormComponent"
                v-if="voteFormComponent === VotePluralityForm || selection !== null"
                v-model:selection="selection"
                :poll="poll"
            />
            <Button
                :disabled="disableSubmitButton || isLoading"
                type="submit"
                class="mt-10 flex w-full justify-center"
                size="xl"
                :icon="ICON_VOTE"
            >
                {{ $t("poll.vote") }}
            </Button>
        </form>
        <PollInfoBox :method="poll.method" />
    </div>
</template>
