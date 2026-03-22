<script setup lang="ts">
import { generateId } from "#shared/core/utils/id.util";
import { deepCopy } from "#shared/core/utils/object.util";
import { ellipsize } from "#shared/core/utils/string.util";
import { COUNT_MIN, ID_LENGTH, TITLE_MAX, ZERO } from "#shared/core/validators/core.validator";
import { PostTimerSchema, type PutTimer, type Timer } from "#shared/timer/validators/timer.validator";
import { useToast } from "#ui/composables";
import { VueDraggable } from "vue-draggable-plus";
import Button from "~/core/components/button/Button.vue";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import H1 from "~/core/components/typo/H1.vue";
import { createToastError, createToastSuccess } from "~/core/utils/toast";
import UpsertFormInterval from "~/timer/components/upsert-form/UpsertFormInterval.vue";
import UpsertFormVoiceSelect from "~/timer/components/upsert-form/UpsertFormVoiceSelect.vue";

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
              ttsVoices: [],
              intervals: [
                  {
                      title: "",
                      repeatCount: COUNT_MIN,
                      duration: 3000,
                      preparationTime: ZERO,
                      id: `${generateId()}A`,
                      beatPattern: null,
                  },
              ],
          },
);
const previousIntervalCount = ref(state.intervals.length);
const previousLastId = ref(state.intervals[state.intervals.length - 1]!.id);
const isDragging = ref(false);
const forcedAccordionState = ref<"open" | "close" | "">("");

const formRef = ref();
const { start, finish } = useLoadingIndicator();
const toast = useToast();

watch(state, () => {
    setTimeout(() => {
        const elementInserted = state.intervals.length > previousIntervalCount.value;
        const elementDuplicated = state.intervals[state.intervals.length - 1]!.id === previousLastId.value;
        if (formRef.value.scrollContainer !== null && elementInserted && !elementDuplicated) {
            formRef.value.scrollContainer.scrollTo({
                top: formRef.value.scrollContainer.scrollHeight,
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
    <BaseUpsertForm
        ref="formRef"
        :mode="createNewTimer ? 'insert' : 'update'"
        :schema="PostTimerSchema"
        :state="state"
        @submit.prevent="onSubmit"
        @error="() => formRef.scrollContainer?.scrollTo({ behavior: 'smooth', top: 0 })"
    >
        <template #heading>
            <H1>{{ $t(`timer.aria.drawer.${createNewTimer ? "create" : "edit"}`) }}</H1>
        </template>
        <UFormField :label="$t('timer.form.title')" name="title" class="w-full" required>
            <UInput
                v-model="state.title"
                class="w-full"
                :maxlength="TITLE_MAX"
                data-test-id="timer-upsert-title-input"
            />
        </UFormField>
        <UpsertFormVoiceSelect v-model:tts-voices="state.ttsVoices" />
        <VueDraggable
            v-model="state.intervals"
            :animation="250"
            class="center relative w-full gap-4"
            tag="div"
            handle="[data-handle]"
            ghost-class="ghost"
            @start="() => (isDragging = true)"
            @end="onEnd"
        >
            <TransitionGroup name="draggable-list">
                <UpsertFormInterval
                    v-for="(interval, index) in state.intervals"
                    :key="interval.id"
                    v-model:intervals="state.intervals"
                    :index="index"
                    :expanded-override="forcedAccordionState"
                    :style="{ transition: isDragging ? 'none' : '' }"
                    @toggle="forcedAccordionState = ''"
                />
            </TransitionGroup>
        </VueDraggable>
        <template #before-submit>
            <Button
                variant="subtle"
                icon="mdi:collapse-all"
                :aria-label="$t('ui.collapseAll')"
                data-test-id="timer-upsert-collapse-button"
                @click="forcedAccordionState = 'close'"
            />
            <Button
                variant="subtle"
                icon="mdi:expand-all"
                :aria-label="$t('ui.expandAll')"
                data-test-id="timer-upsert-expand-button"
                @click="forcedAccordionState = 'open'"
            />
        </template>
    </BaseUpsertForm>
</template>
