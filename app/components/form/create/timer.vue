<script setup lang="ts">
import { Beat } from "#shared/enum/timer";
import type { TimerPostType } from "#shared/schema/timer";
import { TimerPostSchema } from "#shared/schema/timer";
import { deleteNthElement, duplicateNthElement } from "#shared/utils/array";
import type { FormSubmitEvent } from "@nuxt/ui";
import { nanoid } from "nanoid";

type TimerIntervalWithId = TimerPostType["intervals"][number] & {
    id: string;
};

type TimerPostWithId = Omit<TimerPostType, "intervals"> & {
    intervals: TimerIntervalWithId[];
};

const ttsVoices = ref(["Don't read section titles", "Todo", "In Progress", "Done"]);
const state = reactive<TimerPostWithId>({
    title: "",
    ttsVoice: ttsVoices.value[0],
    intervals: [{ title: "", index: 0, repeatCount: 1, duration: 2, id: nanoid() }],
});
const scrollContainer = useTemplateRef<HTMLDivElement>("scroll-container");
const previousIntervalCount = ref(state.intervals.length);
const previousLastId = ref(state.intervals[state.intervals.length - 1]!.id);

watch(state, () => {
    setTimeout(() => {
        const elementInserted = state.intervals.length > previousIntervalCount.value;
        const elementDuplicated = state.intervals[state.intervals.length - 1]!.id === previousLastId.value;
        if (scrollContainer.value !== null && elementInserted && !elementDuplicated) {
            scrollContainer.value.scrollTo({
                top: scrollContainer.value.scrollHeight,
                behavior: "smooth",
            });
            previousIntervalCount.value = state.intervals.length;
            previousLastId.value = state.intervals[state.intervals.length - 1]!.id;
        }
    }, 0);
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<TimerPostType>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}

function resetIndices(interval: (typeof state.intervals)[number], i: number) {
    return { ...interval, index: i };
}
</script>

<template>
    <UForm class="mt-0 h-dvh pt-4" :schema="TimerPostSchema" :state="state" @submit="onSubmit">
        <div ref="scroll-container" class="relative h-[calc(100dvh_-_6rem_+_2px)] overflow-auto">
            <span
                class="pointer-events-none fixed top-9 left-1/2 z-1 mt-[2px] h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-b from-back"
            />
            <span
                class="pointer-events-none fixed bottom-14 left-1/2 z-1 h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-t from-back"
            />
            <div class="center">
                <div class="center max-w-120 gap-4 px-8 pt-8 pb-12 xl:w-120">
                    <UFormField label="Timer Title" name="title" class="w-full" required>
                        <UInput v-model="state.title" class="w-full" />
                    </UFormField>
                    <UFormField label="Text-to-speech voice for reading interval titles" name="ttsVoice" class="w-full">
                        <USelect v-model="state.ttsVoice" :items="ttsVoices" class="w-full" />
                    </UFormField>
                    <TransitionGroup name="list" tag="div" class="relative flex flex-col gap-4">
                        <fieldset
                            v-for="[index, interval] in state.intervals.entries()"
                            :key="interval.id"
                            class="center w-full gap-4 rounded-md border border-border-accented p-4"
                        >
                            <UFormField label="Interval Title" :name="`intervals.${index}.title`" class="w-full">
                                <UInput
                                    v-model="interval.title"
                                    class="w-full"
                                    placeholder="Displayed during interval"
                                />
                            </UFormField>
                            <UFormField label="Interval Type" :name="`intervals.${index}.type`" required class="w-full">
                                <USelect
                                    :items="['Temporal', 'Rhythm']"
                                    default-value="Temporal"
                                    class="w-full"
                                    @update:model-value="
                                        value => {
                                            interval.beatPattern =
                                                value === 'Temporal'
                                                    ? undefined
                                                    : [Beat.ACCENTED, Beat.NORMAL, Beat.NORMAL, Beat.NORMAL];
                                        }
                                    "
                                />
                            </UFormField>
                            <div class="flex gap-4">
                                <UFormField
                                    label="Repeat Count"
                                    :name="`intervals.${index}.repeatCount`"
                                    required
                                    class="w-full"
                                >
                                    <UInputNumber v-model="interval.repeatCount" class="w-full" :min="1" />
                                </UFormField>
                                <UFormField
                                    label="Duration"
                                    :name="`intervals.${index}.duration`"
                                    required
                                    class="w-full"
                                >
                                    <UInputNumber
                                        v-model="interval.duration"
                                        class="w-full"
                                        :step="0.1"
                                        :min="1"
                                        :format-options="{ style: 'unit', unit: 'second' }"
                                    />
                                </UFormField>
                            </div>
                            <Transition name="fade">
                                <UFormField
                                    v-if="interval.beatPattern !== undefined"
                                    label="Beat Pattern"
                                    :name="`intervals.${index}.beatPattern`"
                                    required
                                    class="w-full"
                                >
                                    <InputBeatPattern
                                        :beats="interval.beatPattern"
                                        :bar-length="interval.duration"
                                        class="w-full"
                                        @update:beats="value => (interval.beatPattern = value)"
                                    />
                                </UFormField>
                            </Transition>
                            <div class="flex w-full flex-col gap-4 xs:flex-row">
                                <UButton
                                    icon="heroicons:document-duplicate"
                                    class="flex w-full justify-center"
                                    variant="subtle"
                                    @click="
                                        () => {
                                            if (state.intervals.length === 100) return;
                                            const newIntervals = duplicateNthElement(state.intervals, index).map(
                                                resetIndices,
                                            );
                                            newIntervals[index + 1]!.id = nanoid();
                                            state.intervals = newIntervals;
                                        }
                                    "
                                >
                                    Duplicate
                                </UButton>
                                <UButton
                                    icon="heroicons:trash"
                                    color="error"
                                    class="flex w-full justify-center"
                                    variant="subtle"
                                    :disabled="state.intervals.length === 1"
                                    @click="
                                        () => {
                                            if (state.intervals.length === 1) return;
                                            state.intervals = deleteNthElement(state.intervals, index).map(
                                                resetIndices,
                                            );
                                        }
                                    "
                                >
                                    Delete
                                </UButton>
                            </div>
                        </fieldset>
                    </TransitionGroup>
                </div>
            </div>
        </div>
        <div class="flex h-14 w-full justify-center gap-4 border-t border-t-border-accented py-3">
            <div class="flex w-120 justify-between px-8">
                <UTooltip text="Add interval">
                    <UButton
                        icon="heroicons:plus-small"
                        variant="subtle"
                        aria-label="Add interval"
                        @click="
                            () => {
                                if (state.intervals.length === 100) return;
                                state.intervals.push({
                                    id: nanoid(),
                                    title: '',
                                    index: 0,
                                    repeatCount: 1,
                                    duration: 10,
                                });
                            }
                        "
                    />
                </UTooltip>
                <UButton type="submit">Create</UButton>
            </div>
        </div>
    </UForm>
</template>
