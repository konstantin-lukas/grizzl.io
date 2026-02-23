<template>
    <UDrawer
        class="max-h-dvh"
        :handle-only="true"
        :ui="{
            handle: '[&>span]:!w-dvw',
            content: 'rounded-none',
        }"
    >
        <template #content>
            <div class="mt-0 h-dvh pt-4" data-test-id="drawer">
                <slot />
            </div>
        </template>
        <template #title><slot name="title" /></template>
        <template #description><slot name="description" /></template>
    </UDrawer>
</template>
