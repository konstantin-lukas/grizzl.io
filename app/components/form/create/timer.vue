<script setup lang="ts">
import { Beat } from "#shared/enum/timer";
import type { TimerPostType } from "#shared/schema/timer";
import { TimerPostSchema } from "#shared/schema/timer";
import { nanoid } from "nanoid";
import { VueDraggable } from "vue-draggable-plus";
import { createToastSuccess } from "~/utils/toast";

type TimerIntervalWithId = TimerPostType["intervals"][number] & {
    id: string;
};

type TimerPostWithId = Omit<TimerPostType, "intervals"> & {
    intervals: TimerIntervalWithId[];
};

const emit = defineEmits(["success"]);

const { start, finish, isLoading } = useLoadingIndicator();

const ttsVoices = ref<string[][]>([]);
const ttsVoicePreviewText = ref("");

const state = reactive<TimerPostWithId>({
    title: "",
    ttsVoice: undefined,
    intervals: [{ title: "", repeatCount: 1, duration: 2, id: nanoid() }],
});

onMounted(() => {
    if (typeof speechSynthesis === "undefined") return;
    const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        const options = [["Don't read interval titles aloud"], voices.map(v => v.name)];
        ttsVoices.value = options;
        if (!state.ttsVoice && voices.length > 0) {
            [state.ttsVoice] = options[0]!;
        }
    };
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    onBeforeUnmount(() => {
        if (typeof speechSynthesis === "undefined") return;
        speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    });
});

function saySampleText() {
    if (speechSynthesis.speaking) return;
    const utterThis = new SpeechSynthesisUtterance(ttsVoicePreviewText.value);
    for (const voice of speechSynthesis.getVoices()) {
        if (voice.name === state.ttsVoice) {
            utterThis.voice = voice;
        }
    }
    speechSynthesis.speak(utterThis);
}

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
async function onSubmit() {
    start();
    const { error } = await tryCatchApi(
        $fetch("/api/timers", {
            method: "POST",
            body: state,
        }),
    );
    if (error) {
        toast.add(createToastError(error));
        return;
    }
    emit("success");
    finish();
    toast.add(createToastSuccess("Timer created successfully."));
}
const isDragging = ref(false);
const handleEnd = () => setTimeout(() => (isDragging.value = false), 0);
</script>

<template>
    <UDrawer
        class="max-h-dvh"
        :handle-only="true"
        :ui="{
            handle: '[&>span]:!w-dvw',
            content: 'rounded-none',
        }"
    >
        <template #content>
            <UForm class="mt-0 h-dvh pt-4" :schema="TimerPostSchema" :state="state" @submit.prevent="onSubmit">
                <div ref="scroll-container" class="relative h-[calc(100dvh_-_7rem_+_2px)] overflow-auto">
                    <span
                        class="pointer-events-none fixed top-9 left-1/2 z-10 mt-[2px] h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-b from-back"
                    />
                    <span
                        class="pointer-events-none fixed bottom-18 left-1/2 z-10 h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-t from-back"
                    />
                    <div class="flex min-h-full flex-col items-center justify-start overflow-hidden">
                        <div class="center max-w-120 gap-4 px-8 pt-8 pb-12 xl:w-120">
                            <UFormField label="Timer Title" name="title" class="w-full" required>
                                <UInput v-model="state.title" class="w-full" />
                            </UFormField>
                            <UFormField
                                v-if="ttsVoices"
                                label="Text-to-speech voice for interval titles"
                                name="ttsVoice"
                                class="w-full"
                            >
                                <USelect v-model="state.ttsVoice" :items="ttsVoices" class="w-full">
                                    <template #trailing>
                                        <UTooltip
                                            text="Not all voices are available on all devices"
                                            :delay-duration="0"
                                            :content="{ side: 'right', align: 'center', sideOffset: 20 }"
                                        >
                                            <UIcon
                                                name="mdi:information-outline"
                                                tabindex="0"
                                                class="size-5 opacity-50 transition-all hover:text-front hover:opacity-100 focus:text-front focus:opacity-100"
                                            />
                                        </UTooltip>
                                    </template>
                                </USelect>
                            </UFormField>
                            <Transition name="fade">
                                <div
                                    v-if="ttsVoices.length > 0 && state.ttsVoice !== ttsVoices[0]?.[0]"
                                    class="flex w-full gap-4"
                                >
                                    <UButton icon="heroicons:speaker-wave" @click="saySampleText" />
                                    <UInput
                                        v-model="ttsVoicePreviewText"
                                        class="w-full"
                                        placeholder="Enter some text to preview the selected voice"
                                    />
                                </div>
                            </Transition>
                            <VueDraggable
                                v-model="state.intervals"
                                :animation="250"
                                class="center relative gap-4"
                                tag="div"
                                handle="[data-handle]"
                                ghost-class="ghost"
                                @start="() => (isDragging = true)"
                                @end="handleEnd"
                            >
                                <TransitionGroup name="list">
                                    <fieldset
                                        v-for="[index, interval] in state.intervals.entries()"
                                        :key="interval.id"
                                        class="group relative rounded-md border border-border-accented bg-back transition-[margin] focus-within:mb-12 sm:focus-within:mb-0"
                                        :style="{ transition: isDragging ? 'none' : '' }"
                                    >
                                        <div class="center w-full gap-4 p-4">
                                            <UFormField
                                                label="Interval Title"
                                                :name="`intervals.${index}.title`"
                                                class="w-full"
                                            >
                                                <UInput
                                                    v-model="interval.title"
                                                    class="w-full"
                                                    placeholder="Displayed during interval"
                                                />
                                            </UFormField>
                                            <UFormField
                                                label="Interval Type"
                                                :name="`intervals.${index}.type`"
                                                required
                                                class="z-1 w-full"
                                            >
                                                <USelect
                                                    :items="['Temporal', 'Rhythm']"
                                                    default-value="Temporal"
                                                    class="w-full"
                                                    :portal="false"
                                                    @update:model-value="
                                                        value => {
                                                            interval.beatPattern =
                                                                value === 'Temporal'
                                                                    ? undefined
                                                                    : [
                                                                          Beat.ACCENTED,
                                                                          Beat.NORMAL,
                                                                          Beat.NORMAL,
                                                                          Beat.NORMAL,
                                                                      ];
                                                        }
                                                    "
                                                />
                                            </UFormField>
                                            <div class="flex gap-4">
                                                <UFormField
                                                    label="Repetitions"
                                                    :name="`intervals.${index}.repeatCount`"
                                                    required
                                                    class="w-full"
                                                >
                                                    <UInputNumber
                                                        v-model="interval.repeatCount"
                                                        class="w-full"
                                                        :min="1"
                                                    />
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
                                        </div>
                                        <USeparator />
                                        <div class="relative w-full cursor-move overflow-hidden py-6" data-handle>
                                            <UIcon
                                                name="mdi:drag-horizontal"
                                                class="absolute top-1/2 left-1/2 size-12 -translate-1/2"
                                            />
                                        </div>
                                        <div
                                            class="invisible absolute left-0 mt-4 flex w-full items-center justify-center gap-4 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 sm:top-0 sm:left-full sm:mt-0 sm:ml-4 sm:w-auto sm:flex-col"
                                        >
                                            <UTooltip
                                                text="Duplicate interval"
                                                :content="{ side: 'top', sideOffset: 13 }"
                                            >
                                                <UButton
                                                    icon="heroicons:document-duplicate"
                                                    variant="subtle"
                                                    aria-label="Duplicate interval"
                                                    :disabled="state.intervals.length === 100"
                                                    @click="
                                                        () => {
                                                            if (state.intervals.length === 100) return;
                                                            const newIntervals = duplicateNthElement(
                                                                state.intervals,
                                                                index,
                                                            );
                                                            newIntervals[index + 1] = {
                                                                ...newIntervals[index + 1]!,
                                                                id: nanoid(),
                                                            };
                                                            state.intervals = newIntervals;
                                                        }
                                                    "
                                                />
                                            </UTooltip>
                                            <UTooltip
                                                text="Move interval up"
                                                :content="{ side: 'top', sideOffset: 13 }"
                                            >
                                                <UButton
                                                    icon="heroicons:arrow-small-up"
                                                    variant="subtle"
                                                    aria-label="Move interval up"
                                                    :disabled="index === 0"
                                                    @click="
                                                        () => {
                                                            state.intervals = moveElement(
                                                                state.intervals,
                                                                index,
                                                                index - 1,
                                                            );
                                                        }
                                                    "
                                                />
                                            </UTooltip>
                                            <UTooltip
                                                text="Move interval down"
                                                :content="{ side: 'top', sideOffset: 13 }"
                                            >
                                                <UButton
                                                    icon="heroicons:arrow-small-down"
                                                    variant="subtle"
                                                    aria-label="Move interval down"
                                                    :disabled="index === state.intervals.length - 1"
                                                    @click="
                                                        () => {
                                                            state.intervals = moveElement(
                                                                state.intervals,
                                                                index,
                                                                index + 1,
                                                            );
                                                        }
                                                    "
                                                />
                                            </UTooltip>
                                            <UTooltip text="Delete interval" :content="{ side: 'top', sideOffset: 13 }">
                                                <UButton
                                                    icon="heroicons:trash"
                                                    color="error"
                                                    variant="subtle"
                                                    aria-label="Delete interval"
                                                    :disabled="state.intervals.length === 1"
                                                    @click="
                                                        () => {
                                                            if (state.intervals.length === 1) return;
                                                            state.intervals = deleteNthElement(state.intervals, index);
                                                        }
                                                    "
                                                />
                                            </UTooltip>
                                        </div>
                                    </fieldset>
                                </TransitionGroup>
                            </VueDraggable>
                        </div>
                    </div>
                </div>
                <div class="flex h-18 w-full justify-center gap-4 border-t border-t-border-accented py-4">
                    <div class="flex w-120 justify-center gap-4 px-8">
                        <UButton
                            type="submit"
                            icon="ic:outline-create"
                            class="flex w-full justify-center"
                            :disabled="isLoading"
                        >
                            Erstellen
                        </UButton>
                    </div>
                </div>
            </UForm>
        </template>
        <template #title>Create a new timer</template>
        <template #description>
            Choose between different types of timer intervals to create a fully customized timer
        </template>
    </UDrawer>
</template>
