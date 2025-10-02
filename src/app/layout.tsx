import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "next-themes";
import { Jost, Noto_Sans_JP } from "next/font/google";
import type { ReactNode } from "react";

import "@app/globals.css";

import RegisterSW from "@component/config/RegisterSW";
import InstallButton from "@component/interaction/InstallButton";
import LoadingIndicator from "@component/interaction/LoadingIndicator";
import Main from "@component/layout/Main";
import { Footer } from "@component/navigation/Footer";
import Menu from "@component/navigation/Menu";
import HeroUIProvider from "@component/provider/HeroUIProvider";
import LoadingStateProvider from "@component/provider/LoadingStateProvider";
import SessionProvider from "@component/provider/SessionProvider";

import { getDictionary, getLocaleFromRequest } from "@util/server/translation";

export const metadata: Metadata = {
    title: "Grizzl - The Bear That Does It All",
    icons: {
        icon: [
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    appleWebApp: {
        title: "Grizzl",
    },
};

const jost = Jost({
    subsets: ["latin", "latin-ext"],
    display: "swap",
    weight: ["400", "700"],
});

const noto = Noto_Sans_JP({
    subsets: ["latin", "latin-ext"],
    display: "swap",
    weight: ["400", "700"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession();
    const menuTranslation = await getDictionary("menu");
    const uiTranslation = await getDictionary("ui");
    const locale = await getLocaleFromRequest();
    return (
        <html
            lang={locale}
            suppressHydrationWarning={true}
            className={locale === "ja-JP" ? noto.className : jost.className}
            data-test-id="root"
        >
            <body className="antialiased">
                <SessionProvider basePath="/auth">
                    <HeroUIProvider locale={locale}>
                        <ThemeProvider attribute="data-color-scheme" enableSystem={true}>
                            <LoadingStateProvider>
                                <RegisterSW />
                                <Menu
                                    signedIn={!!session}
                                    translation={{ ...menuTranslation, ...uiTranslation }}
                                    locale={locale}
                                >
                                    <InstallButton />
                                    <Main>{children}</Main>
                                    <Footer />
                                    <LoadingIndicator />
                                </Menu>
                            </LoadingStateProvider>
                        </ThemeProvider>
                    </HeroUIProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
