import{_ as s,o as a,c as n,V as e}from"./chunks/framework.b61dde49.js";const h=JSON.parse('{"title":"Content Formats","description":"","frontmatter":{},"headers":[],"relativePath":"others/content-formats.md","filePath":"others/content-formats.md","lastUpdated":1687955620000}'),o={name:"others/content-formats.md"},l=e(`<h1 id="content-formats" tabindex="-1">Content Formats <a class="header-anchor" href="#content-formats" aria-label="Permalink to &quot;Content Formats&quot;">​</a></h1><p>Content formats helps to understand the content of a file. They implement a serializer (converts content to an <code>object</code>) or a deserializer (converts <code>object</code> to content) or both to provide functionality.</p><h2 id="representation" tabindex="-1">Representation <a class="header-anchor" href="#representation" aria-label="Permalink to &quot;Representation&quot;">​</a></h2><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PhraseyContentFormatSerializer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">extension</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">serialize</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">PhraseyContentFormatDeserializer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">deserialize</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">content</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="pre-existing-formats" tabindex="-1">Pre-existing Formats <a class="header-anchor" href="#pre-existing-formats" aria-label="Permalink to &quot;Pre-existing Formats&quot;">​</a></h2><p>Phrasey has it&#39;s own implementation for the below formats.</p><h3 id="json" tabindex="-1">JSON <a class="header-anchor" href="#json" aria-label="Permalink to &quot;JSON&quot;">​</a></h3><p>Supports serializing and deserializing <code>.json</code> files.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-json</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-json</span></span></code></pre></div><h3 id="yaml" tabindex="-1">YAML <a class="header-anchor" href="#yaml" aria-label="Permalink to &quot;YAML&quot;">​</a></h3><p>Supports serializing and deserializing <code>.yaml</code> files. For file generation, the <code>.yaml</code> extension will only be used.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-yaml</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-yaml</span></span></code></pre></div><h3 id="toml" tabindex="-1">TOML <a class="header-anchor" href="#toml" aria-label="Permalink to &quot;TOML&quot;">​</a></h3><p>Supports serializing <code>.toml</code> files.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-toml</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-toml</span></span></code></pre></div><h3 id="xml" tabindex="-1">XML <a class="header-anchor" href="#xml" aria-label="Permalink to &quot;XML&quot;">​</a></h3><p>Supports serializing <code>.xml</code> files.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-xml</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or</span></span>
<span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-xml</span></span></code></pre></div>`,18),t=[l];function p(r,c,i,y,C,d){return a(),n("div",null,t)}const A=s(o,[["render",p]]);export{h as __pageData,A as default};
