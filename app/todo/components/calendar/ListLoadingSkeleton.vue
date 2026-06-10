<script setup lang="ts"></script>

<template>
    <div class="mt-16">
        <div class="flex items-center gap-4">
            <USkeleton class="size-12 shrink-0 rounded-full" />
            <USkeleton class="h-8 w-full" />
        </div>
        <USeparator class="mt-4" />
        <div v-for="i in 10" class="mt-4 flex items-center gap-4" :key="i">
            <USkeleton class="size-5 rounded-sm" />
            <USkeleton class="h-4 w-full rounded-sm" :style="{ maxWidth: ((9 * (i + 1)) % 7) + 6 + 'rem' }" />
        </div>
    </div>
</template>
