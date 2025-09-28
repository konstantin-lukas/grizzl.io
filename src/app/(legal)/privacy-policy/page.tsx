import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import WrapperSmall from "@component/layout/WrapperSmall";
import H1 from "@component/typography/H1";
import H2 from "@component/typography/H2";
import H3 from "@component/typography/H3";
import H4 from "@component/typography/H4";

import { getDictionary } from "@util/server/translation";

export async function generateMetadata(): Promise<Metadata> {
    const trans = await getDictionary("privacy");
    return {
        title: `${trans.title} - Grizzl`,
    };
}

function P({ children }: { children: ReactNode }) {
    return <p className="mb-4">{children}</p>;
}

export default async function Page() {
    const trans = await getDictionary("privacy");
    const { phone, email } = await getDictionary("legal");
    return (
        <WrapperSmall>
            <div className="py-24">
                <div className="mb-8">
                    <H1>{trans.title}</H1>
                </div>
                <H2>{trans.section1Title}</H2>
                <H3>{trans.section1GeneralInfo}</H3>
                <P>{trans.section1GeneralInfoText}</P>
                <H3>{trans.section1DataCollection}</H3>
                <H4>{trans.section1Responsible}</H4>
                <P>{trans.section1ResponsibleText}</P>
                <H4>{trans.section1HowCollect}</H4>
                <P>{trans.section1HowCollectText1}</P>
                <P>{trans.section1HowCollectText2}</P>
                <H4>{trans.section1Use}</H4>
                <P>{trans.section1UseText}</P>
                <H4>{trans.section1Rights}</H4>
                <P>{trans.section1RightsText1}</P>
                <P>{trans.section1RightsText2}</P>
                <H2>{trans.section2Title}</H2>
                <P>{trans.section2HostingIntro}</P>
                <H3>Strato</H3>
                <P>{trans.section2HostingText1}</P>
                <P>
                    {trans.section2HostingText2}
                    <Link
                        href="https://www.strato.de/datenschutz/"
                        target="_blank"
                        className="inline-link-1 underline"
                        rel="noopener noreferrer"
                    >
                        https://www.strato.de/datenschutz/
                    </Link>
                    .
                </P>
                <P>{trans.section2HostingText3}</P>
                <H4>{trans.section2OrderProcessing}</H4>
                <P>{trans.section2OrderProcessingText}</P>
                <H2>{trans.section3Title}</H2>
                <H3>{trans.section3DataProtection}</H3>
                <P>{trans.section3DataProtectionText1}</P>
                <P>{trans.section3DataProtectionText2}</P>
                <P>{trans.section3DataProtectionText3}</P>
                <H3>{trans.section3ResponsibleNotice}</H3>
                <P>{trans.section3ResponsibleNoticeText1}</P>
                <P>
                    {process.env.LEGAL_RESPONSIBLE_ENTITY}
                    <br />
                    {process.env.LEGAL_STREET}
                    <br />
                    {process.env.LEGAL_ZIP_AND_CITY}
                </P>
                <P>
                    {phone}: {process.env.LEGAL_PHONE}
                    <br />
                    {email}:{" "}
                    <Link href={`mailto:${process.env.LEGAL_EMAIL}`} className="inline-link-1 underline">
                        {process.env.LEGAL_EMAIL}
                    </Link>
                    <br />
                </P>
                <P>{trans.section3ResponsibleNoticeText2}</P>
                <H3>{trans.section3StorageDuration}</H3>
                <P>{trans.section3StorageDurationText}</P>
                <H3>{trans.section3LegalBases}</H3>
                <P>{trans.section3LegalBasesText}</P>
                <H3>{trans.section3Recipients}</H3>
                <P>{trans.section3RecipientsText}</P>
                <H3>{trans.section3Revocation}</H3>
                <P>{trans.section3RevocationText}</P>
                <H3>{trans.section3RightToObject}</H3>
                <P>{trans.section3RightToObjectText1}</P>
                <P>{trans.section3RightToObjectText2}</P>
                <H3>{trans.section3Complaint}</H3>
                <P>{trans.section3ComplaintText}</P>
                <H3>{trans.section3Portability}</H3>
                <P>{trans.section3PortabilityText}</P>
                <H3>{trans.section3Encryption}</H3>
                <P>{trans.section3EncryptionText1}</P>
                <P>{trans.section3EncryptionText2}</P>
                <H3>{trans.section3PaymentEncryption}</H3>
                <P>{trans.section3PaymentEncryptionText1}</P>
                <P>{trans.section3PaymentEncryptionText2}</P>
                <P>{trans.section3PaymentEncryptionText3}</P>
                <H3>{trans.section3InformationRights}</H3>
                <P>{trans.section3InformationRightsText}</P>
                <H3>{trans.section3Restriction}</H3>
                <P>{trans.section3RestrictionText1}</P>
                <ul>
                    <li>{trans.section3RestrictionList1}</li>
                    <li>{trans.section3RestrictionList2}</li>
                    <li>{trans.section3RestrictionList3}</li>
                    <li>{trans.section3RestrictionList4}</li>
                </ul>
                <P>{trans.section3RestrictionText2}</P>
            </div>
        </WrapperSmall>
    );
}
