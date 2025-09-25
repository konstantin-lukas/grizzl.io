import type { NextConfig } from "next";

import { version } from "./package.json";

const nextConfig: NextConfig = {
    output: "standalone",
    compiler: {
        reactRemoveProperties: process.env.APP_ENV === "production",
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    publicRuntimeConfig: {
        version,
    },
    allowedDevOrigins: ["grizzl.localhost", "*.grizzl.localhost"],
};

export default nextConfig;
