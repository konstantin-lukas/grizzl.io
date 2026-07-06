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

watchEffect(() => {
    console.log(selection.value);
});

const disableSubmitButton = computed(() => selection.value === null);
</script>

<template>
    <div class="w-full">
        <form class="w-full" autocomplete="off" @submit="onSubmit">
            <H2>{{ $t(`poll.voting.${poll.method}.action`) }}</H2>
            <VoteApprovalForm
                v-if="poll.method === PollMethod.APPROVAL && selection"
                v-model:selection="selection"
                :poll
            />
            <VotePluralityForm v-else-if="poll.method === PollMethod.PLURALITY" v-model:selection="selection" :poll />
            <VoteScoreForm
                v-else-if="poll.method === PollMethod.SCORE && selection"
                :poll
                v-model:selection="selection"
            />
            <VoteRunoffAndPositionalForm v-else :poll />
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
