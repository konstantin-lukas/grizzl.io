<script lang="ts" setup>
const { centerVertically = false } = defineProps<{ centerVertically?: boolean }>();
</script>

<template>
    <div
        class="mx-auto min-h-main-height max-w-240 px-8 py-main-padding"
        :class="{ 'flex items-center': centerVertically }"
    >
        <slot />
    </div>
</template>
