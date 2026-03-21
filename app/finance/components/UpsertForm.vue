<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { deepCopy } from "#shared/core/utils/object.util";
import { ellipsize } from "#shared/core/utils/string.util";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { type PostAccount, PostAccountSchema } from "#shared/finance/validators/account.validator";
import { useToast } from "#ui/composables";
import type { FormErrorEvent } from "#ui/types";
import Button from "~/core/components/button/Button.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import { createToastError, createToastSuccess } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";
import { getCurrencies } from "~/finance/utils/currency";

const state = reactive<PostAccount>({
    title: "",
    currency: "",
});

const { refresh } = useAccounts();
const toast = useToast();
const { locale } = useI18n();
const errors = ref<string[]>([]);

const currencyOptions = computed(() => getCurrencies(LOCALES.find(({ code }) => code === locale.value)!.language));

async function onSubmit() {
    const submissionState = deepCopy(state);
    $fetch("/api/finance/accounts", {
        method: "POST",
        body: submissionState,
    })
        .then(() => {
            toast.add(
                createToastSuccess(
                    $t("timer.toast.createdTitle"),
                    $t("timer.toast.createdDescription", {
                        title: ellipsize(state.title, 15),
                    }),
                ),
            );
            refresh();
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}
</script>

<template>
    <Drawer>
        <UForm
            :schema="PostAccountSchema"
            :state="state"
            @submit.prevent="onSubmit"
            @error="
                (e: FormErrorEvent) => {
                    errors = e.errors
                        .map(error => error.message)
                        .filter((error, index, array) => array.indexOf(error) === index);
                }
            "
        >
            <Transition name="fade">
                <UAlert
                    v-if="errors.length > 0"
                    color="error"
                    role="alert"
                    :title="$t('ui.formErrors', errors.length)"
                    variant="subtle"
                    data-test-id="timer-upsert-form-errors-alert"
                    icon="heroicons:exclamation-triangle"
                >
                    <template #description>
                        <ul class="list-disc">
                            <li v-for="error in errors" :key="error">{{ error }}</li>
                        </ul>
                    </template>
                </UAlert>
            </Transition>
            <UFormField :label="'Title (add translation)'" name="title" class="w-full" required>
                <UInput
                    v-model="state.title"
                    class="w-full"
                    :maxlength="TITLE_MAX"
                    data-test-id="finance-upsert-title-input"
                />
            </UFormField>
            <UFormField :label="'Currency (add translation)'" name="currency" class="w-full" required>
                <USelectMenu
                    v-model="state.currency"
                    class="w-full"
                    value-key="id"
                    :items="currencyOptions"
                    data-test-id="finance-upsert-currency-select"
                />
            </UFormField>
            <Button
                size="xl"
                type="submit"
                icon="heroicons:plus-circle-16-solid"
                class="flex w-full justify-center"
                data-test-id="finance-upsert-submit-button"
            >
                {{ $t("ui.create") }}
            </Button>
        </UForm>
        <template #title>{{ $t("timer.aria.drawer.create") }}</template>
        <template #description>{{ $t("timer.aria.drawer.description") }}</template>
    </Drawer>
</template>
