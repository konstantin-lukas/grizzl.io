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

const route = useRoute();
const timezone = useCookie(TIMEZONE_COOKIE_NAME);

const id = computed(() => route.params.id as string);
const { language } = useLocale();

const { data: poll, refresh } = await useFetch(`/api/polls/${id.value}`, { key: `/api/polls/${id.value}` });
if (!poll.value) {
    throw createError({
        statusCode: 404,
        statusMessage: `Page not found: /poll/${id.value}`,
    });
}

const { t } = useI18n();

useHead({
    title: `${poll.value.title} | ${t("meta.grizzl")} - ${t("meta.tagline")}`,
    meta: [
        { name: "description", content: t("todo.meta.description") },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "theme-color", content: "#047857" },
    ],
});

const openUntil = computed(() => {
    const tz = timezone.value;
    const closesAt = poll.value?.closesAt;
    if (!closesAt || !tz) return null;

    const parsedDate = toCalendarDateTime(fromDate(new Date(closesAt), tz));
    return formatDateTime(parsedDate, language.value);
});

const isClosed = computed(() => (poll.value?.closesAt ? new Date(poll.value.closesAt) < new Date() : false));

const showResults = ref(poll.value.hasUserVoted || isClosed.value);
</script>

<template>
    <Wrapper>
        <div v-if="poll">
            <div class="flex flex-col items-center gap-2">
                <H1 class="line-clamp-3 text-center">{{ poll.title }}</H1>
                <span class="text-xl uppercase">{{ $t(`poll.method.${poll.method}`) }}</span>
                <span v-if="openUntil" class="flex items-center gap-1" :class="isClosed ? 'text-error' : 'text-muted'">
                    {{ $t(`poll.openUntil`) }}: {{ openUntil }}
                </span>
                <div class="mt-4 flex w-full justify-center gap-4 not-sm:flex-col">
                    <CopyToClipboardButton class="flex justify-center not-sm:w-full sm:min-w-60" />
                    <Button
                        v-if="!poll.hasUserVoted && showResults && !isClosed"
                        color="neutral"
                        class="flex justify-center not-sm:w-full sm:min-w-60"
                        :icon="ICON_VOTE"
                        data-test-id="toggle-ui-button"
                        @click="showResults = false"
                    >
                        {{ $t("poll.vote") }}
                    </Button>
                    <Button
                        v-else-if="!poll.hasUserVoted && !isClosed"
                        color="neutral"
                        class="flex justify-center not-sm:w-full sm:min-w-60"
                        :icon="ICON_EYE"
                        data-test-id="toggle-ui-button"
                        @click="showResults = true"
                    >
                        {{ $t("poll.seeResults") }}
                    </Button>
                </div>
            </div>
            <div class="relative mt-20 w-full">
                <Transition name="fade">
                    <ResultsUI v-if="showResults" :poll />
                    <VotingUI
                        v-else
                        :poll
                        @success="
                            refresh();
                            showResults = true;
                        "
                    />
                </Transition>
            </div>
        </div>
    </Wrapper>
</template>
