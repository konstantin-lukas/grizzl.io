import getConfig from "next/config";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();
export function Footer() {
    return (
        <footer className="h-footer-height">
            <nav className="flex h-full items-center justify-center gap-8">
                <Link className="inline-link-1" href="/legal-notice">
                    Legal Notice
                </Link>
                <Link className="inline-link-2" href="/privacy-policy">
                    Privacy Policy
                </Link>
                <Link className="inline-link-3" href="https://github.com/konstantin-lukas/grizzl.io">
                    Version {publicRuntimeConfig?.version}
                </Link>
            </nav>
        </footer>
    );
}
