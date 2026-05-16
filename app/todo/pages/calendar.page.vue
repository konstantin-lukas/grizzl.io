<script setup lang="ts">
import { ICON_RETURN } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
</script>

<template>
    <Wrapper>
        <Button
            :icon="ICON_RETURN"
            variant="ghost"
            color="neutral"
            class="fixed top-4 right-4 flex size-10 justify-center hover-none:size-12"
            :aria-label="$t('ui.goBack')"
            data-test-id="go-back-button"
            to="/todo"
        />
    </Wrapper>
</template>
