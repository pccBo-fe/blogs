<template><h1 id="处理请求-body-数据"><a class="header-anchor" href="#处理请求-body-数据">#</a> 处理请求 body 数据</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>我们通过执行 <code>XMLHttpRequest</code> 对象实例的 <code>send</code> 方法来发送请求，并通过该方法的参数设置请求 <code>body</code> 数据，我们可以去 <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send" target="_blank" rel="noopener noreferrer">mdn<OutboundLink/></a> 查阅该方法支持的参数类型。</p>
<p>我们发现 <code>send</code> 方法的参数支持 <code>Document</code> 和 <code>BodyInit</code> 类型，<code>BodyInit</code> 包括了 <code>Blob</code>, <code>BufferSource</code>, <code>FormData</code>, <code>URLSearchParams</code>, <code>ReadableStream</code>、<code>USVString</code>，当没有数据的时候，我们还可以传入 <code>null</code>。</p>
<p>但是我们最常用的场景还是传一个普通对象给服务端，例如：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span> 
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span> 
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>这个时候 <code>data</code>是不能直接传给 <code>send</code> 函数的，我们需要把它转换成 JSON 字符串。</p>
<h2 id="transformrequest-函数实现"><a class="header-anchor" href="#transformrequest-函数实现">#</a> transformRequest 函数实现</h2>
<p>根据需求分析，我们要实现一个工具函数，对 request 中的 <code>data</code> 做一层转换。我们在 <code>helpers</code> 目录新建 <code>data.ts</code> 文件。</p>
<p><code>helpers/data.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> isPlainObject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./util'</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">transformRequest</span> <span class="token punctuation">(</span>data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> data
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><code>helpers/util.js</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isPlainObject</span> <span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> val <span class="token keyword">is</span> Object <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">toString</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">'[object Object]'</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>这里为什么要使用 <code>isPlainObject</code> 函数判断，而不用之前的 <code>isObject</code> 函数呢，因为 <code>isObject</code> 的判断方式，对于 <code>FormData</code>、<code>ArrayBuffer</code> 这些类型，<code>isObject</code> 判断也为 <code>true</code>，但是这些类型的数据我们是不需要做处理的，而 <code>isPlainObject</code> 的判断方式，只有我们定义的普通 <code>JSON</code> 对象才能满足。</p>
<p><code>helpers/url.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDate</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  val <span class="token operator">=</span> val<span class="token punctuation">.</span><span class="token function">toISOString</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  val <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>对于上节课我们对请求参数值的判断，我们也应该用 <code>isPlainObject</code> 才更加合理。</p>
<p><code>helpers/util.js</code></p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token comment">// export function isObject (val: any): val is Object {</span>
<span class="token comment">//   return val !== null &amp;&amp; typeof val === 'object'</span>
<span class="token comment">// }</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>既然现在 <code>isObject</code> 方法不再使用，我们先将其注释。</p>
<h2 id="实现请求-body-处理逻辑"><a class="header-anchor" href="#实现请求-body-处理逻辑">#</a> 实现请求 body 处理逻辑</h2>
<p><code>index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> transformRequest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./helpers/data'</span>

<span class="token template-string"><span class="token template-punctuation string">`</span><span class="token template-punctuation string">`</span></span>`typescript
<span class="token keyword">function</span> <span class="token function">processConfig</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  config<span class="token punctuation">.</span>url <span class="token operator">=</span> <span class="token function">transformURL</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token function">transformRequestData</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">transformRequestData</span> <span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">transformRequest</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>data<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>我们定义了 <code>transformRequestData</code> 函数，去转换请求 <code>body</code> 的数据，内部调用了我们刚刚实现的的 <code>transformRequest</code> 方法。</p>
<p>然后我们在 <code>processConfig</code> 内部添加了这段逻辑，在处理完 url 后接着对 <code>config</code> 中的 <code>data</code> 做处理。</p>
<h2 id="编写-demo"><a class="header-anchor" href="#编写-demo">#</a> 编写 demo</h2>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    b<span class="token operator">:</span> <span class="token number">2</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Int32Array</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">21</span><span class="token punctuation">,</span> <span class="token number">31</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/base/buffer'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> arr
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>我们在 <code>examples/base/app.ts</code> 添加 2 段代码，第一个 post 请求的 <code>data</code> 是一个普通对象，第二个请求的 <code>data</code> 是一个 <code>Int32Array</code> 类型的数据，它是可以直接传给 <code>XMLHttpRequest</code> 对象的 <code>send</code> 方法的。</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>router<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/base/post'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>body<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

router<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/base/buffer'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> msg <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  req<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'data'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">chunk</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>chunk<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      msg<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>chunk<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  req<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'end'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> buf <span class="token operator">=</span> Buffer<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
    res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>buf<span class="token punctuation">.</span><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>我们接着在 <code>examples/server.js</code> 中添加 2 个路由，分别针对这俩种请求，返回请求传入的数据。</p>
<p>然后我们打开浏览器运行 demo，看一下结果，我们发现 <code>/base/buffer</code> 的请求是可以拿到数据，但是 <code>base/post</code> 请求的 response 里却返回的是一个空对象，这是什么原因呢？</p>
<p>实际上是因为我们虽然执行 <code>send</code> 方法的时候把普通对象 <code>data</code> 转换成一个 <code>JSON</code> 字符串，但是我们请求<code>header</code> 的 <code>Content-Type</code> 是 <code>text/plain;charset=UTF-8</code>，导致了服务端接受到请求并不能正确解析请求 <code>body</code> 的数据。</p>
<p>知道这个问题后，下面一节课我们来实现对请求 <code>header</code> 的处理。</p>
</template>