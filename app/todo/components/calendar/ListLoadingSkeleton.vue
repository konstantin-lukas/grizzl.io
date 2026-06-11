<script setup lang="ts"></script>

<template>
    <div class="mt-16">
        <div class="mb-8 flex items-center gap-4">
            <USkeleton class="size-12 shrink-0 rounded-full" />
            <USkeleton class="h-8 w-full" />
        </div>
        <div v-for="i in 3" :key="i" class="mt-6 flex items-center gap-4">
            <USkeleton class="size-4.5 rounded-sm" />
            <USkeleton class="h-3.5 w-full rounded-sm" :style="{ maxWidth: ((9 * (i + 1)) % 7) + 6 + 'rem' }" />
        </div>
        <USeparator class="mt-6" />
        <div v-for="i in 2" :key="i" class="mt-6 flex items-center gap-4">
            <USkeleton class="size-4.5 rounded-sm" />
            <USkeleton class="h-3.5 w-full rounded-sm" :style="{ maxWidth: ((9 * (i + 1)) % 7) + 6 + 'rem' }" />
        </div>
    </div>
</template>
