<script setup lang="ts">
import H1 from "~/core/components/typo/H1.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import PollListItem from "~/poll/components/overview/PollListItem.vue";

const { data: polls } = await useFetch("/api/polls");
</script>

<template>
    <Wrapper class="max-w-xl">
        <H1>Manage Your Polls</H1>
        <ul>
            <PollListItem v-for="poll in polls" :key="poll.id" :poll class="mt-8" />
        </ul>
    </Wrapper>
</template>
