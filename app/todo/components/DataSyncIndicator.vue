<script setup lang="ts">
import { ICON_CLOUD_CHECK, ICON_LOAD } from "~/core/constants/icons.constant.ts";

const isLoading = ref(false);
</script>

<template>
    <UIcon
        :name="isLoading ? ICON_LOAD : ICON_CLOUD_CHECK"
        class="fixed top-6.5 right-16 size-5 opacity-60 hover-none:top-7 hover-none:right-18 hover-none:size-6"
        :class="{ 'animate-spin': isLoading }"
    />
</template>
