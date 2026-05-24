<script setup lang="ts">
const props = defineProps<{ skipFocus: boolean }>();

const el = ref<{ inputRef: HTMLInputElement | null }>();
onMounted(() => {
    if (!el.value?.inputRef || props.skipFocus) return;
    el.value.inputRef.focus();
    el.value.inputRef.selectionStart = 0;
    el.value.inputRef.selectionEnd = 0;
});
</script>

<template>
    <UInputMenu ref="el">
        <template #content-bottom>
            <slot name="content-bottom" />
        </template>
    </UInputMenu>
</template>
