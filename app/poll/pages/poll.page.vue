<script setup lang="ts">
import H1 from "~/core/components/typo/H1.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import PollListItem from "~/poll/components/overview/PollListItem.vue";
import EmptyCard from "~/core/components/data/EmptyCard.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";

const { data: polls } = await useFetch("/api/polls", { key: "/api/polls" });
</script>

<template>
    <Wrapper class="max-w-xl">
        <H1>{{ $t("poll.managePolls") }}</H1>
        <ul class="relative">
            <Transition name="fade">
                <li v-if="polls?.length === 0" class="mt-8">
                    <EmptyCard class="absolute top-0 left-0 w-full" />
                </li>
            </Transition>
            <TransitionGroup name="list">
                <PollListItem v-for="poll in polls" :key="poll.id" :poll class="mt-8" />
            </TransitionGroup>
        </ul>
        <Button
            class="fixed top-5 right-5"
            color="neutral"
            :icon="ICON_PLUS_CIRCLE"
            data-test-id="poll-overview-create-button"
        >
            {{ $t("ui.create") }}
        </Button>
    </Wrapper>
</template>
