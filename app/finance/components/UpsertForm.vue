<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { deepCopy } from "#shared/core/utils/object.util";
import { ellipsize } from "#shared/core/utils/string.util";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { type PostAccount, PostAccountSchema } from "#shared/finance/validators/account.validator";
import { useToast } from "#ui/composables";
import DrawerForm from "~/core/components/form/DrawerForm.vue";
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
                    $t("finance.toast.createdTitle"),
                    $t("finance.toast.createdDescription", {
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
        <DrawerForm :schema="PostAccountSchema" :state="state" mode="insert" @submit.prevent="onSubmit">
            <template #default>
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
            </template>
        </DrawerForm>
        <template #title>{{ $t("finance.aria.drawer.create") }}</template>
        <template #description>{{ $t("finance.aria.drawer.description") }}</template>
    </Drawer>
</template>
