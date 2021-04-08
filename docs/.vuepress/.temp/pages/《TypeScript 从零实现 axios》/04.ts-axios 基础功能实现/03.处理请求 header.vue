<template><h1 id="处理请求-header"><a class="header-anchor" href="#处理请求-header">#</a> 处理请求 header</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>我们上节课遗留了一个问题：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>我们做了请求数据的处理，把 <code>data</code> 转换成了 JSON 字符串，但是数据发送到服务端的时候，服务端并不能正常解析我们发送的数据，因为我们并没有给请求 <code>header</code> 设置正确的 <code>Content-Type </code>。</p>
<p>所以首先我们要支持发送请求的时候，可以支持配置 <code>headers</code> 属性，如下：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string">'content-type'</span><span class="token operator">:</span> <span class="token string">'application/json;charset=utf-8'</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>并且在当我们传入的 <code>data</code> 为普通对象的时候，<code>headers</code> 如果没有配置 <code>Content-Type</code> 属性，需要自动设置请求 <code>header</code> 的 <code>Content-Type</code> 字段为：<code>application/json;charset=utf-8</code>。</p>
<h2 id="processheaders-函数实现"><a class="header-anchor" href="#processheaders-函数实现">#</a> processHeaders 函数实现</h2>
<p>根据需求分析，我们要实现一个工具函数，对 request 中的 <code>headers</code> 做一层加工。我们在 <code>helpers</code> 目录新建 <code>headers.ts</code> 文件。</p>
<p><code>helpers/headers.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> isPlainObject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./util'</span>

<span class="token keyword">function</span> <span class="token function">normalizeHeaderName</span> <span class="token punctuation">(</span>headers<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> normalizedName<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>headers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>
  Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>headers<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>name <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>name <span class="token operator">!==</span> normalizedName <span class="token operator">&amp;&amp;</span> name<span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">===</span> normalizedName<span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      headers<span class="token punctuation">[</span>normalizedName<span class="token punctuation">]</span> <span class="token operator">=</span> headers<span class="token punctuation">[</span>name<span class="token punctuation">]</span>
      <span class="token keyword">delete</span> headers<span class="token punctuation">[</span>name<span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">processHeaders</span> <span class="token punctuation">(</span>headers<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token function">normalizeHeaderName</span><span class="token punctuation">(</span>headers<span class="token punctuation">,</span> <span class="token string">'Content-Type'</span><span class="token punctuation">)</span>
  
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>headers <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>headers<span class="token punctuation">[</span><span class="token string">'Content-Type'</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      headers<span class="token punctuation">[</span><span class="token string">'Content-Type'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">'application/json;charset=utf-8'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> headers
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><p>这里有个需要注意的点，因为请求 <code>header</code> 属性是大小写不敏感的，比如我们之前的例子传入 <code>header</code> 的属性名 <code>content-type</code> 就是全小写的，所以我们先要把一些 <code>header</code> 属性名规范化。</p>
<h2 id="实现请求-header-处理逻辑"><a class="header-anchor" href="#实现请求-header-处理逻辑">#</a> 实现请求 header 处理逻辑</h2>
<p>在这之前，我们先修改一下 <code>AxiosRequestConfig</code> 接口类型的定义，添加 <code>headers</code> 这个可选属性：</p>
<p><code>types/index.ts</code></p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosRequestConfig</span> <span class="token punctuation">{</span>
  url<span class="token operator">:</span> <span class="token builtin">string</span>
  method<span class="token operator">?</span><span class="token operator">:</span> Method
  data<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span>
  params<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span>
  headers<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><code>index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">processConfig</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  config<span class="token punctuation">.</span>url <span class="token operator">=</span> <span class="token function">transformURL</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>headers <span class="token operator">=</span> <span class="token function">transformHeaders</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token function">transformRequestData</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">transformHeaders</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> headers <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> data <span class="token punctuation">}</span> <span class="token operator">=</span> config
  <span class="token keyword">return</span> <span class="token function">processHeaders</span><span class="token punctuation">(</span>headers<span class="token punctuation">,</span> data<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>因为我们处理 <code>header</code> 的时候依赖了 <code>data</code>，所以要在处理请求 <code>body</code> 数据之前处理请求 <code>header</code>。</p>
<p><code>xhr.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">xhr</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> data <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span> url<span class="token punctuation">,</span> method <span class="token operator">=</span> <span class="token string">'get'</span><span class="token punctuation">,</span> headers <span class="token punctuation">}</span> <span class="token operator">=</span> config

  <span class="token keyword">const</span> request <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">XMLHttpRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  request<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span>method<span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> url<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>

  Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>headers<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>data <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> name<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">'content-type'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">delete</span> headers<span class="token punctuation">[</span>name<span class="token punctuation">]</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">setRequestHeader</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> headers<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  request<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>这里要额外判断一个逻辑，当我们传入的 <code>data</code> 为空的时候，请求 <code>header</code> 配置 <code>Content-Type</code> 是没有意义的，于是我们把它删除。</p>
<h2 id="demo-编写"><a class="header-anchor" href="#demo-编写">#</a> demo 编写</h2>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string">'content-type'</span><span class="token operator">:</span> <span class="token string">'application/json;'</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> paramsString <span class="token operator">=</span> <span class="token string">'q=URLUtils.searchParams&amp;topic=api'</span>
<span class="token keyword">const</span> searchParams <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">URLSearchParams</span><span class="token punctuation">(</span>paramsString<span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> searchParams
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>通过 demo 我们可以看到，当我们请求的数据是普通对象并且没有配置 <code>headers</code> 的时候，会自动为其添加 <code>Content-Type:application/json;charset=utf-8</code>；同时我们发现当 data 是某些类型如 <code>URLSearchParams</code> 的时候，浏览器会自动为请求 <code>header</code>加上合适的 <code>Content-Type</code>。</p>
<p>至此我们对于请求的处理逻辑暂时告一段落。目前我们的请求从网络层面是可以收到服务端的响应的，下一节课我们就从代码层面来处理服务端响应，并且让调用方可以拿到从服务端返回的数据。</p>
</template>