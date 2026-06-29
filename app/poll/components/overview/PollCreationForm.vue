<script setup lang="ts">
import H1 from "~/core/components/typo/H1.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import { MAX_POLL_CHOICES, type PostPoll, PostPollSchema } from "#shared/poll/validators/poll.validator";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import { LONG_TITLE_MAX, TITLE_MAX } from "#shared/core/validators/core.validator";
import type { ZonedDateTime } from "@internationalized/date";
import { getLocalTimeZone, now } from "@internationalized/date";
import Button from "~/core/components/button/Button.vue";
import { ICON_CANCEL, ICON_PLUS } from "~/core/constants/icons.constant";
import { deleteNthElement } from "#shared/core/utils/array.util";
import useOnSubmit from "~/core/composables/useOnSubmit";

const open = defineModel<boolean>("open");
const { t } = useI18n();
const pollMethodItems = computed(() =>
    Object.values(PollMethod).map(method => ({
        label: t(`poll.method.${method}`),
        method,
    })),
);

const majorityWinnerItems = computed(() => [
    {
        label: t("poll.needsMajority"),
        value: true,
    },
    {
        label: t("poll.doesntNeedMajority"),
        value: false,
    },
]);

const votingSecurityItems = computed(() => [
    {
        label: t("poll.votingSecurityIp"),
        value: VoterIdentityMethod.IP,
    },
    {
        label: t("poll.votingSecurityCookie"),
        value: VoterIdentityMethod.COOKIE,
    },
]);

const state = reactive<Omit<PostPoll, "closesAt"> & { closesAt: string | null | undefined }>({
    method: PollMethod.RUNOFF,
    title: "",
    closesAt: null,
    majorityWinner: false,
    voterIdentityMethod: VoterIdentityMethod.IP,
    choices: ["", ""],
});

const closesAt = shallowRef<ZonedDateTime | null | undefined>(now(getLocalTimeZone()).add({ hours: 1 }));
watch(
    closesAt,
    newClosesAt => {
        if (!newClosesAt) {
            state.closesAt = newClosesAt;
            return;
        }
        state.closesAt = newClosesAt.toDate().toISOString();
    },
    { immediate: true },
);

const onSubmit = useOnSubmit({
    url: () => "/api/polls",
    method: () => "POST",
    state,
    translationKey: "poll",
    interpolations: d => ({ title: d.title }),
    onResponse: res => {
        const location = res.response.headers.get("Location");
        if (!location) {
            open.value = false;
            refreshNuxtData("/api/polls");
            return;
        }
        const pathSegments = location.split("/");
        const id = pathSegments[pathSegments.length - 1];
        navigateTo(`/poll/${id}`);
    },
});
</script>

<template>
    <Drawer v-model:open="open">
        <BaseUpsertForm :state :schema="PostPollSchema" mode="insert" @submit="onSubmit">
            <H1>{{ $t("poll.createPoll") }}</H1>
            <UFormField :label="$t('poll.title')" name="title" class="w-full" required>
                <UInput v-model="state.title" value-key="title" class="w-full" :maxlength="LONG_TITLE_MAX" />
            </UFormField>
            <UFormField :label="$t('poll.pollMethod')" name="method" class="w-full" required>
                <USelect v-model="state.method" :items="pollMethodItems" value-key="method" class="w-full" />
            </UFormField>
            <UFormField :label="$t('poll.openUntil')" name="closesAt" class="w-full">
                <UInputDate v-model="closesAt" class="w-full" :min-value="now(getLocalTimeZone()).add({ minutes: 3 })">
                    <template #trailing>
                        <UButton
                            color="neutral"
                            variant="link"
                            size="sm"
                            :icon="ICON_CANCEL"
                            :aria-label="$t('ui.clearDate')"
                            @click="closesAt = null"
                        />
                    </template>
                </UInputDate>
            </UFormField>
            <UFormField :label="$t('poll.winCondition')" name="majorityWinner" class="w-full" required>
                <USelect v-model="state.majorityWinner" :items="majorityWinnerItems" class="w-full" />
            </UFormField>
            <UFormField :label="$t('poll.votingSecurity')" name="voterIdentityMethod" class="w-full" required>
                <USelect v-model="state.voterIdentityMethod" :items="votingSecurityItems" class="w-full" />
            </UFormField>
            <div class="relative w-full">
                <TransitionGroup name="list">
                    <UFormField
                        v-for="i in state.choices.length"
                        :key="i"
                        :label="$t('poll.choiceN', i)"
                        :name="`choices.${i - 1}`"
                        class="w-full not-first-of-type:mt-4"
                        required
                    >
                        <UInput v-model="state.choices[i - 1]" class="w-full" :maxlength="TITLE_MAX">
                            <template v-if="i > 2" #trailing>
                                <UButton
                                    color="neutral"
                                    variant="link"
                                    size="sm"
                                    :icon="ICON_CANCEL"
                                    :aria-label="$t('poll.deleteChoice')"
                                    @click="state.choices = deleteNthElement(state.choices, i - 1)"
                                />
                            </template>
                        </UInput>
                    </UFormField>
                </TransitionGroup>
            </div>
            <Transition name="fade">
                <Button
                    v-if="state.choices.length < MAX_POLL_CHOICES"
                    :icon="ICON_PLUS"
                    color="neutral"
                    class="mt-4"
                    @click="state.choices.push('')"
                >
                    {{ $t("ui.add") }}
                </Button>
            </Transition>
        </BaseUpsertForm>
    </Drawer>
</template>
