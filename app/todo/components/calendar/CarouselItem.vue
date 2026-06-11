<script setup lang="ts">
import { getLocalTimeZone } from "@internationalized/date";
import useLocale from "~/core/composables/useLocale";

const props = defineProps<{
    date: { day: number; toDate: (tz: string) => Date; toString: () => string };
    isActive: boolean;
}>();
const { language } = useLocale();
const day = computed(() => props.date.day.toString().padStart(2, "0"));
const weekday = computed(() =>
    new Intl.DateTimeFormat(language.value, { weekday: "short" }).format(props.date.toDate(getLocalTimeZone())),
);
</script>

<template>
    <button
        class="center relative h-22 w-16 shrink-0 cursor-pointer flex-col gap-2 rounded-2xl select-none hover:text-dimmed sm:h-25 sm:w-20"
        :data-date="props.date.toString()"
    >
        <span>{{ day }}</span>
        <span>
            {{ weekday }}
        </span>
        <Transition name="fade">
            <span
                v-if="props.isActive"
                class="absolute -top-7 left-1/2 h-26 w-16 -translate-x-1/2 after:absolute after:top-4 after:left-1/2 after:size-3 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-[''] sm:-top-6 sm:h-29 sm:w-20"
            />
        </Transition>
    </button>
</template>
