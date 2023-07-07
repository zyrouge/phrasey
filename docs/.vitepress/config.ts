import { defineConfig, HeadConfig } from "vitepress";

const BASE = "/phrasey/";
const BASE_URL = "https://zyrouge.github.io/phrasey";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Phrasey",
    description: "A full-blown i18n build system.",
    base: BASE,
    outDir: "../docs-dist",
    lastUpdated: true,
    head: [
        ["link", { rel: "icon", href: _url("/icon.png") }],
        _meta("og:image", _url("/banner.png")),
        _meta("twitter:card", "summary_large_image"),
        _meta("twitter:image", _url("/banner.png")),
        _meta("theme-color", "#f59e0b"),
        _meta("author", "Zyrouge, zyrouge@hotmail.com"),
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
                link: `${BASE_URL}/api/`,
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

function _meta(name: string, content: string): HeadConfig {
    return ["meta", { name, property: name, content }];
}

function _url(path: string) {
    return BASE_URL + path;
}
