import { defineConfig, HeadConfig } from "vitepress";

const BASE = "/phrasey/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Phrasey",
    description: "A full-blown i18n build system.",
    base: BASE,
    outDir: "../docs-dist",
    lastUpdated: true,
    head: [
        ["link", { rel: "icon", href: _base("icon.png") }],
        _metaTag("og:image", _base("icon.png")),
        _metaTag("twitter:card", _base("banner.png")),
        _metaTag("theme-color", "#f59e0b"),
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
        logo: "/icon.png",
        nav: [
            { text: "Guide", link: "/", activeMatch: ".*" },
            {
                text: "API Documentation",
                link: "https://zyrouge.github.io/phrasey/api/",
            },
        ],
        sidebar: [
            {
                text: "Getting Started",
                items: [
                    {
                        text: "What is Phrasey?",
                        link: "/getting-started/",
                    },
                    { text: "Setup", link: "/getting-started/setup" },
                ],
            },
            {
                text: "CLI",
                items: [
                    {
                        text: "Overview",
                        link: "/cli/",
                    },
                    { text: "Init Command", link: "/cli/init" },
                    { text: "Build Command", link: "/cli/build" },
                    { text: "Summary Command", link: "/cli/summary" },
                    { text: "Status Command", link: "/cli/status" },
                ],
            },
            {
                text: "Project Structure",
                items: [
                    {
                        text: "Overview",
                        link: "/project-structure/",
                    },
                    {
                        text: "Configuration",
                        link: "/project-structure/configuration",
                    },
                    {
                        text: "Schema",
                        link: "/project-structure/schema",
                    },
                    {
                        text: "Translation",
                        link: "/project-structure/translation",
                    },
                    {
                        text: "Hooks",
                        link: "/project-structure/hooks",
                    },
                ],
            },
            {
                text: "Others",
                items: [
                    {
                        text: "Content Formats",
                        link: "/others/content-formats",
                    },
                    {
                        text: "Translation String Formats",
                        link: "/others/translation-string-formats",
                    },
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

function _metaTag(name: string, content: string): HeadConfig {
    return ["meta", { name, property: name, content }];
}

function _base(path: string) {
    return BASE + path;
}
