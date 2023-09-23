import{_ as s,o as a,c as n,Q as o}from"./chunks/framework.066af903.js";const u=JSON.parse('{"title":"Summary Command","description":"","frontmatter":{},"headers":[],"relativePath":"cli/summary.md","filePath":"cli/summary.md","lastUpdated":1695466155000}'),l={name:"cli/summary.md"},p=o(`<h1 id="summary-command" tabindex="-1">Summary Command <a class="header-anchor" href="#summary-command" aria-label="Permalink to &quot;Summary Command&quot;">​</a></h1><p><code>npx phrasey summary</code> can be used to generate summary of the project.</p><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npx </span><span style="color:#9DB1C5;">phrasey</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">summary</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--config-file</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">&lt;</span><span style="color:#9DB1C5;">path/to/confi</span><span style="color:#B392F0;">g</span><span style="color:#F97583;">&gt;</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--config-format</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">&lt;</span><span style="color:#9DB1C5;">forma</span><span style="color:#B392F0;">t</span><span style="color:#F97583;">&gt;</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--output-file</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">&lt;</span><span style="color:#9DB1C5;">path/to/outpu</span><span style="color:#B392F0;">t</span><span style="color:#F97583;">&gt;</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--output-format</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">&lt;</span><span style="color:#9DB1C5;">forma</span><span style="color:#B392F0;">t</span><span style="color:#F97583;">&gt;</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npx</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">phrasey</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">summary</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--config-file</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&lt;</span><span style="color:#2B5581;">path/to/confi</span><span style="color:#24292EFF;">g</span><span style="color:#D32F2F;">&gt;</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--config-format</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&lt;</span><span style="color:#2B5581;">forma</span><span style="color:#24292EFF;">t</span><span style="color:#D32F2F;">&gt;</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--output-file</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&lt;</span><span style="color:#2B5581;">path/to/outpu</span><span style="color:#24292EFF;">t</span><span style="color:#D32F2F;">&gt;</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--output-format</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&lt;</span><span style="color:#2B5581;">forma</span><span style="color:#24292EFF;">t</span><span style="color:#D32F2F;">&gt;</span></span></code></pre></div><h6 id="arguments" tabindex="-1">Arguments <a class="header-anchor" href="#arguments" aria-label="Permalink to &quot;Arguments&quot;">​</a></h6><ul><li><code>--config-file</code>, <code>-p</code> - Path to configuration file.</li><li><code>--config-format</code>, <code>-f</code> - Format of the configuration file.</li><li><code>--output-file</code>, <code>-o</code> - Path to output file.</li><li><code>--output-format</code>, <code>-s</code> - Format of the output file.</li><li><code>--help</code>, <code>-h</code> - Displays help message.</li></ul><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npx </span><span style="color:#9DB1C5;">phrasey</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">summary</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--config-file</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">./phrasey-config.json</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--config-format</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">json</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--output-file</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">./phrasey-summary.json</span><span style="color:#B392F0;"> \\</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#9DB1C5;">--output-format</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">json</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npx</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">phrasey</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">summary</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--config-file</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">./phrasey-config.json</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--config-format</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">json</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--output-file</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">./phrasey-summary.json</span><span style="color:#24292EFF;"> \\</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#2B5581;">--output-format</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">json</span></span></code></pre></div>`,8),e=[p];function t(c,r,y,F,i,m){return a(),n("div",null,e)}const B=s(l,[["render",t]]);export{u as __pageData,B as default};
