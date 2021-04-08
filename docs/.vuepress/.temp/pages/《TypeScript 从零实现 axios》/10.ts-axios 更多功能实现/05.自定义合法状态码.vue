<template><h1 id="自定义合法状态码"><a class="header-anchor" href="#自定义合法状态码">#</a> 自定义合法状态码</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>之前 <code>ts-axios</code> 在处理响应结果的时候，认为 HTTP <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status" target="_blank" rel="noopener noreferrer">status<OutboundLink/></a> 在 200 和 300 之间是一个合法值，在这个区间之外则创建一个错误。有些时候我们想自定义这个规则，比如认为 304 也是一个合法的状态码，所以我们希望 <code>ts-axios</code> 能提供一个配置，允许我们自定义合法状态码规则。如下：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>axios<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/more/304'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function">validateStatus</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> status <span class="token operator">>=</span> <span class="token number">200</span> <span class="token operator">&amp;&amp;</span> status <span class="token operator">&lt;</span> <span class="token number">400</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>通过在请求配置中配置一个 <code>validateStatus</code> 函数，它可以根据参数 <code>status</code> 来自定义合法状态码的规则。</p>
<h2 id="代码实现"><a class="header-anchor" href="#代码实现">#</a> 代码实现</h2>
<p>首先修改一下类型定义。</p>
<p><code>types/index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosRequestConfig</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  validateStatus<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>status<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token builtin">boolean</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>然后我们来修改默认配置规则。</p>
<p><code>defaults.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token function">validateStatus</span><span class="token punctuation">(</span>status<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> status <span class="token operator">>=</span> <span class="token number">200</span> <span class="token operator">&amp;&amp;</span> status <span class="token operator">&lt;</span> <span class="token number">300</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>添加默认合法状态码的校验规则。然后再请求后对响应数据的处理逻辑。</p>
<p><code>core/xhr.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span>
  <span class="token comment">/*...*/</span>
  validateStatus
<span class="token punctuation">}</span> <span class="token operator">=</span> config

<span class="token keyword">function</span> <span class="token function">handleResponse</span><span class="token punctuation">(</span>response<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>validateStatus <span class="token operator">||</span> <span class="token function">validateStatus</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>status<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token function">reject</span><span class="token punctuation">(</span>
      <span class="token function">createError</span><span class="token punctuation">(</span>
        <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Request failed with status code </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>response<span class="token punctuation">.</span>status<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
        config<span class="token punctuation">,</span>
        <span class="token keyword">null</span><span class="token punctuation">,</span>
        request<span class="token punctuation">,</span>
        response
      <span class="token punctuation">)</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>如果没有配置 <code>validateStatus</code> 以及 <code>validateStatus</code> 函数返回的值为 true 的时候，都认为是合法的，正常 <code>resolve(response)</code>，否则都创建一个错误。</p>
<h2 id="demo-编写"><a class="header-anchor" href="#demo-编写">#</a> demo 编写</h2>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>axios<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/more/304'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

axios<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/more/304'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function">validateStatus</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> status <span class="token operator">>=</span> <span class="token number">200</span> <span class="token operator">&amp;&amp;</span> status <span class="token operator">&lt;</span> <span class="token number">400</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p><code>server.js</code> 中我们编写了这个路由接口</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>
router<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'/more/304'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">304</span><span class="token punctuation">)</span>
  res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>接口返回 304 状态码，对于默认的请求我们会输出一条错误信息。第二个请求中我们配置了自定义合法状态码规则，区间在 200 和 400 之间，这样就不会报错，而是可以正常输出响应对象。</p>
<p>至此 <code>ts-axios</code> 实现了自定义合法状态码功能，用户可以配置 <code>validateStatus</code> 自定义合法状态码规则。之前有同学会质疑 <code>ts-axios</code> 对于请求 <code>url</code> 参数的序列化处理规则，下一节课我们来实现自定义参数序列化规则功能。</p>
</template>