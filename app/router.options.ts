import type { RouterConfig } from "@nuxt/schema";

export default {
    // https://router.vuejs.org/api/interfaces/routeroptions#routes
    routes: _routes => [
        {
            name: "finance",
            path: "/finance",
            meta: {
                title: "finance.meta.title",
                description: "finance.meta.description",
            },
            component: () => import("~/finance/pages/finance.page.vue"),
        },
        {
            name: "timer",
            path: "/timer",
            meta: {
                title: "timer.meta.title",
                description: "timer.meta.description",
            },
            component: () => import("~/timer/pages/timer.page.vue"),
        },
        {
            name: "home",
            path: "/",
            component: () => import("~/core/pages/root.page.vue"),
        },
        {
            name: "signin",
            path: "/signin",
            meta: {
                title: "ui.signIn",
                description: "meta.signInDescription",
            },
            component: () => import("~/core/pages/signin.page.vue"),
        },
        {
            name: "legal-notice",
            path: "/legal-notice",
            meta: {
                title: "legal.notice",
            },
            component: () => import("~/core/pages/legal-notice.page.vue"),
        },
        {
            name: "privacy-policy",
            path: "/privacy-policy",
            meta: {
                title: "privacy.title",
            },
            component: () => import("~/core/pages/privacy-policy.page.vue"),
        },
    ],
} satisfies RouterConfig;
