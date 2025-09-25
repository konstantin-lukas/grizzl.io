import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "next-themes";
import { Jost } from "next/font/google";
import type { ReactNode } from "react";

import "@app/globals.css";

import RegisterSW from "@components/config/RegisterSW";
import InstallButton from "@components/interaction/InstallButton";
import Main from "@components/layout/Main";
import { Footer } from "@components/navigation/Footer";
import Menu from "@components/navigation/Menu";
import HeroUIProvider from "@components/providers/HeroUIProvider";
import SessionProvider from "@components/providers/SessionProvider";

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
    return (
        <html lang="en" suppressHydrationWarning={true} className={jost.className}>
            <body className="antialiased">
                <SessionProvider basePath="/auth">
                    <HeroUIProvider>
                        <ThemeProvider attribute="data-color-scheme" enableSystem={true}>
                            <RegisterSW />
                            <Menu signedIn={!!session} />
                            <InstallButton />
                            <Main>{children}</Main>
                            <Footer />
                        </ThemeProvider>
                    </HeroUIProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
