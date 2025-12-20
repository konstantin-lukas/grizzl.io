<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
definePageMeta({
    title: "privacy.title",
});
</script>

<template>
    <LayoutWrapper>
        <div class="py-24">
            <div class="mb-8">
                <TypoH1>{{ $t("privacy.title") }}</TypoH1>
            </div>

            <TypoH2>{{ $t("privacy.section1Title") }}</TypoH2>

            <TypoH3>{{ $t("privacy.section1GeneralInfo") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section1GeneralInfoText") }}</p>

            <TypoH3>{{ $t("privacy.section1DataCollection") }}</TypoH3>

            <TypoH4>{{ $t("privacy.section1Responsible") }}</TypoH4>
            <p class="mb-4">{{ $t("privacy.section1ResponsibleText") }}</p>

            <TypoH4>{{ $t("privacy.section1HowCollect") }}</TypoH4>
            <p class="mb-4">{{ $t("privacy.section1HowCollectText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section1HowCollectText2") }}</p>

            <TypoH4>{{ $t("privacy.section1Use") }}</TypoH4>
            <p class="mb-4">{{ $t("privacy.section1UseText") }}</p>

            <TypoH4>{{ $t("privacy.section1Rights") }}</TypoH4>
            <p class="mb-4">{{ $t("privacy.section1RightsText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section1RightsText2") }}</p>

            <TypoH2>{{ $t("privacy.section2Title") }}</TypoH2>
            <p class="mb-4">{{ $t("privacy.section2HostingIntro") }}</p>

            <TypoH3>Strato</TypoH3>
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

            <TypoH4>{{ $t("privacy.section2OrderProcessing") }}</TypoH4>
            <p class="mb-4">{{ $t("privacy.section2OrderProcessingText") }}</p>

            <TypoH2>{{ $t("privacy.section3Title") }}</TypoH2>

            <TypoH3>{{ $t("privacy.section3DataProtection") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3DataProtectionText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3DataProtectionText2") }}</p>
            <p class="mb-4">{{ $t("privacy.section3DataProtectionText3") }}</p>

            <TypoH3>{{ $t("privacy.section3ResponsibleNotice") }}</TypoH3>
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

            <TypoH3>{{ $t("privacy.section3StorageDuration") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3StorageDurationText") }}</p>

            <TypoH3>{{ $t("privacy.section3LegalBases") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3LegalBasesText") }}</p>

            <TypoH3>{{ $t("privacy.section3Recipients") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3RecipientsText") }}</p>

            <TypoH3>{{ $t("privacy.section3Revocation") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3RevocationText") }}</p>

            <TypoH3>{{ $t("privacy.section3RightToObject") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3RightToObjectText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3RightToObjectText2") }}</p>

            <TypoH3>{{ $t("privacy.section3Complaint") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3ComplaintText") }}</p>

            <TypoH3>{{ $t("privacy.section3Portability") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3PortabilityText") }}</p>

            <TypoH3>{{ $t("privacy.section3Encryption") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3EncryptionText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3EncryptionText2") }}</p>

            <TypoH3>{{ $t("privacy.section3PaymentEncryption") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3PaymentEncryptionText1") }}</p>
            <p class="mb-4">{{ $t("privacy.section3PaymentEncryptionText2") }}</p>
            <p class="mb-4">{{ $t("privacy.section3PaymentEncryptionText3") }}</p>

            <TypoH3>{{ $t("privacy.section3InformationRights") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3InformationRightsText") }}</p>

            <TypoH3>{{ $t("privacy.section3Restriction") }}</TypoH3>
            <p class="mb-4">{{ $t("privacy.section3RestrictionText1") }}</p>

            <ul>
                <li>{{ $t("privacy.section3RestrictionList1") }}</li>
                <li>{{ $t("privacy.section3RestrictionList2") }}</li>
                <li>{{ $t("privacy.section3RestrictionList3") }}</li>
                <li>{{ $t("privacy.section3RestrictionList4") }}</li>
            </ul>

            <p class="mb-4">{{ $t("privacy.section3RestrictionText2") }}</p>
        </div>
    </LayoutWrapper>
</template>
