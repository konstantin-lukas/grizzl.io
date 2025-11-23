<script setup lang="ts">
const emit = defineEmits(["click"]);
const props = defineProps<{ show: boolean }>();

const isOnline = useOnlineStatus();

const ui = computed(() => {
    const baseStyle = "size-6 absolute top-1/2 left-1/2 -translate-1/2";
    return {
        leadingIcon: isOnline.value ? `text-front ${baseStyle}` : `text-back ${baseStyle}`,
    };
});
</script>

<template>
    <ClientOnly>
        <Teleport to="#back-button-portal">
            <Transition name="fade">
                <div v-if="props.show" class="fixed top-4 right-4 z-30 size-10">
                    <Button
                        icon="heroicons:arrow-uturn-left-16-solid"
                        variant="ghost"
                        color="neutral"
                        :ui
                        class="size-10"
                        aria-label="Close"
                        @click="emit('click')"
                    />
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>
