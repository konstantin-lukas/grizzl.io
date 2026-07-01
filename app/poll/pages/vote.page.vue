<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import { formatDateTime } from "~/core/utils/date";
import useLocale from "~/core/composables/useLocale";
import { fromDate, toCalendarDateTime } from "@internationalized/date";
import { TIMEZONE_COOKIE_NAME } from "#shared/core/constants/cookie.constant";
import Button from "~/core/components/button/Button.vue";
import { ICON_EYE, ICON_VOTE } from "~/core/constants/icons.constant";
import CopyToClipboardButton from "~/poll/components/CopyToClipboardButton.vue";
import VotingUI from "~/poll/components/vote/VotingUI.vue";
import ResultsUI from "~/poll/components/results/ResultsUI.vue";
import H2 from "~/core/components/typo/H2.vue";

const route = useRoute();
const timezone = useCookie(TIMEZONE_COOKIE_NAME);

const id = computed(() => route.params.id as string);
const { language } = useLocale();

const { data } = await useFetch(`/api/polls/${id.value}`);
if (!data.value) {
    throw createError({
        statusCode: 404,
        statusMessage: `Page not found: /poll/${id.value}`,
    });
}

const poll = data.value;

const { t } = useI18n();

useHead({
    title: `${poll.title} | ${t("meta.grizzl")} - ${t("meta.tagline")}`,
    meta: [
        { name: "description", content: t("todo.meta.description") },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "theme-color", content: "#047857" },
    ],
});

const openUntil = computed(() => {
    const tz = timezone.value;
    if (!poll.closesAt || !tz) return null;

    const parsedDate = toCalendarDateTime(fromDate(new Date(poll.closesAt), tz));
    return formatDateTime(parsedDate, language.value);
});

const isClosed = computed(() => (poll.closesAt ? new Date(poll.closesAt) < new Date() : false));

const showResults = ref(poll.hasUserVoted);
</script>

<template>
    <Wrapper>
        <div class="flex flex-col items-center gap-2">
            <H1 class="line-clamp-3 text-center">{{ poll.title }}</H1>
            <span class="text-xl uppercase">{{ $t(`poll.method.${poll.method}`) }}</span>
            <span class="flex items-center gap-1" :class="isClosed ? 'text-error' : 'text-muted'" v-if="openUntil">
                {{ $t(`poll.openUntil`) }}: {{ openUntil }}
            </span>
            <div class="mt-4 flex gap-4">
                <CopyToClipboardButton />
                <Button
                    color="neutral"
                    :icon="ICON_VOTE"
                    v-if="!poll.hasUserVoted && showResults"
                    @click="showResults = false"
                >
                    {{ $t("poll.vote") }}
                </Button>
                <Button color="neutral" :icon="ICON_EYE" v-else-if="!poll.hasUserVoted" @click="showResults = true">
                    {{ $t("poll.seeResults") }}
                </Button>
            </div>
            <ResultsUI v-if="showResults" />
            <VotingUI v-else :method="poll.method" />
        </div>
        <UCard class="mt-4">
            <H2>{{ $t("poll.pollExplanationHeading") }}</H2>
            <p class="my-2">{{ $t(`poll.voting.${poll.method}.explanation`) }}</p>
            <span class="text-muted">
                <b>{{ $t("poll.bestFor") }}: </b>{{ $t(`poll.voting.${poll.method}.bestFor`) }}
            </span>
        </UCard>
    </Wrapper>
</template>
