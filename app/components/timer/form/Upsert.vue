<script setup lang="ts">
import { COUNT_MIN, ID_LENGTH, TITLE_MAX } from "#shared/constants/data";
import { PostTimerSchema, type PutTimer, type Timer } from "#shared/schema/timer";
import { ellipsize } from "#shared/utils/string";
import type { FormErrorEvent } from "#ui/types";
import { nanoid } from "nanoid";
import { VueDraggable } from "vue-draggable-plus";
import { createToastSuccess } from "~/utils/toast";

const { initialState = null } = defineProps<{ initialState?: Timer }>();
const createNewTimer = initialState === null;
const emit = defineEmits(["success"]);
const state = reactive<PutTimer>(
    initialState
        ? {
              ...initialState,
              intervals: initialState.intervals.map(interval => ({
                  ...interval,
                  duration: interval.duration,
              })),
          }
        : {
              title: "",
              ttsVoice: null,
              intervals: [{ title: "", repeatCount: COUNT_MIN, duration: 3000, id: nanoid(), beatPattern: null }],
          },
);
const previousIntervalCount = ref(state.intervals.length);
const previousLastId = ref(state.intervals[state.intervals.length - 1]!.id);
const isDragging = ref(false);

const scrollContainer = useTemplateRef<HTMLDivElement>("scroll-container");
const { start, finish, isLoading } = useLoadingIndicator();
const toast = useToast();
const errors = ref<string[]>([]);

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

async function onSubmit() {
    start({ force: true });
    const submissionState = deepCopy(state);
    for (const interval of submissionState.intervals) {
        if (interval.id?.length !== ID_LENGTH) delete interval.id;
    }
    $fetch(createNewTimer ? "/api/timers" : `/api/timers/${initialState.id}`, {
        method: createNewTimer ? "POST" : "PUT",
        body: submissionState,
    })
        .then(() => {
            emit("success");
            toast.add(
                createToastSuccess(
                    createNewTimer ? $t("timer.toast.createdTitle") : $t("timer.toast.updatedTitle"),
                    $t(createNewTimer ? "timer.toast.createdDescription" : "timer.toast.updatedDescription", {
                        title: ellipsize(state.title, 15),
                    }),
                ),
            );
        })
        .catch(error => {
            toast.add(createToastError(error));
        })
        .finally(finish);
}

function onEnd() {
    setTimeout(() => (isDragging.value = false), 0);
}
</script>

<template>
    <UForm
        :schema="PostTimerSchema"
        :state="state"
        @submit.prevent="onSubmit"
        @error="
            (e: FormErrorEvent) => {
                errors = e.errors
                    .map(error => error.message)
                    .filter((error, index, array) => array.indexOf(error) === index);
                scrollContainer?.scrollTo({ behavior: 'smooth', top: 0 });
            }
        "
    >
        <div ref="scroll-container" class="relative h-[calc(100dvh_-_7rem_+_2px)] overflow-auto">
            <span
                class="pointer-events-none fixed top-9 left-1/2 z-10 mt-[2px] h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-b from-back"
            />
            <span
                class="pointer-events-none fixed bottom-18 left-1/2 z-10 h-8 w-[calc(100%_-_2rem)] -translate-x-1/2 bg-gradient-to-t from-back"
            />
            <div class="flex min-h-full flex-col items-center justify-start overflow-hidden">
                <div class="center max-w-120 gap-4 px-8 pt-8 pb-12 xl:w-120">
                    <Transition name="fade">
                        <UAlert
                            v-if="errors.length > 0"
                            color="error"
                            role="alert"
                            :title="$t('ui.formErrors', errors.length)"
                            variant="subtle"
                            icon="heroicons:exclamation-triangle"
                        >
                            <template #description>
                                <ul class="list-disc">
                                    <li v-for="error in errors" :key="error">{{ error }}</li>
                                </ul>
                            </template>
                        </UAlert>
                    </Transition>
                    <UFormField :label="$t('timer.form.title')" name="title" class="w-full" required>
                        <UInput v-model="state.title" class="w-full" :maxlength="TITLE_MAX" />
                    </UFormField>
                    <TimerFormVoiceSelect v-model:tts-voice="state.ttsVoice" />
                    <VueDraggable
                        v-model="state.intervals"
                        :animation="250"
                        class="center relative gap-4"
                        tag="div"
                        handle="[data-handle]"
                        ghost-class="ghost"
                        @start="() => (isDragging = true)"
                        @end="onEnd"
                    >
                        <TransitionGroup name="draggable-list">
                            <TimerFormInterval
                                v-for="(interval, index) in state.intervals"
                                :key="interval.id"
                                v-model:intervals="state.intervals"
                                :index="index"
                                :style="{ transition: isDragging ? 'none' : '' }"
                            />
                        </TransitionGroup>
                    </VueDraggable>
                </div>
            </div>
        </div>
        <div class="flex h-18 w-full justify-center gap-4 border-t border-t-border-accented py-4">
            <div class="flex w-120 justify-center gap-4 px-8">
                <Button
                    type="submit"
                    :icon="createNewTimer ? 'heroicons:plus-circle-16-solid' : 'mdi:content-save'"
                    class="flex w-full justify-center"
                    :disabled="isLoading"
                >
                    {{ createNewTimer ? $t("ui.create") : $t("ui.save") }}
                </Button>
            </div>
        </div>
    </UForm>
</template>
