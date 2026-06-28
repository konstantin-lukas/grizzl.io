<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_DELETE, ICON_EYE } from "~/core/constants/icons.constant";
import { formatDateTime } from "~/core/utils/date";
import useLocale from "~/core/composables/useLocale";
import type { PollMethod } from "#shared/poll/enums/method.enum";

const props = defineProps<{
    poll: { title: string; id: string; choices: string[]; closesAt: string | null; method: PollMethod };
}>();
const { language } = useLocale();
const { t } = useI18n();

const choices = computed(() => props.poll.choices.join(", "));
const openUntil = computed(() => {
    if (!props.poll.closesAt) return t("ui.notSpecified");
    if (new Date(props.poll.closesAt) < new Date()) return t("poll.alreadyClosed");
    return formatDateTime(props.poll.closesAt, language.value);
});
const method = computed(() => props.poll.method);
</script>

<template>
    <li>
        <H2> {{ props.poll.title }}</H2>
        <span class="my-1 block text-xl font-bold uppercase">{{ $t(`poll.method.${method}`) }}</span>
        <span class="line-clamp-2 text-toned">
            <b>{{ $t("poll.choices") }}: </b>
            {{ choices }}
        </span>
        <span class="line-clamp-2 flex items-center gap-1 text-toned">
            <b>{{ $t("poll.openUntil") }}: </b>
            <ClientOnly>
                {{ openUntil }}
                <template #fallback>
                    <USkeleton class="h-5 w-full max-w-36" />
                </template>
            </ClientOnly>
        </span>

        <div class="mt-3 flex gap-4">
            <Button :icon="ICON_EYE" :to="`/poll/${props.poll.id}`">{{ $t("ui.view") }}</Button>
            <Button :icon="ICON_DELETE" color="error">{{ $t("ui.delete") }}</Button>
        </div>
    </li>
</template>
