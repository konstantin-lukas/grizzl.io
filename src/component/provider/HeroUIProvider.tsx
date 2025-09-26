"use client";

import { HeroUIProvider as Provider } from "@heroui/react";
import type { ReactNode } from "react";

export default function HeroUIProvider({ children }: { children: ReactNode }) {
    return <Provider>{children}</Provider>;
}
