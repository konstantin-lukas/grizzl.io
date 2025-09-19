import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import "@app/globals.css";

import Menu from "@components/navigation/Menu";
import HeroUIProvider from "@components/providers/HeroUIProvider";

export const metadata: Metadata = {
    title: "Grizzl",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className="antialiased">
                <HeroUIProvider>
                    <ThemeProvider attribute="data-color-scheme" enableSystem={true}>
                        <Menu />
                        <main>{children}</main>
                    </ThemeProvider>
                </HeroUIProvider>
            </body>
        </html>
    );
}
