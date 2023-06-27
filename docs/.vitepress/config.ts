import p from "path";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Phrasey",
    description: "A full-blown i18n build system.",
    base: "/phrasey/",
    outDir: "../docs-dist",
    lastUpdated: true,
    head: [
        ["link", { rel: "icon", href: "/public/icon.png" }],
        [
            "style",
            {},
            `:root {
                --vp-c-brand: #f59e0b;
                --vp-c-brand-light: #fbbf24;
                --vp-c-brand-lighter: #fcd34d;
                --vp-c-brand-dark: #d97706;
                --vp-c-brand-darker: #b45309;
            }`,
        ],
    ],
    themeConfig: {
        logo: "/public/icon.png",
        nav: [
            { text: "Guide", link: "/" },
            { text: "API Documentation", link: "/api/" },
        ],
        sidebar: [
            {
                text: "Getting Started",
                items: [
                    { text: "What is Phrasey?", link: "/what-is" },
                    { text: "Setup", link: "/setup" },
                ],
            },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/zyrouge/phrasey" },
        ],
        search: {
            provider: "local",
        },
        footer: {
            message: "Made with ❤️ by Zyrouge.",
        },
    },
});
