import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import WrapperSmall from "@component/layout/WrapperSmall";
import H1 from "@component/typography/H1";
import H2 from "@component/typography/H2";

import { getDictionary } from "@util/server/translation";

export const metadata: Metadata = {
    title: "Privacy Policy - Grizzl",
};

function P({ children }: { children: ReactNode }) {
    return <p className="mb-4">{children}</p>;
}

export default async function Page() {
    const trans = await getDictionary("legal");
    return (
        <WrapperSmall>
            <div className="desktop:min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] min-h-[calc(100dvh-var(--footer-height))] py-24">
                <H1>{trans.notice}</H1>
                <P>
                    {process.env.LEGAL_RESPONSIBLE_ENTITY}
                    <br />
                    {process.env.LEGAL_STREET}
                    <br />
                    {process.env.LEGAL_ZIP_AND_CITY}
                </P>
                <H2>{trans.contact}</H2>
                <P>
                    {trans.phone}: {process.env.LEGAL_PHONE}
                    <br />
                    {trans.email}:{" "}
                    <Link href={`mailto:${process.env.LEGAL_EMAIL}`} className="inline-link inline-link-resting">
                        {process.env.LEGAL_EMAIL}
                    </Link>
                    <br />
                </P>
            </div>
        </WrapperSmall>
    );
}
