import{_ as s,o as n,c as a,V as l}from"./chunks/framework.b61dde49.js";const f=JSON.parse('{"title":"Configuration File","description":"","frontmatter":{},"headers":[],"relativePath":"project-structure/configuration.md","filePath":"project-structure/configuration.md","lastUpdated":1688919049000}'),p={name:"project-structure/configuration.md"},o=l(`<h1 id="configuration-file" tabindex="-1">Configuration File <a class="header-anchor" href="#configuration-file" aria-label="Permalink to &quot;Configuration File&quot;">​</a></h1><p>The configuration file helps the CLI to build the project.</p><h2 id="representation" tabindex="-1">Representation <a class="header-anchor" href="#representation" aria-label="Permalink to &quot;Representation&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> PhraseyZConfigType {</span></span>
<span class="line"><span style="color:#B392F0;">    input</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        </span><span style="color:#6B737C;">// supports globs</span></span>
<span class="line"><span style="color:#B392F0;">        files</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">|</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">[];</span></span>
<span class="line"><span style="color:#B392F0;">        format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        fallback</span><span style="color:#F97583;">?:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">|</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">[];</span></span>
<span class="line"><span style="color:#B392F0;">    };</span></span>
<span class="line"><span style="color:#B392F0;">    schema</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        file</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">    };</span></span>
<span class="line"><span style="color:#B392F0;">    output</span><span style="color:#F97583;">?:</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        dir</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        stringFormat</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">    };</span></span>
<span class="line"><span style="color:#B392F0;">    hooks</span><span style="color:#F97583;">?:</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        files</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">[];</span></span>
<span class="line"><span style="color:#B392F0;">    };</span></span>
<span class="line"><span style="color:#B392F0;">}</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">interface</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyZConfigType</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">    input</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">        </span><span style="color:#C2C3C5;">// supports globs</span></span>
<span class="line"><span style="color:#24292EFF;">        files</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">|</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">[];</span></span>
<span class="line"><span style="color:#24292EFF;">        format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        fallback</span><span style="color:#D32F2F;">?:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">|</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">[];</span></span>
<span class="line"><span style="color:#24292EFF;">    };</span></span>
<span class="line"><span style="color:#24292EFF;">    schema</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">        file</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">    };</span></span>
<span class="line"><span style="color:#24292EFF;">    output</span><span style="color:#D32F2F;">?:</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">        dir</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        stringFormat</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">    };</span></span>
<span class="line"><span style="color:#24292EFF;">    hooks</span><span style="color:#D32F2F;">?:</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">        files</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">[];</span></span>
<span class="line"><span style="color:#24292EFF;">    };</span></span>
<span class="line"><span style="color:#24292EFF;">}</span></span></code></pre></div><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F8F8F8;">schema</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">file</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">./i18n-schema.yaml</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F8;">input</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">files</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">./i18n/**.yaml</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">fallback</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">./i18n/en.yaml</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F8;">output</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">dir</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">./dist</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">json</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">stringFormat</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">parts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F8;">hooks</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">files</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">        - </span><span style="color:#FFAB70;">./hooks.js</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">schema</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">file</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">./i18n-schema.yaml</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D32F2F;">input</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">files</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">./i18n/**.yaml</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">fallback</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">./i18n/en.yaml</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D32F2F;">output</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">dir</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">./dist</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">json</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">stringFormat</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">parts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D32F2F;">hooks</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">files</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">        - </span><span style="color:#22863A;">./hooks.js</span></span></code></pre></div>`,6),e=[o];function t(c,F,r,y,i,B){return n(),a("div",null,e)}const m=s(p,[["render",t]]);export{f as __pageData,m as default};
