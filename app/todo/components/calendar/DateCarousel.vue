<script setup lang="ts">
import CarouselItem from "~/todo/components/calendar/CarouselItem.vue";
import { type CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import useScreenSize from "~/core/composables/useScreenSize";

const emit = defineEmits<{ (e: "update", date: CalendarDate): void }>();

const targetLength = 6;
const refDate = ref(today(getLocalTimeZone()));
const { sm } = useScreenSize();
const selectedIndex = ref(targetLength);
const disableTransition = ref(false);
const dates = computed(() =>
    Array.from({ length: 2 * targetLength + 1 }).map((_, i) => refDate.value.add({ days: i - targetLength })),
);
const transform = computed(() => `translateX(${-(selectedIndex.value - targetLength) * (sm.value ? 5 : 4)}rem)`);
const handleTransitionEnd = () => {
    refDate.value = dates.value[selectedIndex.value]!;
    selectedIndex.value = targetLength;
    disableTransition.value = true;
};
</script>

<template>
    <div
        class="relative mx-auto -mt-4 flex max-w-xl justify-center overflow-hidden pt-4 before:pointer-events-none before:absolute before:top-0 before:left-0 before:z-1 before:h-full before:w-30 before:bg-linear-to-l before:from-back/0 before:to-back before:content-[''] after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-30 after:bg-linear-to-r after:from-back/0 after:to-back after:content-[''] sm:before:w-50 sm:after:w-50"
    >
        <div
            class="flex"
            :class="{ 'transition-transform': !disableTransition }"
            :style="{ transform }"
            @transitionend="handleTransitionEnd"
        >
            <CarouselItem
                v-for="(date, index) in dates"
                :key="date.toString()"
                :date="date"
                :is-active="selectedIndex === index"
                @click="
                    emit('update', date);
                    disableTransition = false;
                    selectedIndex = index;
                "
            />
        </div>
    </div>
</template>
