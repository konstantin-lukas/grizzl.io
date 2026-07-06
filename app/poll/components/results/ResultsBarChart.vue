<script setup lang="ts">
import BarChart from "~/core/components/chart/BarChart.vue";
import type { Poll } from "~/poll/types";
import { COLOR_PRIMARY_DARK_MODE, COLOR_PRIMARY_LIGHT_MODE } from "~/core/constants/colors.constant";
import useScreenSize from "~/core/composables/useScreenSize";

const props = defineProps<{ poll: Poll }>();
const colorMode = useColorMode();
const { sm } = useScreenSize();
const datasets = computed(() => [
    {
        data: props.poll.results,
    },
]);

const colors = computed(() => [colorMode.value === "dark" ? COLOR_PRIMARY_DARK_MODE : COLOR_PRIMARY_LIGHT_MODE]);
</script>

<template>
    <ClientOnly>
        <div
            class="mt-12 sm:max-h-80 portrait:h-[75dvh]"
            :style="{ height: (sm ? 50 : props.poll.choices.length * 5) + 'dvh' }"
        >
            <BarChart :datasets="datasets" :labels="poll.choices" :colors />
        </div>
        <template #placeholder>
            <USkeleton class="mt-12 h-80 w-full" />
        </template>
    </ClientOnly>
</template>
