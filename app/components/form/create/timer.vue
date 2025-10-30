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

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<TimerPostType>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}
</script>

<template>
    <UForm class="h-dvh overflow-auto" :schema="TimerPostSchema" :state="state" @submit="onSubmit">
        <div class="center">
            <div class="center max-w-120 gap-4 px-8 py-16 xl:w-120">
                <UFormField label="Timer Title" name="title" class="w-full" required>
                    <UInput v-model="state.title" class="w-full" />
                </UFormField>
                <UFormField label="Text-to-speech voice for reading interval titles" name="ttsVoice" class="w-full">
                    <USelect v-model="state.ttsVoice" :items="ttsVoices" class="w-full" />
                </UFormField>
                <fieldset
                    v-for="[index, interval] in state.intervals.entries()"
                    :key="index"
                    class="center w-full gap-4 rounded-md border border-elevated p-4"
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
                                            ? []
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
                        v-if="interval.beatPattern"
                        label="Beat Pattern"
                        :name="`intervals.${index}.beatPattern`"
                        required
                        class="w-full"
                    >
                        <InputBeatPattern
                            :beats="interval.beatPattern"
                            class="w-full"
                            @update:beats="value => (interval.beatPattern = value)"
                        />
                    </UFormField>
                </fieldset>
                <div class="flex gap-4">
                    <UButton
                        icon="heroicons:plus-small"
                        variant="subtle"
                        @click="
                            () => {
                                state.intervals.push({ title: '', index: 0, repeatCount: 1, duration: 10 });
                            }
                        "
                    >
                        Add interval
                    </UButton>
                    <UButton type="submit">{{ $t("ui.create") }}</UButton>
                </div>
            </div>
        </div>
    </UForm>
</template>
