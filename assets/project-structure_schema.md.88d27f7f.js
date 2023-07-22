import{_ as s,o as a,c as n,V as l}from"./chunks/framework.b61dde49.js";const h=JSON.parse('{"title":"Schema File","description":"","frontmatter":{},"headers":[],"relativePath":"project-structure/schema.md","filePath":"project-structure/schema.md","lastUpdated":1690040075000}'),p={name:"project-structure/schema.md"},e=l(`<h1 id="schema-file" tabindex="-1">Schema File <a class="header-anchor" href="#schema-file" aria-label="Permalink to &quot;Schema File&quot;">​</a></h1><p>The schema file defines the structure of a <a href="./translation.html">translation file</a>.</p><h2 id="representation" tabindex="-1">Representation <a class="header-anchor" href="#representation" aria-label="Permalink to &quot;Representation&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> PhraseyZSchemaType {</span></span>
<span class="line"><span style="color:#B392F0;">    keys</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        name</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        description</span><span style="color:#F97583;">?:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        parameters</span><span style="color:#F97583;">?:</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">[];</span></span>
<span class="line"><span style="color:#B392F0;">    }[];</span></span>
<span class="line"><span style="color:#B392F0;">}</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">interface</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyZSchemaType</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">    keys</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">        name</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        description</span><span style="color:#D32F2F;">?:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        parameters</span><span style="color:#D32F2F;">?:</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">[];</span></span>
<span class="line"><span style="color:#24292EFF;">    }[];</span></span>
<span class="line"><span style="color:#24292EFF;">}</span></span></code></pre></div><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F8F8F8;">keys</span><span style="color:#F97583;">:</span></span>
<span class="line"><span style="color:#B392F0;">    - </span><span style="color:#F8F8F8;">name</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">HelloThere</span></span>
<span class="line"><span style="color:#B392F0;">      </span><span style="color:#F8F8F8;">description</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Represents a &quot;Hello!&quot; message.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    - </span><span style="color:#F8F8F8;">name</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">HowAreYou</span></span>
<span class="line"><span style="color:#B392F0;">      </span><span style="color:#F8F8F8;">description</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Represents a &quot;How are you?&quot; message.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    - </span><span style="color:#F8F8F8;">name</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">ThankYou</span></span>
<span class="line"><span style="color:#B392F0;">      </span><span style="color:#F8F8F8;">description</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Represents a &quot;Thank you!&quot; message.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    - </span><span style="color:#F8F8F8;">name</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">HelloX</span></span>
<span class="line"><span style="color:#B392F0;">      </span><span style="color:#F8F8F8;">description</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">Say &quot;Hello&quot; to an user.</span></span>
<span class="line"><span style="color:#B392F0;">      </span><span style="color:#F8F8F8;">parameters</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> [</span><span style="color:#9DB1C5;">user</span><span style="color:#B392F0;">]</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">keys</span><span style="color:#D32F2F;">:</span></span>
<span class="line"><span style="color:#24292EFF;">    - </span><span style="color:#D32F2F;">name</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">HelloThere</span></span>
<span class="line"><span style="color:#24292EFF;">      </span><span style="color:#D32F2F;">description</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Represents a &quot;Hello!&quot; message.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292EFF;">    - </span><span style="color:#D32F2F;">name</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">HowAreYou</span></span>
<span class="line"><span style="color:#24292EFF;">      </span><span style="color:#D32F2F;">description</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Represents a &quot;How are you?&quot; message.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292EFF;">    - </span><span style="color:#D32F2F;">name</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">ThankYou</span></span>
<span class="line"><span style="color:#24292EFF;">      </span><span style="color:#D32F2F;">description</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Represents a &quot;Thank you!&quot; message.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292EFF;">    - </span><span style="color:#D32F2F;">name</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">HelloX</span></span>
<span class="line"><span style="color:#24292EFF;">      </span><span style="color:#D32F2F;">description</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">Say &quot;Hello&quot; to an user.</span></span>
<span class="line"><span style="color:#24292EFF;">      </span><span style="color:#D32F2F;">parameters</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> [</span><span style="color:#2B5581;">user</span><span style="color:#24292EFF;">]</span></span></code></pre></div>`,6),o=[e];function t(c,r,F,y,i,d){return a(),n("div",null,o)}const u=s(p,[["render",t]]);export{h as __pageData,u as default};
