<template><h1 id="请求和响应配置化"><a class="header-anchor" href="#请求和响应配置化">#</a> 请求和响应配置化</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>官方的 axios 库 给默认配置添加了 <code>transformRequest</code> 和 <code>transformResponse</code> 两个字段，它们的值是一个数组或者是一个函数。</p>
<p>其中 <code>transformRequest</code> 允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 <code>put</code>、<code>post</code> 和 <code>patch</code>，如果值是数组，则数组中的最后一个函数必须返回一个字符串或 <code>FormData</code>、<code>URLSearchParams</code>、<code>Blob</code> 等类型作为 <code>xhr.send</code> 方法的参数，而且在 <code>transform</code> 过程中可以修改  <code>headers</code> 对象。</p>
<p>而 <code>transformResponse</code> 允许你在把响应数据传递给 <code>then</code> 或者 <code>catch</code> 之前对它们进行修改。</p>
<p>当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。</p>
<p>举个例子：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  transformRequest<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> qs<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">...</span>axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>transformRequest<span class="token punctuation">]</span><span class="token punctuation">,</span>
  transformResponse<span class="token operator">:</span> <span class="token punctuation">[</span>axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>transformResponse<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> data <span class="token operator">===</span> <span class="token string">'object'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">2</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> data
  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/config/post'</span><span class="token punctuation">,</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h2 id="修改默认配置"><a class="header-anchor" href="#修改默认配置">#</a> 修改默认配置</h2>
<p>先修改 <code>AxiosRequestConfig</code> 的类型定义，添加 <code>transformRequest</code> 和 <code>transformResponse</code> 俩个可选属性。</p>
<p><code>types/index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosRequestConfig</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  transformRequest<span class="token operator">?</span><span class="token operator">:</span> AxiosTransformer <span class="token operator">|</span> AxiosTransformer<span class="token punctuation">[</span><span class="token punctuation">]</span>
  transformResponse<span class="token operator">?</span><span class="token operator">:</span> AxiosTransformer <span class="token operator">|</span> AxiosTransformer<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosTransformer</span> <span class="token punctuation">{</span>
  <span class="token punctuation">(</span>data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> headers<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>接着修改默认配置，如下：</p>
<p><code>defaults.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> processHeaders <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./helpers/headers'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformRequest<span class="token punctuation">,</span> transformResponse <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./helpers/data'</span>

<span class="token keyword">const</span> defaults<span class="token operator">:</span> AxiosRequestConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  transformRequest<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> headers<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
      <span class="token function">processHeaders</span><span class="token punctuation">(</span>headers<span class="token punctuation">,</span> data<span class="token punctuation">)</span>
      <span class="token keyword">return</span> <span class="token function">transformRequest</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>

  transformResponse<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">transformResponse</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>我们把之前对请求数据和响应数据的处理逻辑，放到了默认配置中，也就是默认处理逻辑。</p>
<h2 id="transform-逻辑重构"><a class="header-anchor" href="#transform-逻辑重构">#</a> transform 逻辑重构</h2>
<p>接下来，我们就要重构之前写的对请求数据和响应数据的处理逻辑了。由于我们可能会编写多个转换函数，我们先定义一个 <code>transform</code> 函数来处理这些转换函数的调用逻辑。</p>
<p><code>core/transform.ts</code></p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> AxiosTransformer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../types'</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">transform</span><span class="token punctuation">(</span>
  data<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span>
  headers<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span>
  fns<span class="token operator">?</span><span class="token operator">:</span> AxiosTransformer <span class="token operator">|</span> AxiosTransformer<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>fns<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> data
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>fns<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    fns <span class="token operator">=</span> <span class="token punctuation">[</span>fns<span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  fns<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>fn <span class="token operator">=></span> <span class="token punctuation">{</span>
    data <span class="token operator">=</span> <span class="token function">fn</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> headers<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token keyword">return</span> data
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p><code>transform</code> 函数中接收 <code>data</code>、<code>headers</code>、<code>fns</code> 3 个参数，其中 <code>fns</code> 代表一个或者多个转换函数，内部逻辑很简单，遍历 <code>fns</code>，执行这些转换函数，并且把 <code>data</code> 和 <code>headers</code> 作为参数传入，每个转换函数返回的 <code>data</code> 会作为下一个转换函数的参数 <code>data</code> 传入。</p>
<p>接下来修改对请求数据和响应数据的处理逻辑。</p>
<p><code>dispatchRequest.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>
<span class="token keyword">import</span> transform <span class="token keyword">from</span> <span class="token string">'./transform'</span>

<span class="token keyword">function</span> <span class="token function">processConfig</span><span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  config<span class="token punctuation">.</span>url <span class="token operator">=</span> <span class="token function">transformURL</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token function">transform</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>data<span class="token punctuation">,</span> config<span class="token punctuation">.</span>headers<span class="token punctuation">,</span> config<span class="token punctuation">.</span>transformRequest<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>headers <span class="token operator">=</span> <span class="token function">flattenHeaders</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>headers<span class="token punctuation">,</span> config<span class="token punctuation">.</span>method<span class="token operator">!</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">transformResponseData</span><span class="token punctuation">(</span>res<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span><span class="token operator">:</span> AxiosResponse <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token function">transform</span><span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">,</span> res<span class="token punctuation">.</span>headers<span class="token punctuation">,</span> res<span class="token punctuation">.</span>config<span class="token punctuation">.</span>transformResponse<span class="token punctuation">)</span>
  <span class="token keyword">return</span> res
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>我们把对请求数据的处理和对响应数据的处理改成使用 <code>transform</code> 函数实现，并把配置中的 <code>transformRequest</code> 及 <code>transformResponse</code> 分别传入。</p>
<h2 id="demo-编写"><a class="header-anchor" href="#demo-编写">#</a> demo 编写</h2>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  transformRequest<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> qs<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">...</span><span class="token punctuation">(</span>axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>transformRequest <span class="token keyword">as</span> AxiosTransformer<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  transformResponse<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token punctuation">(</span>axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>transformResponse <span class="token keyword">as</span> AxiosTransformer<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> data <span class="token operator">===</span> <span class="token string">'object'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">2</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> data
  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  url<span class="token operator">:</span> <span class="token string">'/config/post'</span><span class="token punctuation">,</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>我们对 <code>transformRequest</code> 做了修改，在执行它默认的 <code>transformRequest</code> 之前，我们先用 <code>qs.stringify</code> 库对传入的数据 <code>data</code> 做了一层转换。同时也对 <code>transformResponse</code> 做了修改，在执行完默认的 <code>transformResponse</code> 后，会给响应的 <code>data</code> 对象添加一个 <code>data.b = 2</code>。</p>
<p>因为之前我们实现了配置的合并，而且我们传入的 <code>transformRequest</code> 和 <code>transformResponse</code> 遵循默认合并策略，它们会覆盖默认的值。</p>
<p>至此，我们就实现了请求和响应的配置化。到目前为止，我们的 axios 都是一个单例，一旦我们修改了 axios 的默认配置，会影响所有的请求。官网提供了一个 <code>axios.create</code> 的工厂方法允许我们创建一个新的 <code>axios</code> 实例，同时允许我们传入新的配置和默认配置合并，并做为新的默认配置。下面一节课我们就来实现这个 feature。</p>
</template>