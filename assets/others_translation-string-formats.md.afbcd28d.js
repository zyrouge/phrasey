import{_ as s,o as a,c as n,V as o}from"./chunks/framework.b61dde49.js";const d=JSON.parse('{"title":"Translation String Formats","description":"","frontmatter":{},"headers":[],"relativePath":"others/translation-string-formats.md","filePath":"others/translation-string-formats.md","lastUpdated":1695399780000}'),p={name:"others/translation-string-formats.md"},l=o(`<h1 id="translation-string-formats" tabindex="-1">Translation String Formats <a class="header-anchor" href="#translation-string-formats" aria-label="Permalink to &quot;Translation String Formats&quot;">​</a></h1><p>Translation string formats transform the parsed translation string into desirable output string. They implement a formatter (converts <code>PhraseyTranslationStringParts</code> to any serializable <code>object</code>).</p><h2 id="representation" tabindex="-1">Representation <a class="header-anchor" href="#representation" aria-label="Permalink to &quot;Representation&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> PhraseyTranslationStringFormatter&lt;T </span><span style="color:#F97583;">=</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">any</span><span style="color:#B392F0;">&gt; {</span></span>
<span class="line"><span style="color:#B392F0;">    format(</span></span>
<span class="line"><span style="color:#B392F0;">        parts</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> PhraseyTranslationStringParts</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">        schema</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> PhraseyZSchemaKeyType</span></span>
<span class="line"><span style="color:#B392F0;">    )</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> T;</span></span>
<span class="line"><span style="color:#B392F0;">}</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">interface</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyTranslationStringFormatter</span><span style="color:#24292EFF;">&lt;</span><span style="color:#6F42C1;">T</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">=</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">any</span><span style="color:#24292EFF;">&gt; {</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#6F42C1;">format</span><span style="color:#24292EFF;">(</span></span>
<span class="line"><span style="color:#24292EFF;">        parts</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyTranslationStringParts</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">        schema</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyZSchemaKeyType</span></span>
<span class="line"><span style="color:#24292EFF;">    )</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">T</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">}</span></span></code></pre></div><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">type</span><span style="color:#B392F0;"> { PhraseyTranslationStringFormatter } </span><span style="color:#F97583;">from</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;phrasey&quot;</span><span style="color:#B392F0;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#B392F0;"> </span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">stringFormatter</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> PhraseyTranslationStringFormatter&lt;</span><span style="color:#79B8FF;">string</span><span style="color:#B392F0;">&gt; </span><span style="color:#F97583;">=</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">    format</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> (parts) </span><span style="color:#F97583;">=&gt;</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        </span><span style="color:#F97583;">let</span><span style="color:#B392F0;"> out </span><span style="color:#F97583;">=</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;&quot;</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">        </span><span style="color:#79B8FF;">parts</span><span style="color:#B392F0;">.forEach((x) </span><span style="color:#F97583;">=&gt;</span><span style="color:#B392F0;"> {</span></span>
<span class="line"><span style="color:#B392F0;">            </span><span style="color:#F97583;">switch</span><span style="color:#B392F0;"> (</span><span style="color:#79B8FF;">x</span><span style="color:#B392F0;">.type) {</span></span>
<span class="line"><span style="color:#B392F0;">                </span><span style="color:#F97583;">case</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;string&quot;</span><span style="color:#B392F0;">:</span></span>
<span class="line"><span style="color:#B392F0;">                    out </span><span style="color:#F97583;">+=</span><span style="color:#B392F0;"> </span><span style="color:#79B8FF;">this</span><span style="color:#B392F0;">.escapeCharacter(</span><span style="color:#79B8FF;">x</span><span style="color:#B392F0;">.value</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;{&quot;</span><span style="color:#B392F0;">);</span></span>
<span class="line"><span style="color:#B392F0;">                    </span><span style="color:#F97583;">break</span><span style="color:#B392F0;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">                </span><span style="color:#F97583;">case</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;parameter&quot;</span><span style="color:#B392F0;">:</span></span>
<span class="line"><span style="color:#B392F0;">                    out </span><span style="color:#F97583;">+=</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">\`{</span><span style="color:#F97583;">\${</span><span style="color:#79B8FF;">x</span><span style="color:#B392F0;">.value</span><span style="color:#F97583;">}</span><span style="color:#FFAB70;">}\`</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">                    </span><span style="color:#F97583;">break</span><span style="color:#B392F0;">;</span></span>
<span class="line"><span style="color:#B392F0;">            }</span></span>
<span class="line"><span style="color:#B392F0;">        });</span></span>
<span class="line"><span style="color:#B392F0;">        </span><span style="color:#F97583;">return</span><span style="color:#B392F0;"> out;</span></span>
<span class="line"><span style="color:#B392F0;">    }</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">};</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#D32F2F;">import</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">type</span><span style="color:#24292EFF;"> { PhraseyTranslationStringFormatter } </span><span style="color:#D32F2F;">from</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;phrasey&quot;</span><span style="color:#24292EFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D32F2F;">export</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">const</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">stringFormatter</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> </span><span style="color:#6F42C1;">PhraseyTranslationStringFormatter</span><span style="color:#24292EFF;">&lt;</span><span style="color:#1976D2;">string</span><span style="color:#24292EFF;">&gt; </span><span style="color:#D32F2F;">=</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">    </span><span style="color:#6F42C1;">format</span><span style="color:#D32F2F;">:</span><span style="color:#24292EFF;"> (parts) </span><span style="color:#D32F2F;">=&gt;</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">        </span><span style="color:#D32F2F;">let</span><span style="color:#24292EFF;"> out </span><span style="color:#D32F2F;">=</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;&quot;</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">        </span><span style="color:#1976D2;">parts</span><span style="color:#6F42C1;">.forEach</span><span style="color:#24292EFF;">((x) </span><span style="color:#D32F2F;">=&gt;</span><span style="color:#24292EFF;"> {</span></span>
<span class="line"><span style="color:#24292EFF;">            </span><span style="color:#D32F2F;">switch</span><span style="color:#24292EFF;"> (</span><span style="color:#1976D2;">x</span><span style="color:#24292EFF;">.type) {</span></span>
<span class="line"><span style="color:#24292EFF;">                </span><span style="color:#D32F2F;">case</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;string&quot;</span><span style="color:#24292EFF;">:</span></span>
<span class="line"><span style="color:#24292EFF;">                    out </span><span style="color:#D32F2F;">+=</span><span style="color:#24292EFF;"> </span><span style="color:#1976D2;">this</span><span style="color:#6F42C1;">.escapeCharacter</span><span style="color:#24292EFF;">(</span><span style="color:#1976D2;">x</span><span style="color:#24292EFF;">.value</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;{&quot;</span><span style="color:#24292EFF;">);</span></span>
<span class="line"><span style="color:#24292EFF;">                    </span><span style="color:#D32F2F;">break</span><span style="color:#24292EFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292EFF;">                </span><span style="color:#D32F2F;">case</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;parameter&quot;</span><span style="color:#24292EFF;">:</span></span>
<span class="line"><span style="color:#24292EFF;">                    out </span><span style="color:#D32F2F;">+=</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">\`{</span><span style="color:#D32F2F;">\${</span><span style="color:#1976D2;">x</span><span style="color:#24292EFF;">.value</span><span style="color:#D32F2F;">}</span><span style="color:#22863A;">}\`</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">                    </span><span style="color:#D32F2F;">break</span><span style="color:#24292EFF;">;</span></span>
<span class="line"><span style="color:#24292EFF;">            }</span></span>
<span class="line"><span style="color:#24292EFF;">        });</span></span>
<span class="line"><span style="color:#24292EFF;">        </span><span style="color:#D32F2F;">return</span><span style="color:#24292EFF;"> out;</span></span>
<span class="line"><span style="color:#24292EFF;">    }</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">};</span></span></code></pre></div><h2 id="pre-existing-formats" tabindex="-1">Pre-existing Formats <a class="header-anchor" href="#pre-existing-formats" aria-label="Permalink to &quot;Pre-existing Formats&quot;">​</a></h2><p>Phrasey has built-in support for the below formats.</p><h3 id="parts" tabindex="-1"><code>parts</code> <a class="header-anchor" href="#parts" aria-label="Permalink to &quot;\`parts\`&quot;">​</a></h3><p>Serializes the parsed string as it is.</p><p>Example of output string:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">[</span></span>
<span class="line"><span style="color:#B392F0;">    { </span><span style="color:#F8F8F8;">&quot;type&quot;</span><span style="color:#BBBBBB;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;string&quot;</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#F8F8F8;">&quot;value&quot;</span><span style="color:#BBBBBB;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;Hello, &quot;</span><span style="color:#B392F0;"> }</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">    { </span><span style="color:#F8F8F8;">&quot;type&quot;</span><span style="color:#BBBBBB;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;parameter&quot;</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#F8F8F8;">&quot;value&quot;</span><span style="color:#BBBBBB;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;user&quot;</span><span style="color:#B392F0;"> }</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">    { </span><span style="color:#F8F8F8;">&quot;type&quot;</span><span style="color:#BBBBBB;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;string&quot;</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#F8F8F8;">&quot;value&quot;</span><span style="color:#BBBBBB;">:</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;!&quot;</span><span style="color:#B392F0;"> }</span></span>
<span class="line"><span style="color:#B392F0;">]</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#24292EFF;">[</span></span>
<span class="line"><span style="color:#24292EFF;">    { </span><span style="color:#D32F2F;">&quot;type&quot;</span><span style="color:#212121;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;string&quot;</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&quot;value&quot;</span><span style="color:#212121;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;Hello, &quot;</span><span style="color:#24292EFF;"> }</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">    { </span><span style="color:#D32F2F;">&quot;type&quot;</span><span style="color:#212121;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;parameter&quot;</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&quot;value&quot;</span><span style="color:#212121;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;user&quot;</span><span style="color:#24292EFF;"> }</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">    { </span><span style="color:#D32F2F;">&quot;type&quot;</span><span style="color:#212121;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;string&quot;</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#D32F2F;">&quot;value&quot;</span><span style="color:#212121;">:</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;!&quot;</span><span style="color:#24292EFF;"> }</span></span>
<span class="line"><span style="color:#24292EFF;">]</span></span></code></pre></div><h3 id="compact-parts" tabindex="-1"><code>compact-parts</code> <a class="header-anchor" href="#compact-parts" aria-label="Permalink to &quot;\`compact-parts\`&quot;">​</a></h3><p>Serializes the parsed string as compact parts. Here, <code>0</code> denotes a <code>string</code> and <code>1</code> denotes a <code>parameter</code>.</p><p>Example of output string:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">[</span></span>
<span class="line"><span style="color:#B392F0;">    [</span><span style="color:#F8F8F8;">0</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;Hello, &quot;</span><span style="color:#B392F0;">]</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">    [</span><span style="color:#F8F8F8;">1</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;user&quot;</span><span style="color:#B392F0;">]</span><span style="color:#BBBBBB;">,</span></span>
<span class="line"><span style="color:#B392F0;">    [</span><span style="color:#F8F8F8;">0</span><span style="color:#BBBBBB;">,</span><span style="color:#B392F0;"> </span><span style="color:#FFAB70;">&quot;!&quot;</span><span style="color:#B392F0;">]</span></span>
<span class="line"><span style="color:#B392F0;">]</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#24292EFF;">[</span></span>
<span class="line"><span style="color:#24292EFF;">    [</span><span style="color:#1976D2;">0</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;Hello, &quot;</span><span style="color:#24292EFF;">]</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">    [</span><span style="color:#1976D2;">1</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;user&quot;</span><span style="color:#24292EFF;">]</span><span style="color:#212121;">,</span></span>
<span class="line"><span style="color:#24292EFF;">    [</span><span style="color:#1976D2;">0</span><span style="color:#212121;">,</span><span style="color:#24292EFF;"> </span><span style="color:#22863A;">&quot;!&quot;</span><span style="color:#24292EFF;">]</span></span>
<span class="line"><span style="color:#24292EFF;">]</span></span></code></pre></div><h3 id="format-string" tabindex="-1"><code>format-string</code> <a class="header-anchor" href="#format-string" aria-label="Permalink to &quot;\`format-string\`&quot;">​</a></h3><p>Serializes the parsed string as to a equivalent of <code>printf()</code> supported string. The output string uses positional argument with <code>%s</code>.</p><p>Example of output string:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#b392f0;">Hello, %0$s!</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#24292eff;">Hello, %0$s!</span></span></code></pre></div><h3 id="java-format-string" tabindex="-1"><code>java-format-string</code> <a class="header-anchor" href="#java-format-string" aria-label="Permalink to &quot;\`java-format-string\`&quot;">​</a></h3><p>Serializes the parsed string to be suitable for Java&#39;s <code>.format()</code> method. The output string uses positional argument with <code>%s</code>.</p><p>Example of output string:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#b392f0;">Hello, %1$s!</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#24292eff;">Hello, %1$s!</span></span></code></pre></div><h3 id="python-format-string" tabindex="-1"><code>python-format-string</code> <a class="header-anchor" href="#python-format-string" aria-label="Permalink to &quot;\`python-format-string\`&quot;">​</a></h3><p>Serializes the parsed string as to a equivalent of Python&#39;s <code>.format()</code> supported string.</p><p>Example of output string:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki min-dark vp-code-dark"><code><span class="line"><span style="color:#b392f0;">Hello, {user}!</span></span></code></pre><pre class="shiki min-light vp-code-light"><code><span class="line"><span style="color:#24292eff;">Hello, {user}!</span></span></code></pre></div>`,28),t=[l];function e(r,c,F,y,i,B){return a(),n("div",null,t)}const h=s(p,[["render",e]]);export{d as __pageData,h as default};
