import getConfig from "next/config";
import Link from "next/link";

import { getDictionary } from "@util/server/translation";

const { publicRuntimeConfig } = getConfig();
export async function Footer() {
    const trans = await getDictionary("footer");
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
