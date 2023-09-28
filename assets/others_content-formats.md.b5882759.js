import{_ as s,o as a,c as n,Q as o}from"./chunks/framework.066af903.js";const h=JSON.parse('{"title":"Content Formats","description":"","frontmatter":{},"headers":[],"relativePath":"others/content-formats.md","filePath":"others/content-formats.md","lastUpdated":1695890594000}'),l={name:"others/content-formats.md"},p=o(`<h1 id="content-formats" tabindex="-1">Content Formats <a class="header-anchor" href="#content-formats" aria-label="Permalink to &quot;Content Formats&quot;">​</a></h1><p>Content formats helps to understand the content of a file. They implement serializer (converts content to an <code>object</code>) and deserializer (converts <code>object</code> to content) to provide functionality.</p><h2 id="representation" tabindex="-1">Representation <a class="header-anchor" href="#representation" aria-label="Permalink to &quot;Representation&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> PhraseyContentFormatter {</span></span>
<span class="line"><span style="color:#B392F0;">    extension</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">    serialize(content</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">any</span><span style="color:#B392F0;">)</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">    deserialize(content</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">)</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">any</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">}</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">interface</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyContentFormatter</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">    extension</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#6F42C1;">serialize</span><span style="color:#24292EFF;">(content</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">any</span><span style="color:#24292EFF;">)</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#6F42C1;">deserialize</span><span style="color:#24292EFF;">(content</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">)</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">any</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">}</span></span></code></pre></div><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">type</span><span style="color:#B392F0;"> { PhraseyContentFormatter } </span><span style="color:#F97583;">from</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;phrasey&quot;</span><span style="color:#B392F0;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">contentFormatter</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> PhraseyContentFormatter </span><span style="color:#F97583;">=</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">    extension</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;json&quot;</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">    serialize</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> (content</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">any</span><span style="color:#B392F0;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">JSON</span><span style="color:#B392F0;">.stringify(content)</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">    deserialize</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> (content</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">JSON</span><span style="color:#B392F0;">.parse(content)</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">};</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">import</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">type</span><span style="color:#24292EFF;"> { PhraseyContentFormatter } </span><span style="color:#D32F2F;">from</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;phrasey&quot;</span><span style="color:#24292EFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D32F2F;">export</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">const</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">contentFormatter</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyContentFormatter</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">=</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">    extension</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;json&quot;</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#6F42C1;">serialize</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> (content</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">any</span><span style="color:#24292EFF;">) </span><span style="color:#D32F2F;">=&gt;</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">JSON</span><span style="color:#6F42C1;">.stringify</span><span style="color:#24292EFF;">(content)</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#6F42C1;">deserialize</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> (content</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">) </span><span style="color:#D32F2F;">=&gt;</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">JSON</span><span style="color:#6F42C1;">.parse</span><span style="color:#24292EFF;">(content)</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">};</span></span></code></pre></div><h2 id="pre-existing-formats" tabindex="-1">Pre-existing Formats <a class="header-anchor" href="#pre-existing-formats" aria-label="Permalink to &quot;Pre-existing Formats&quot;">​</a></h2><p>Phrasey has it&#39;s own implementation for the below formats.</p><h3 id="json" tabindex="-1">JSON <a class="header-anchor" href="#json" aria-label="Permalink to &quot;JSON&quot;">​</a></h3><p>Supports serializing and deserializing <code>.json</code> files.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npm </span><span style="color:#9DB1C5;">install</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--save-dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-json</span></span>
<span class="line"><span style="color:#6B737C;"># or</span></span>
<span class="line"><span style="color:#B392F0;">yarn </span><span style="color:#9DB1C5;">add</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-json</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">install</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--save-dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-json</span></span>
<span class="line"><span style="color:#C2C3C5;"># or</span></span>
<span class="line"><span style="color:#6F42C1;">yarn</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">add</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-json</span></span></code></pre></div><h3 id="yaml" tabindex="-1">YAML <a class="header-anchor" href="#yaml" aria-label="Permalink to &quot;YAML&quot;">​</a></h3><p>Supports serializing and deserializing <code>.yaml</code> files. For file generation, the <code>.yaml</code> extension will only be used.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npm </span><span style="color:#9DB1C5;">install</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--save-dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-yaml</span></span>
<span class="line"><span style="color:#6B737C;"># or</span></span>
<span class="line"><span style="color:#B392F0;">yarn </span><span style="color:#9DB1C5;">add</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-yaml</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">install</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--save-dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-yaml</span></span>
<span class="line"><span style="color:#C2C3C5;"># or</span></span>
<span class="line"><span style="color:#6F42C1;">yarn</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">add</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-yaml</span></span></code></pre></div><h3 id="toml" tabindex="-1">TOML <a class="header-anchor" href="#toml" aria-label="Permalink to &quot;TOML&quot;">​</a></h3><p>Supports serializing and deserializing <code>.toml</code> files.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npm </span><span style="color:#9DB1C5;">install</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--save-dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-toml</span></span>
<span class="line"><span style="color:#6B737C;"># or</span></span>
<span class="line"><span style="color:#B392F0;">yarn </span><span style="color:#9DB1C5;">add</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-toml</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">install</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--save-dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-toml</span></span>
<span class="line"><span style="color:#C2C3C5;"># or</span></span>
<span class="line"><span style="color:#6F42C1;">yarn</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">add</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-toml</span></span></code></pre></div><h3 id="xml" tabindex="-1">XML <a class="header-anchor" href="#xml" aria-label="Permalink to &quot;XML&quot;">​</a></h3><p>Supports serializing and deserializing <code>.xml</code> files.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npm </span><span style="color:#9DB1C5;">install</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--save-dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-xml</span></span>
<span class="line"><span style="color:#6B737C;"># or</span></span>
<span class="line"><span style="color:#B392F0;">yarn </span><span style="color:#9DB1C5;">add</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">--dev</span><span style="color:#B392F0;"> </span><span style="color:#9DB1C5;">@zyrouge/phrasey-xml</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">install</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--save-dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-xml</span></span>
<span class="line"><span style="color:#C2C3C5;"># or</span></span>
<span class="line"><span style="color:#6F42C1;">yarn</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">add</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">--dev</span><span style="color:#24292EFF;"> </span><span style="color:#2B5581;">@zyrouge/phrasey-xml</span></span></code></pre></div>`,20),e=[p];function t(r,c,y,F,i,d){return a(),n("div",null,e)}const m=s(l,[["render",t]]);export{h as __pageData,m as default};
