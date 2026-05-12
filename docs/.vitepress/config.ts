/// <reference types="node" />
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitepress";
import mathjax3 from "markdown-it-mathjax3";
import { withMermaid } from "vitepress-plugin-mermaid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Sidebar helpers
// Reads a markdown file and returns its ## headings as anchor sub-items.
// Matches VitePress's default slug: lowercase, strip non-word chars, spaces→hyphens.
// ---------------------------------------------------------------------------
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function h2items(relPath: string, urlBase: string) {
  const content = readFileSync(resolve(docsDir, relPath), "utf-8");
  return content
    .split("\n")
    .filter((line: string) => line.startsWith("## "))
    .map((line: string) => line.slice(3).trim())
    .map((text: string) => ({ text, link: `${urlBase}#${slugify(text)}` }));
}

// Build a sidebar entry: page title + its ## headings as sub-items.
function page(title: string, urlPath: string, relFile: string) {
  return { text: title, link: urlPath, items: h2items(relFile, urlPath) };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
export default withMermaid(
  defineConfig({
    title: "BobDyn",
    description: "A high-fidelity, open-source vehicle simulation framework",

    cleanUrls: true,

    head: [["link", { rel: "icon", href: "/bob.png" }]],

    markdown: {
      defaultHighlightLang: "txt",
      languageAlias: { modelica: "txt" },
      config: (md) => { md.use(mathjax3); },
    },

    themeConfig: {
      logo: "/bob.png",
      siteTitle: "BobDyn",

      outline: 2,

      nav: [
        { text: "Startup Guide", link: "/startup-guide/" },
        { text: "Use Guide",     link: "/use-guide/" },
        {
          text: "Documentation",
          items: [
            { text: "BobLib",    link: "/boblib/" },
            { text: "BobSim",    link: "/bobsim/" },
            { text: "Reference", link: "/reference/" },
          ],
        },
        { text: "Contributing", link: "/contributing" },
      ],

      sidebar: {
        "/startup-guide/": [
          page("Startup Guide", "/startup-guide/", "startup-guide/index.md"),
        ],

        "/use-guide/": [
          page("Use Guide", "/use-guide/", "use-guide/index.md"),
        ],

        "/boblib/": [
          page("BobLib", "/boblib/", "boblib/index.md"),
        ],

        "/bobsim/": [
          {
            text: "BobSim",
            items: [
              page("BobSim",                  "/bobsim/",    "bobsim/index.md"),
              page("Design of Experiments",   "/bobsim/doe", "bobsim/doe.md"),
            ],
          },
        ],

        "/reference/": [
          {
            text: "Reference",
            items: [
              page("Reference",                  "/reference/",                "reference/index.md"),
              page("Vehicle Performance Metrics", "/reference/metrics",        "reference/metrics.md"),
              page("Control Theory",             "/reference/control-theory",  "reference/control-theory.md"),
            ],
          },
        ],

        "/contributing": [
          page("Contributing", "/contributing", "contributing.md"),
        ],
      },

      socialLinks: [{ icon: "github", link: "https://github.com/BobDyn" }],

      footer: {
        message: "Released as open-source vehicle simulation tooling.",
        copyright: "Copyright © 2026 BobDyn",
      },

      search: { provider: "local" },
    },
  })
);
