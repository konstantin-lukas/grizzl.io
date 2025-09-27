import getConfig from "next/config";
import Link from "next/link";

import type { Locale } from "@type/i18n";

import { getDictionary } from "@util/server/translation";

const { publicRuntimeConfig } = getConfig();
export async function Footer({ locale }: { locale: Locale }) {
    const trans = await getDictionary(locale, "footer");
    return (
        <footer className="h-footer-height">
            <nav className="flex h-full items-center justify-center gap-8">
                <Link className="inline-link-1" href="/legal-notice">
                    {trans.legalNotice}
                </Link>
                <Link className="inline-link-2" href="/privacy-policy">
                    {trans.privacyPolicy}
                </Link>
                <Link className="inline-link-3" href="https://github.com/konstantin-lukas/grizzl.io">
                    {trans.version} {publicRuntimeConfig?.version}
                </Link>
            </nav>
        </footer>
    );
}
