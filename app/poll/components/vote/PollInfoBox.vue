<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import type { PollMethod } from "#shared/poll/enums/method.enum";
defineProps<{ method: PollMethod }>();
</script>

<template>
    <div class="mt-20 mb-12 w-full">
        <H2>{{ $t("poll.pollExplanationHeading") }}</H2>
        <p class="my-2">{{ $t(`poll.voting.${method}.explanation`) }}</p>
        <span class="text-muted">
            <b>{{ $t("poll.bestFor") }}: </b>{{ $t(`poll.voting.${method}.bestFor`) }}
        </span>
    </div>
</template>
