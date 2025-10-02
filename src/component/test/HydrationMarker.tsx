"use client";

import { useEffect } from "react";

export default function HydrationMarker() {
    useEffect(() => {
        (window as unknown as { __NEXT_HYDRATED__: boolean }).__NEXT_HYDRATED__ = true;
    }, []);

    return null;
}
