<script setup lang="ts">
import type { Language } from "#shared/core/constants/i18n.constant";

const amount = defineModel<number>({ required: true });
const props = defineProps<{
    currency: string;
    locale: Language;
}>();

const fractionDigits = computed(() => {
    return (
        new Intl.NumberFormat(props.locale, {
            style: "currency",
            currency: props.currency,
        }).resolvedOptions().maximumFractionDigits ?? 0
    );
});

const denominator = computed(() => 10 ** fractionDigits.value);

const displayValue = computed<number | null>({
    get() {
        return amount.value / denominator.value;
    },
    set(value) {
        amount.value = Math.round((value ?? 0) * denominator.value);
    },
});
</script>

<template>
    <UInputNumber
        v-model="displayValue"
        :locale="props.locale"
        :format-options="{
            style: 'currency',
            currency: props.currency,
        }"
        :increment="false"
        :decrement="false"
    />
</template>
