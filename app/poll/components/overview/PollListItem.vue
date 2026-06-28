<script setup lang="ts">
import H2 from "~/core/components/typo/H2.vue";
import Button from "~/core/components/button/Button.vue";
import { ICON_DELETE, ICON_EYE } from "~/core/constants/icons.constant";
import { formatDateTime } from "~/core/utils/date";
import useLocale from "~/core/composables/useLocale";

const props = defineProps<{ poll: { title: string; id: string; choices: string[]; closesAt: string | null } }>();
const { language } = useLocale();

const choices = computed(() => props.poll.choices.join(", "));
const openUntil = computed(() => {
    if (!props.poll.closesAt) return "Not specified";
    return formatDateTime(props.poll.closesAt, language.value);
});
</script>

<template>
    <li>
        <H2> {{ props.poll.title }}</H2>
        <span class="my-1 block text-xl font-bold uppercase">Instant-Runoff</span>
        <span class="line-clamp-2 text-toned"><b>Choices: </b>{{ choices }}</span>
        <span class="line-clamp-2 flex items-center gap-1 text-toned">
            <b>Open Until:</b>
            <ClientOnly>
                {{ openUntil }}
                <template #fallback>
                    <USkeleton class="h-5 w-full max-w-36" />
                </template>
            </ClientOnly>
        </span>

        <div class="mt-3 flex gap-4">
            <Button :icon="ICON_EYE" :to="`/poll/${props.poll.id}`">View</Button>
            <Button :icon="ICON_DELETE" variant="subtle" color="error">Delete</Button>
        </div>
    </li>
</template>
