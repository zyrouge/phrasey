import{_ as s,o as a,c as n,V as l}from"./chunks/framework.b61dde49.js";const h=JSON.parse('{"title":"Translation File","description":"","frontmatter":{},"headers":[],"relativePath":"project-structure/translation.md","filePath":"project-structure/translation.md","lastUpdated":1688919049000}'),o={name:"project-structure/translation.md"},p=l(`<h1 id="translation-file" tabindex="-1">Translation File <a class="header-anchor" href="#translation-file" aria-label="Permalink to &quot;Translation File&quot;">​</a></h1><p>The translation file consists the actual translation strings.</p><p>The <code>fallback</code> and <code>input.fallback</code> in the <a href="./configuration.html">configuration file</a> are used to specify the fallback translation files from which omitted keys will be copied from. This can be omitted entirely if you require every translation file to be absolutely complete.</p><h2 id="representation" tabindex="-1">Representation <a class="header-anchor" href="#representation" aria-label="Permalink to &quot;Representation&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> PhraseyZTranslationType {</span></span>
<span class="line"><span style="color:#B392F0;">    locale</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">    fallback</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">|</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">[];</span></span>
<span class="line"><span style="color:#B392F0;">    extras</span><span style="color:#F97583;">?:</span><span style="color:#B392F0;"> Map&lt;</span><span style="color:#79B8FF;">string</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">any</span><span style="color:#B392F0;">&gt;;</span></span>
<span class="line"><span style="color:#B392F0;">    keys</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> Record&lt;</span><span style="color:#79B8FF;">string</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">&gt;;</span></span>
<span class="line"><span style="color:#B392F0;">}</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">interface</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyZTranslationType</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">    locale</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">    fallback</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">|</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">[];</span></span>
<span class="line"><span style="color:#24292EFF;">    extras</span><span style="color:#D32F2F;">?:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">Map</span><span style="color:#24292EFF;">&lt;</span><span style="color:#1976D2;">string</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">any</span><span style="color:#24292EFF;">&gt;;</span></span>
<span class="line"><span style="color:#24292EFF;">    keys</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">Record</span><span style="color:#24292EFF;">&lt;</span><span style="color:#1976D2;">string</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">&gt;;</span></span>
<span class="line"><span style="color:#24292EFF;">}</span></span></code></pre></div><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F8F8F8;">locale</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">en</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F8;">keys</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">HelloThere</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Hello There!</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">HowAreYou</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">How are you?</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">ThankYou</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Thank You</span></span>
<span class="line"><span style="color:#B392F0;">    </span><span style="color:#F8F8F8;">HelloX</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Hello, {user}!</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">locale</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">en</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D32F2F;">keys</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">HelloThere</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Hello There!</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">HowAreYou</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">How are you?</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">ThankYou</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Thank You</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#D32F2F;">HelloX</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Hello, {user}!</span></span></code></pre></div>`,7),e=[p];function t(r,c,F,y,i,d){return a(),n("div",null,e)}const u=s(o,[["render",t]]);export{h as __pageData,u as default};
