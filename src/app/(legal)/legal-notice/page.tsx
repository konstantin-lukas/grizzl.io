import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import WrapperSmall from "@components/layout/WrapperSmall";
import H1 from "@components/typography/H1";
import H2 from "@components/typography/H2";

export const metadata: Metadata = {
    title: "Privacy Policy - Grizzl",
};

function P({ children }: { children: ReactNode }) {
    return <p className="mb-4">{children}</p>;
}

export default function Page() {
    return (
        <WrapperSmall>
            <div className="desktop:min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] min-h-[calc(100dvh-var(--footer-height))] py-24">
                <H1>Impressum</H1>
                <P>
                    {process.env.LEGAL_RESPONSIBLE_ENTITY}
                    <br />
                    {process.env.LEGAL_STREET}
                    <br />
                    {process.env.LEGAL_ZIP_AND_CITY}
                </P>
                <H2>Contact Information</H2>
                <P>
                    Phone: {process.env.LEGAL_PHONE}
                    <br />
                    Email:{" "}
                    <Link href={`mailto:${process.env.LEGAL_EMAIL}`} className="inline-link inline-link-resting">
                        {process.env.LEGAL_EMAIL}
                    </Link>
                    <br />
                </P>
            </div>
        </WrapperSmall>
    );
}
