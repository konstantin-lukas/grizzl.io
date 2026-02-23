<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import H2 from "~/core/components/typo/H2.vue";
import H3 from "~/core/components/typo/H3.vue";
import H4 from "~/core/components/typo/H4.vue";

const runtimeConfig = useRuntimeConfig();
</script>

<template>
    <Wrapper>
        <div class="py-24">
            <div class="mb-8">
                <H1>{{ $t("privacy.title") }}</H1>
            </div>

            <H2>{{ $t("privacy.section1Title") }}</H2>

            <H3>{{ $t("privacy.section1GeneralInfo") }}</H3>
            <p class="mb-4">{{ $t("privacy.section1GeneralInfoText") }}</p>

            <H3>{{ $t("privacy.section1DataCollection") }}</H3>

            <H4>{{ $t("privacy.section1Responsible") }}</H4>
            <p class="mb-4">{{ $t("privacy.section1ResponsibleText") }}</p>

            <H4>{{ $t("privacy.section1HowCollect") }}</H4>
            <p class="mb-4">{{ $t("privacy.section1HowCollectText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section1HowCollectText2") }}</p>

            <H4>{{ $t("privacy.section1Use") }}</H4>
            <p class="mb-4">{{ $t("privacy.section1UseText") }}</p>

            <H4>{{ $t("privacy.section1Rights") }}</H4>
            <p class="mb-4">{{ $t("privacy.section1RightsText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section1RightsText2") }}</p>

            <H2>{{ $t("privacy.section2Title") }}</H2>
            <p class="mb-4">{{ $t("privacy.section2HostingIntro") }}</p>

            <H3>Strato</H3>
            <p class="mb-4">{{ $t("privacy.section2HostingText1") }}</p>

            <p class="mb-4">
                {{ $t("privacy.section2HostingText2") }}
                <NuxtLink
                    href="https://www.strato.de/datenschutz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-link-1 underline"
                >
                    https://www.strato.de/datenschutz/ </NuxtLink
                >.
            </p>

            <p class="mb-4">{{ $t("privacy.section2HostingText3") }}</p>

            <H4>{{ $t("privacy.section2OrderProcessing") }}</H4>
            <p class="mb-4">{{ $t("privacy.section2OrderProcessingText") }}</p>

            <H2>{{ $t("privacy.section3Title") }}</H2>

            <H3>{{ $t("privacy.section3DataProtection") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3DataProtectionText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3DataProtectionText2") }}</p>
            <p class="mb-4">{{ $t("privacy.section3DataProtectionText3") }}</p>

            <H3>{{ $t("privacy.section3ResponsibleNotice") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3ResponsibleNoticeText1") }}</p>

            <p class="mb-4">
                {{ runtimeConfig.public.legalEntity }}<br />
                {{ runtimeConfig.public.legalStreet }}<br />
                {{ runtimeConfig.public.legalCity }}
            </p>

            <p class="mb-4">
                {{ $t("legal.phone") }}: {{ runtimeConfig.public.legalPhone }}<br />
                {{ $t("legal.email") }}:
                <NuxtLink :href="`mailto:${runtimeConfig.public.legalEmail}`" class="inline-link-1 underline">
                    {{ runtimeConfig.public.legalEmail }}
                </NuxtLink>
                <br />
            </p>

            <p class="mb-4">{{ $t("privacy.section3ResponsibleNoticeText2") }}</p>

            <H3>{{ $t("privacy.section3StorageDuration") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3StorageDurationText") }}</p>

            <H3>{{ $t("privacy.section3LegalBases") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3LegalBasesText") }}</p>

            <H3>{{ $t("privacy.section3Recipients") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3RecipientsText") }}</p>

            <H3>{{ $t("privacy.section3Revocation") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3RevocationText") }}</p>

            <H3>{{ $t("privacy.section3RightToObject") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3RightToObjectText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3RightToObjectText2") }}</p>

            <H3>{{ $t("privacy.section3Complaint") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3ComplaintText") }}</p>

            <H3>{{ $t("privacy.section3Portability") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3PortabilityText") }}</p>

            <H3>{{ $t("privacy.section3Encryption") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3EncryptionText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3EncryptionText2") }}</p>

            <H3>{{ $t("privacy.section3PaymentEncryption") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3PaymentEncryptionText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3PaymentEncryptionText2") }}</p>
            <p class="mb-4">{{ $t("privacy.section3PaymentEncryptionText3") }}</p>

            <H3>{{ $t("privacy.section3InformationRights") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3InformationRightsText") }}</p>

            <H3>{{ $t("privacy.section3Restriction") }}</H3>
            <p class="mb-4">{{ $t("privacy.section3RestrictionText1") }}</p>

            <ul>
                <li>{{ $t("privacy.section3RestrictionList1") }}</li>
                <li>{{ $t("privacy.section3RestrictionList2") }}</li>
                <li>{{ $t("privacy.section3RestrictionList3") }}</li>
                <li>{{ $t("privacy.section3RestrictionList4") }}</li>
            </ul>

            <p class="mb-4">{{ $t("privacy.section3RestrictionText2") }}</p>
        </div>
    </Wrapper>
</template>
