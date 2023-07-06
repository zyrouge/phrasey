import{_ as a,o as s,c as e,V as n}from"./chunks/framework.b61dde49.js";const g=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{},"headers":[],"relativePath":"getting-started/setup.md","filePath":"getting-started/setup.md","lastUpdated":1688662800000}'),t={name:"getting-started/setup.md"},o=n(`<h1 id="getting-started" tabindex="-1">Getting Started <a class="header-anchor" href="#getting-started" aria-label="Permalink to &quot;Getting Started&quot;">​</a></h1><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h2><p>Can be installed from using <a href="https://www.npmjs.com/package/phrasey" target="_blank" rel="noreferrer">NPM</a> or <a href="https://yarnpkg.com/package/phrasey" target="_blank" rel="noreferrer">Yarn</a>.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">phrasey</span></span>
<span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">phrasey</span></span></code></pre></div><p>Additionally, install the required <a href="./../others/content-formats.html">formats</a> for your project. Common formats including <a href="https://npmjs.com/package/@zyrouge/phrasey-json" target="_blank" rel="noreferrer">JSON</a>, <a href="https://npmjs.com/package/@zyrouge/phrasey-yaml" target="_blank" rel="noreferrer">YAML</a>, <a href="https://npmjs.com/package/@zyrouge/phrasey-toml" target="_blank" rel="noreferrer">TOML</a>, <a href="https://npmjs.com/package/@zyrouge/phrasey-xml" target="_blank" rel="noreferrer">XML</a> can be installed using below commands.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-json</span></span>
<span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-yaml</span></span>
<span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-toml</span></span>
<span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--save-dev</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@zyrouge/phrasey-xml</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or preferably using yarn</span></span></code></pre></div><p>Also, read about <a href="./../others/translation-string-formats.html">translation string formats</a>.</p><h2 id="setting-up-a-project" tabindex="-1">Setting up a project <a class="header-anchor" href="#setting-up-a-project" aria-label="Permalink to &quot;Setting up a project&quot;">​</a></h2><p>Use the <code>init</code> command to create and initialize a new project.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">phrasey</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">init</span></span></code></pre></div><p>This prompts a set of question which are used to create the <a href="./../project-structure/configuration.html">configuration</a> and <a href="./../project-structure/schema.html">schema</a> file.</p>`,11),l=[o];function p(r,c,i,y,h,C){return s(),e("div",null,l)}const m=a(t,[["render",p]]);export{g as __pageData,m as default};
