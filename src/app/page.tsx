import type { Metadata } from "next";

import { getDictionary } from "@util/server/translation";

export async function generateMetadata(): Promise<Metadata> {
    const { tagline } = await getDictionary("home");
    return {
        title: `Grizzl - ${tagline}`,
    };
}

export default function Page() {
    return <h1>Hello, world!</h1>;
}
