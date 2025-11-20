<script setup lang="ts">
import { PostTimerSchema, type PutTimer, type Timer } from "#shared/schema/timer";
import { nanoid } from "nanoid";
import { VueDraggable } from "vue-draggable-plus";
import { createToastSuccess } from "~/utils/toast";

const { initialState = null } = defineProps<{ initialState?: Timer }>();
const emit = defineEmits(["success"]);
const state = reactive<PutTimer>(
    initialState
        ? {
              ...initialState,
              intervals: initialState.intervals.map(interval => ({
                  ...interval,
                  duration: Math.floor(interval.duration / 1000),
              })),
          }
        : {
              title: "",
              ttsVoice: null,
              intervals: [{ title: "", repeatCount: 1, duration: 2, id: nanoid(), beatPattern: null }],
          },
);
const previousIntervalCount = ref(state.intervals.length);
const previousLastId = ref(state.intervals[state.intervals.length - 1]!.id);
const isDragging = ref(false);

const scrollContainer = useTemplateRef<HTMLDivElement>("scroll-container");
const { start, finish, isLoading } = useLoadingIndicator();
const toast = useToast();

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
    for (const interval of state.intervals) {
        if (interval.id?.length !== 16) delete interval.id;
    }
    const createNewTimer = initialState === null;
    $fetch(createNewTimer ? "/api/timers" : `/api/timers/${initialState.id}`, {
        method: createNewTimer ? "POST" : "PUT",
        body: state,
    })
        .then(() => {
            emit("success");
            finish();
            toast.add(
                createToastSuccess(createNewTimer ? "Timer created successfully." : "Timer updated successfully."),
            );
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}

function onEnd() {
    setTimeout(() => (isDragging.value = false), 0);
}
</script>

<template>
    <UForm :schema="PostTimerSchema" :state="state" @submit.prevent="onSubmit" @error="error => console.log(error)">
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
                        <UInput v-model="state.title" class="w-full" :maxlength="100" />
                    </UFormField>
                    <FormTimerVoiceSelect v-model:tts-voice="state.ttsVoice" />
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
                            <FormTimerInterval
                                v-for="[index, interval] in state.intervals.entries()"
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
                    icon="heroicons:plus-circle-16-solid"
                    class="flex w-full justify-center"
                    :disabled="isLoading"
                >
                    Erstellen
                </Button>
            </div>
        </div>
    </UForm>
</template>
