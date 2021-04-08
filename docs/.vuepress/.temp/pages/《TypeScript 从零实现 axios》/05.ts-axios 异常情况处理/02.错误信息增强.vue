<template><h1 id="错误信息增强"><a class="header-anchor" href="#错误信息增强">#</a> 错误信息增强</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>上一节课我们已经捕获了几类 AJAX 的错误，但是对于错误信息提供的非常有限，我们希望对外提供的信息不仅仅包含错误文本信息，还包括了请求对象配置 <code>config</code>，错误代码 <code>code</code>，<code>XMLHttpRequest</code> 对象实例 <code>request</code>以及自定义响应对象 <code>response</code>。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/error/timeout'</span><span class="token punctuation">,</span>
  timeout<span class="token operator">:</span> <span class="token number">2000</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>request<span class="token punctuation">)</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>code<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>这样对于应用方来说，他们就可以捕获到这些错误的详细信息，做进一步的处理。</p>
<p>那么接下来，我们就来对错误信息做增强。</p>
<h2 id="创建-axioserror-类"><a class="header-anchor" href="#创建-axioserror-类">#</a> 创建 AxiosError 类</h2>
<p>我们先来定义 <code>AxiosError</code> 类型接口，用于外部使用。</p>
<p><code>types/index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosError</span> <span class="token keyword">extends</span> <span class="token class-name">Error</span> <span class="token punctuation">{</span>
  config<span class="token operator">:</span> AxiosRequestConfig
  code<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  request<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span>
  response<span class="token operator">?</span><span class="token operator">:</span> AxiosResponse
  isAxiosError<span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>接着我们创建 <code>error.ts</code> 文件，然后实现 <code>AxiosError</code> 类，它是继承于 <code>Error</code> 类。</p>
<p><code>helpers/error.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> AxiosRequestConfig<span class="token punctuation">,</span> AxiosResponse <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../types'</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AxiosError</span> <span class="token keyword">extends</span> <span class="token class-name">Error</span> <span class="token punctuation">{</span>
  isAxiosError<span class="token operator">:</span> <span class="token builtin">boolean</span>
  config<span class="token operator">:</span> AxiosRequestConfig
  code<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span>
  request<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span>
  response<span class="token operator">?</span><span class="token operator">:</span> AxiosResponse

  <span class="token keyword">constructor</span><span class="token punctuation">(</span>
    message<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>
    config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">,</span>
    code<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    request<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span>
    response<span class="token operator">?</span><span class="token operator">:</span> AxiosResponse
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>config <span class="token operator">=</span> config
    <span class="token keyword">this</span><span class="token punctuation">.</span>code <span class="token operator">=</span> code
    <span class="token keyword">this</span><span class="token punctuation">.</span>request <span class="token operator">=</span> request
    <span class="token keyword">this</span><span class="token punctuation">.</span>response <span class="token operator">=</span> response
    <span class="token keyword">this</span><span class="token punctuation">.</span>isAxiosError <span class="token operator">=</span> <span class="token boolean">true</span>

    Object<span class="token punctuation">.</span><span class="token function">setPrototypeOf</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> AxiosError<span class="token punctuation">.</span>prototype<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createError</span><span class="token punctuation">(</span>
  message<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>
  config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">,</span>
  code<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  request<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span>
  response<span class="token operator">?</span><span class="token operator">:</span> AxiosResponse
<span class="token punctuation">)</span><span class="token operator">:</span> AxiosError <span class="token punctuation">{</span>
  <span class="token keyword">const</span> error <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AxiosError</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> config<span class="token punctuation">,</span> code<span class="token punctuation">,</span> request<span class="token punctuation">,</span> response<span class="token punctuation">)</span>

  <span class="token keyword">return</span> error
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br></div></div><p><code>AxiosError</code> 继承于 <code>Error</code> 类，添加了一些自己的属性：<code>config</code>、<code>code</code>、<code>request</code>、<code>response</code>、<code>isAxiosError</code> 等属性。这里要注意一点，我们使用了 <code>Object.setPrototypeOf(this, AxiosError.prototype)</code>，这段代码的目的是为了解决 TypeScript 继承一些内置对象的时候的坑，<a href="https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work" target="_blank" rel="noopener noreferrer">参考<OutboundLink/></a>。</p>
<p>另外，为了方便使用，我们对外暴露了一个 <code>createError</code> 的工厂方法。</p>
<h2 id="createerror-方法应用"><a class="header-anchor" href="#createerror-方法应用">#</a> createError 方法应用</h2>
<p>修改关于错误对象创建部分的逻辑，如下：</p>
<p><code>xhr.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createError <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./helpers/error'</span>

request<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">handleError</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">reject</span><span class="token punctuation">(</span><span class="token function">createError</span><span class="token punctuation">(</span>
    <span class="token string">'Network Error'</span><span class="token punctuation">,</span>
    config<span class="token punctuation">,</span>
    <span class="token keyword">null</span><span class="token punctuation">,</span>
    request
  <span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

request<span class="token punctuation">.</span><span class="token function-variable function">ontimeout</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">handleTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">reject</span><span class="token punctuation">(</span><span class="token function">createError</span><span class="token punctuation">(</span>
    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Timeout of </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>config<span class="token punctuation">.</span>timeout<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> ms exceeded</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
    config<span class="token punctuation">,</span>
    <span class="token string">'ECONNABORTED'</span><span class="token punctuation">,</span>
    request
  <span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">handleResponse</span><span class="token punctuation">(</span>response<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>response<span class="token punctuation">.</span>status <span class="token operator">>=</span> <span class="token number">200</span> <span class="token operator">&amp;&amp;</span> response<span class="token punctuation">.</span>status <span class="token operator">&lt;</span> <span class="token number">300</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token function">reject</span><span class="token punctuation">(</span><span class="token function">createError</span><span class="token punctuation">(</span>
      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Request failed with status code </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>response<span class="token punctuation">.</span>status<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
      config<span class="token punctuation">,</span>
      <span class="token keyword">null</span><span class="token punctuation">,</span>
      request<span class="token punctuation">,</span>
      response
    <span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><h2 id="导出类型定义"><a class="header-anchor" href="#导出类型定义">#</a> 导出类型定义</h2>
<p>在 demo 中，TypeScript 并不能把 <code>e</code> 参数推断为 <code>AxiosError</code> 类型，于是我们需要手动指明类型，为了让外部应用能引入 <code>AxiosError</code> 类型，我们也需要把它们导出。</p>
<p>我们创建 <code>axios.ts</code> 文件，把之前的 <code>index.ts</code> 的代码拷贝过去，然后修改 <code>index.ts</code> 的代码。</p>
<p><code>index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">'./axios'</span>

<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">'./types'</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> axios
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>这样我们在 demo 中就可以引入 <code>AxiosError</code> 类型了。</p>
<p><code>examples/error/app.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios<span class="token punctuation">,</span> <span class="token punctuation">{</span> AxiosError <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../../src/index'</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/error/timeout'</span><span class="token punctuation">,</span>
  timeout<span class="token operator">:</span> <span class="token number">2000</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>code<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>至此，我们关于 <code>ts-axios</code> 的异常处理逻辑就告一段落。下面的章节，我们会对 <code>ts-axios</code> 的接口做扩展，让它提供更多好用和方便的 API。</p>
</template>