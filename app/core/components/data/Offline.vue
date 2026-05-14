<script setup lang="ts">
import useOnlineStatus from "~/core/composables/useOnlineStatus";
import { ICON_PLUG_OFF } from "~/core/constants/icons.constant";

const isOnline = useOnlineStatus();
</script>

<template>
    <Transition name="fade-pure">
        <UBadge
            v-if="!isOnline"
            role="alert"
            color="error"
            class="text-md fixed top-5 left-18 z-41 hover-none:top-5.25 hover-none:left-20 hover-none:text-lg"
            variant="soft"
            data-test-id="offline-banner"
            :icon="ICON_PLUG_OFF"
        >
            <span data-test-id="offline-banner-title">{{ $t("ui.offline") }}</span>
        </UBadge>
    </Transition>
</template>
