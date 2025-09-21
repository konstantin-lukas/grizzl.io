import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Jost } from "next/font/google";
import type { ReactNode } from "react";

import "@app/globals.css";

import { Footer } from "@components/navigation/Footer";
import Menu from "@components/navigation/Menu";
import HeroUIProvider from "@components/providers/HeroUIProvider";

export const metadata: Metadata = {
    title: "Grizzl - The Bear That Does It All",
};

const jost = Jost({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning={true} className={jost.className}>
            <body className="antialiased">
                <HeroUIProvider>
                    <ThemeProvider attribute="data-color-scheme" enableSystem={true}>
                        <Menu />
                        <main className="min-h-[calc(100dvh_-_var(--spacing-footer-height))]">{children}</main>
                        <Footer />
                    </ThemeProvider>
                </HeroUIProvider>
            </body>
        </html>
    );
}
