"use client";

import type { ReactNode } from "react";
import type { Locale } from "@type/i18n";
import { TranslationContext } from "@context";

export default function TranslationProvider({children, initialValue}: {children: ReactNode, initialValue: Locale}) {
    return <TranslationContext.Provider value={initialValue}>{children}</TranslationContext.Provider>;
}