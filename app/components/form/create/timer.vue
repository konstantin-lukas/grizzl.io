<script setup lang="ts">
import { Beat } from "#shared/enum/timer";
import type { TimerPostType } from "#shared/schema/timer";
import { TimerPostSchema } from "#shared/schema/timer";
import type { FormSubmitEvent } from "@nuxt/ui";

const ttsVoices = ref(["Don't read section titles", "Todo", "In Progress", "Done"]);
const state = reactive<TimerPostType>({
    title: "",
    ttsVoice: ttsVoices.value[0],
    intervals: [{ title: "", index: 0, repeatCount: 1, duration: 10 }],
});
const scrollContainer = useTemplateRef<HTMLDivElement>("scroll-container");
const previousIntervalCount = ref(state.intervals.length);

watch(state, () => {
    setTimeout(() => {
        if (scrollContainer.value !== null && state.intervals.length > previousIntervalCount.value) {
            scrollContainer.value.scrollTo({
                top: scrollContainer.value.scrollHeight,
                behavior: "smooth",
            });
            previousIntervalCount.value = state.intervals.length;
        }
    }, 0);
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<TimerPostType>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}
</script>

<template>
    <UForm class="h-[calc(100dvh_-_6rem)] pt-4" :schema="TimerPostSchema" :state="state" @submit="onSubmit">
        <div ref="scroll-container" class="relative max-h-[calc(100%_-_4rem)] overflow-auto">
            <span
                class="pointer-events-none fixed top-9 left-1/2 z-1 h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-b from-back"
            />
            <span
                class="pointer-events-none fixed bottom-16 left-1/2 z-1 h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-t from-back"
            />
            <div class="center">
                <div class="center max-w-120 gap-4 px-8 pt-8 pb-12 xl:w-120">
                    <UFormField label="Timer Title" name="title" class="w-full" required>
                        <UInput v-model="state.title" class="w-full" />
                    </UFormField>
                    <UFormField label="Text-to-speech voice for reading interval titles" name="ttsVoice" class="w-full">
                        <USelect v-model="state.ttsVoice" :items="ttsVoices" class="w-full" />
                    </UFormField>
                    <fieldset
                        v-for="[index, interval] in state.intervals.entries()"
                        :key="index"
                        class="center w-full gap-4 rounded-md border border-border-accented p-4"
                    >
                        <UFormField label="Interval Title" :name="`intervals.${index}.title`" class="w-full">
                            <UInput v-model="interval.title" class="w-full" placeholder="Displayed during interval" />
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
                            <UFormField label="Duration" :name="`intervals.${index}.duration`" required class="w-full">
                                <UInputNumber
                                    v-model="interval.duration"
                                    class="w-full"
                                    :min="1"
                                    :format-options="{ style: 'unit', unit: 'second' }"
                                />
                            </UFormField>
                        </div>
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
                    </fieldset>
                    <div
                        class="fixed bottom-0 z-2 flex w-full justify-center gap-4 border-t border-t-border-accented bg-back py-4"
                    >
                        <div class="flex w-120 justify-between px-8">
                            <UTooltip text="Add interval">
                                <UButton
                                    icon="heroicons:plus-small"
                                    variant="subtle"
                                    aria-label="Add interval"
                                    @click="
                                        () => {
                                            state.intervals.push({ title: '', index: 0, repeatCount: 1, duration: 10 });
                                        }
                                    "
                                />
                            </UTooltip>
                            <UButton type="submit">{{ $t("ui.create") }}</UButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UForm>
</template>
