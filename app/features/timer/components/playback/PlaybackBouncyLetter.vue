<script setup lang="ts">
const props = defineProps<{ isInPreparationTime: boolean; index: number; stoppedLetters: number }>();
const emit = defineEmits(["stop"]);
const bounce = ref(false);

watchEffect(() => {
    if (props.isInPreparationTime) bounce.value = true;
});
</script>

<template>
    <span
        :class="{ 'bounce-letter': bounce }"
        @animationiteration="
            () => {
                if (props.index === props.stoppedLetters) {
                    bounce = props.isInPreparationTime;
                    if (!bounce) emit('stop');
                }
            }
        "
    >
        <slot />
    </span>
</template>
