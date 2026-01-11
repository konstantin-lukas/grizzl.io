import icons from "./icons";
import type { ModuleOptions } from "@vite-pwa/nuxt";

const pwa: ModuleOptions = {
    manifest: {
        name: "Grizzl - The Bear That Does It All",
        short_name: "Grizzl",
        description: "Your everything in one app for daily tasks.",
        start_url: "/",
        display: "standalone",
        display_override: ["standalone", "fullscreen", "minimal-ui"],
        background_color: "#ffffff",
        theme_color: "#047857",
        id: "/",
        icons,
        screenshots: [
            {
                src: "/desktop-screenshot.png",
                sizes: "1920x1080",
                type: "image/png",
                form_factor: "wide",
            },
            {
                src: "/mobile-screenshot.png",
                sizes: "325x441",
                type: "image/png",
                form_factor: "narrow",
            },
        ],
    },
    srcDir: "../service-worker",
    filename: "grizzl-sw.ts",
    scope: "/",
    injectRegister: false,
    includeManifestIcons: false,
    client: {
        installPrompt: true,
    },
    injectManifest: {
        globPatterns: ["**/*.{js,json,css,html,txt,svg,png,ico,webp}"],
        globIgnores: ["manifest**.webmanifest"],
    },
    devOptions: {
        enabled: false,
        suppressWarnings: true,
        navigateFallback: "/",
        navigateFallbackAllowlist: [/^\/$/],
        type: "module",
    },
    strategies: "injectManifest",
};

export default pwa;
