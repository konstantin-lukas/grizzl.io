<script setup lang="ts">
defineProps<{ errors: string[] }>();
</script>

<template>
    <Transition name="fade">
        <UAlert
            v-if="errors.length > 0"
            color="error"
            role="alert"
            :title="$t('ui.formErrors', errors.length)"
            variant="subtle"
            data-test-id="form-error-digest"
            icon="heroicons:exclamation-triangle"
        >
            <template #description>
                <ul class="list-disc">
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
            </template>
        </UAlert>
    </Transition>
</template>
