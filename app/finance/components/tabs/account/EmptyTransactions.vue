<script setup lang="ts"></script>

<template>
    <div class="flex flex-col items-center justify-center rounded-xl bg-elevated p-8">
        <NuxtImg src="/images/undraw_page-eaten.svg" class="w-full max-w-48 select-none" alt="" draggable="false" />
        <span class="mt-6 block text-center">{{ $t("ui.noEntries") }}</span>
    </div>
</template>
