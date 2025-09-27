import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "next-themes";
import { Jost } from "next/font/google";
import type { ReactNode } from "react";

import "@app/globals.css";

import RegisterSW from "@component/config/RegisterSW";
import InstallButton from "@component/interaction/InstallButton";
import Main from "@component/layout/Main";
import { Footer } from "@component/navigation/Footer";
import Menu from "@component/navigation/Menu";
import HeroUIProvider from "@component/provider/HeroUIProvider";
import SessionProvider from "@component/provider/SessionProvider";

import { getLocaleFromRequest } from "@util/server/translation";

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
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "700"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession();
    const locale = await getLocaleFromRequest();
    console.log(locale);
    return (
        <html lang="en" suppressHydrationWarning={true} className={jost.className} data-test-id="root">
            <body className="antialiased">
                <SessionProvider basePath="/auth">
                    <HeroUIProvider>
                        <ThemeProvider attribute="data-color-scheme" enableSystem={true}>
                            <RegisterSW />
                            <Menu signedIn={!!session}>
                                <InstallButton />
                                <Main>{children}</Main>
                                <Footer locale={locale} />
                            </Menu>
                        </ThemeProvider>
                    </HeroUIProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
