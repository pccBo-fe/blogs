<template><h1 id="处理请求-url-参数"><a class="header-anchor" href="#处理请求-url-参数">#</a> 处理请求 url 参数</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>还记得我们上节课遗留了一个问题，再来看这个例子：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>我们希望最终请求的 <code>url</code> 是 <code>/base/get?a=1&amp;b=2</code>，这样服务端就可以通过请求的 url 解析到我们传来的参数数据了。实际上就是把 <code>params</code> 对象的 key 和 value 拼接到 <code>url</code> 上。</p>
<p>再来看几个更复杂的例子。</p>
<h3 id="参数值为数组"><a class="header-anchor" href="#参数值为数组">#</a> 参数值为数组</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'bar'</span><span class="token punctuation">,</span> <span class="token string">'baz'</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?foo[]=bar&amp;foo[]=baz'</code>。</p>
<h3 id="参数值为对象"><a class="header-anchor" href="#参数值为对象">#</a> 参数值为对象</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token punctuation">{</span>
      bar<span class="token operator">:</span> <span class="token string">'baz'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?foo=%7B%22bar%22:%22baz%22%7D</code>，<code>foo</code> 后面拼接的是 <code>{&quot;bar&quot;:&quot;baz&quot;}</code> encode 后的结果。</p>
<h3 id="参数值为-date-类型"><a class="header-anchor" href="#参数值为-date-类型">#</a> 参数值为 Date 类型</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    date
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?date=2019-04-01T05:55:39.030Z</code>，<code>date</code> 后面拼接的是 <code>date.toISOString()</code> 的结果。</p>
<h3 id="特殊字符支持"><a class="header-anchor" href="#特殊字符支持">#</a> 特殊字符支持</h3>
<p>对于字符 <code>@</code>、<code>:</code>、<code>$</code>、<code>,</code>、<code> </code>、<code>[</code>、<code>]</code>，我们是允许出现在 <code>url</code> 中的，不希望被 encode。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token string">'@:$, '</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?foo=@:$+</code>，注意，我们会把空格 <code> </code> 转换成 <code>+</code>。</p>
<h3 id="空值忽略"><a class="header-anchor" href="#空值忽略">#</a> 空值忽略</h3>
<p>对于值为 <code>null</code> 或者 <code>undefined</code> 的属性，我们是不会添加到 url 参数中的。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token string">'bar'</span><span class="token punctuation">,</span>
    baz<span class="token operator">:</span> <span class="token keyword">null</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?foo=bar</code>。</p>
<h3 id="丢弃-url-中的哈希标记"><a class="header-anchor" href="#丢弃-url-中的哈希标记">#</a> 丢弃 url 中的哈希标记</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get#hash'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token string">'bar'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?foo=bar</code></p>
<h3 id="保留-url-中已存在的参数"><a class="header-anchor" href="#保留-url-中已存在的参数">#</a> 保留 url 中已存在的参数</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get?foo=bar'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    bar<span class="token operator">:</span> <span class="token string">'baz'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>最终请求的 <code>url</code> 是 <code>/base/get?foo=bar&amp;bar=baz</code></p>
<h2 id="buildurl-函数实现"><a class="header-anchor" href="#buildurl-函数实现">#</a> buildURL 函数实现</h2>
<p>根据我们之前的需求分析，我们要实现一个工具函数，把 <code>params</code> 拼接到 <code>url</code> 上。我们希望把项目中的一些工具函数、辅助方法独立管理，于是我们创建一个 <code>helpers</code> 目录，在这个目录下创建 <code>url.ts</code> 文件，未来会把处理 <code>url</code> 相关的工具函数都放在该文件中。</p>
<p><code>helpers/url.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> isDate<span class="token punctuation">,</span> isObject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./util'</span>

<span class="token keyword">function</span> <span class="token function">encode</span> <span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">encodeURIComponent</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%40</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span><span class="token punctuation">,</span> <span class="token string">'@'</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%3A</span><span class="token regex-delimiter">/</span><span class="token regex-flags">gi</span></span><span class="token punctuation">,</span> <span class="token string">':'</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%24</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span><span class="token punctuation">,</span> <span class="token string">'$'</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%2C</span><span class="token regex-delimiter">/</span><span class="token regex-flags">gi</span></span><span class="token punctuation">,</span> <span class="token string">','</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%20</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span><span class="token punctuation">,</span> <span class="token string">'+'</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%5B</span><span class="token regex-delimiter">/</span><span class="token regex-flags">gi</span></span><span class="token punctuation">,</span> <span class="token string">'['</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">%5D</span><span class="token regex-delimiter">/</span><span class="token regex-flags">gi</span></span><span class="token punctuation">,</span> <span class="token string">']'</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">bulidURL</span> <span class="token punctuation">(</span>url<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> params<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>params<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> url
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> parts<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>params<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> val <span class="token operator">=</span> params<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> val <span class="token operator">===</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> values<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      values <span class="token operator">=</span> val
      key <span class="token operator">+=</span> <span class="token string">'[]'</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      values <span class="token operator">=</span> <span class="token punctuation">[</span>val<span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
    values<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDate</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        val <span class="token operator">=</span> val<span class="token punctuation">.</span><span class="token function">toISOString</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isObject</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        val <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      parts<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token function">encode</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token function">encode</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">let</span> serializedParams <span class="token operator">=</span> parts<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">'&amp;'</span><span class="token punctuation">)</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>serializedParams<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> markIndex <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">'#'</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>markIndex <span class="token operator">!==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      url <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> markIndex<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    url <span class="token operator">+=</span> <span class="token punctuation">(</span>url<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">'?'</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">?</span> <span class="token string">'?'</span> <span class="token operator">:</span> <span class="token string">'&amp;'</span><span class="token punctuation">)</span> <span class="token operator">+</span> serializedParams
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> url
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br></div></div><p><code>helpers/util.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> toString <span class="token operator">=</span> Object<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>toString

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isDate</span> <span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> val <span class="token keyword">is</span> Date <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">toString</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">'[object Date]'</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isObject</span> <span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> val <span class="token keyword">is</span> Object <span class="token punctuation">{</span>
  <span class="token keyword">return</span> val <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> val <span class="token operator">===</span> <span class="token string">'object'</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="实现-url-参数处理逻辑"><a class="header-anchor" href="#实现-url-参数处理逻辑">#</a> 实现 url 参数处理逻辑</h2>
<p>我们已经实现了 <code>buildURL</code> 函数，接下来我们来利用它实现 <code>url</code> 参数的处理逻辑。</p>
<p>在 <code>index.ts</code> 文件中添加如下代码：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">axios</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token function">processConfig</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  <span class="token function">xhr</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">processConfig</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  config<span class="token punctuation">.</span>url <span class="token operator">=</span> <span class="token function">transformUrl</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">transformUrl</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> url<span class="token punctuation">,</span> params <span class="token punctuation">}</span> <span class="token operator">=</span> config
  <span class="token keyword">return</span> <span class="token function">bulidURL</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> params<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>在执行 <code>xhr</code> 函数前，我们先执行 <code>processConfig</code> 方法，对 <code>config</code> 中的数据做处理，除了对 <code>url</code> 和 <code>params</code> 处理之外，未来还会处理其它属性。</p>
<p>在 <code>processConfig</code> 函数内部，我们通过执行 <code>transformUrl</code> 函数修改了 <code>config.url</code>，该函数内部调用了 <code>buildURL</code>。</p>
<p>那么至此，我们对 <code>url</code> 参数处理逻辑就实现完了，接下来我们就开始编写 demo 了。</p>
<h2 id="demo-编写"><a class="header-anchor" href="#demo-编写">#</a> demo 编写</h2>
<p>在 <code>examples</code> 目录下创建 <code>base</code> 目录，在 <code>base</code> 目录下创建 <code>index.html</code>:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>utf-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Base example<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/__build__/base.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>接着创建 <code>app.ts</code> 作为入口文件：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">'../../src/index'</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'bar'</span><span class="token punctuation">,</span> <span class="token string">'baz'</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token punctuation">{</span>
      bar<span class="token operator">:</span> <span class="token string">'baz'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    date
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token string">'@:$, '</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token string">'bar'</span><span class="token punctuation">,</span>
    baz<span class="token operator">:</span> <span class="token keyword">null</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get#hash'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    foo<span class="token operator">:</span> <span class="token string">'bar'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/get?foo=bar'</span><span class="token punctuation">,</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    bar<span class="token operator">:</span> <span class="token string">'baz'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br></div></div><p>接着在 <code>server.js</code> 添加新的接口路由：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>router<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/base/get'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>query<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>然后在命令行运行 <code>npm run dev</code>，接着打开 chrome 浏览器，访问 <code>http://localhost:8080/</code> 即可访问我们的 demo 了，我们点到 <code>Base</code> 目录下，通过开发者工具的 network 部分我们可以看到成功发送的多条请求，并可以观察它们最终请求的 url，已经如期添加了请求参数。</p>
<p>那么至此我们的请求 <code>url</code> 参数处理编写完了，下一小节我们会对 <code>request body</code> 数据做处理。</p>
</template>