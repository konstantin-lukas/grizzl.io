import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@app/globals.css";

export const metadata: Metadata = {
    title: "Grizzl",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
