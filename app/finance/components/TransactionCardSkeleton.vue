<script setup lang="ts"></script>
<template>
    <USkeleton
        class="mt-4 flex h-18 w-full items-center justify-between rounded-xl bg-elevated pr-2 pl-3 sm:h-21 sm:px-4"
    >
        <div class="flex w-full items-center">
            <USkeleton class="size-12 shrink-0 rounded-full bg-accented not-sm:scale-90" />
            <div class="mr-4 ml-3 flex w-full max-w-30 flex-col gap-3">
                <USkeleton class="h-5 w-full bg-accented" />
                <USkeleton class="h-5 w-[calc(100%-1.5rem)] bg-accented" />
            </div>
        </div>
        <div class="flex w-full items-center gap-4 xs:w-40 sm:w-44">
            <USkeleton class="h-6 w-full bg-accented" />
            <div class="flex gap-2 not-sm:flex-col sm:gap-4">
                <USkeleton class="size-6 bg-accented" />
                <USkeleton class="size-6 bg-accented" />
            </div>
        </div>
    </USkeleton>
</template>
