import { createContext } from "react";

import type { Locale } from "@type/i18n";

export const TranslationContext = createContext<Locale>("en");
