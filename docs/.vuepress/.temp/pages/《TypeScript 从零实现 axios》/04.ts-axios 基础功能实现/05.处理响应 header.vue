<template><h1 id="处理响应-header"><a class="header-anchor" href="#处理响应-header">#</a> 处理响应 header</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>我们通过 <code>XMLHttpRequest</code> 对象的 <code>getAllResponseHeaders</code> 方法获取到的值是如下一段字符串：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>date: Fri, 05 Apr 2019 12:40:49 GMT
etag: W/&quot;d-Ssxx4FRxEutDLwo2+xkkxKc4y0k&quot;
connection: keep-alive
x-powered-by: Express
content-length: 13
content-type: application/json; charset=utf-8
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>每一行都是以回车符和换行符 <code>\r\n</code> 结束，它们是每个 <code>header</code> 属性的分隔符。对于上面这串字符串，我们希望最终解析成一个对象结构：</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  date<span class="token operator">:</span> 'Fri<span class="token punctuation">,</span> <span class="token number">05</span> Apr <span class="token number">2019</span> <span class="token number">12</span><span class="token operator">:</span><span class="token number">40</span><span class="token operator">:</span><span class="token number">49</span> GMT'
  etag<span class="token operator">:</span> 'W/<span class="token string">"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"</span>'<span class="token punctuation">,</span>
  connection<span class="token operator">:</span> 'keep-alive'<span class="token punctuation">,</span>
  'x-powered-by'<span class="token operator">:</span> 'Express'<span class="token punctuation">,</span>
  'content-length'<span class="token operator">:</span> '<span class="token number">13</span>'
  'content-type'<span class="token operator">:</span> 'application/json; charset=utf<span class="token number">-8</span>'
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="parseheaders-函数实现及应用"><a class="header-anchor" href="#parseheaders-函数实现及应用">#</a> parseHeaders 函数实现及应用</h2>
<p>根据需求分析，我们要实现一个 <code>parseHeaders</code> 工具函数。</p>
<p><code>helpers/headers.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">parseHeaders</span><span class="token punctuation">(</span>headers<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> parsed <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>headers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> parsed
  <span class="token punctuation">}</span>

  headers<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">'\r\n'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>line <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> <span class="token punctuation">[</span>key<span class="token punctuation">,</span> val<span class="token punctuation">]</span> <span class="token operator">=</span> line<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">':'</span><span class="token punctuation">)</span>
    key <span class="token operator">=</span> key<span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      val <span class="token operator">=</span> val<span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    parsed<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> val
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> parsed
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>然后我们使用这个工具函数：</p>
<p><code>xhr.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> responseHeaders <span class="token operator">=</span> <span class="token function">parseHeaders</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span><span class="token function">getAllResponseHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>接着我们再去看刚才的 demo，发现我们已经把响应的 <code>headers</code> 字段从字符串解析成对象结构了。那么接下来，我们在解决之前遗留的第二个问题：对响应 <code>data</code> 字段的处理。</p>
</template>