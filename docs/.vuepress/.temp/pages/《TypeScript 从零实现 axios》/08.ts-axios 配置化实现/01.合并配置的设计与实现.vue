<template><h1 id="合并配置的设计与实现"><a class="header-anchor" href="#合并配置的设计与实现">#</a> 合并配置的设计与实现</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>在之前的章节我们了解到，在发送请求的时候可以传入一个配置，来决定请求的不同行为。我们也希望 <code>ts-axios</code> 可以有默认配置，定义一些默认的行为。这样在发送每个请求，用户传递的配置可以和默认配置做一层合并。</p>
<p>和官网 <code>axios</code> 库保持一致，我们给 <code>axios</code> 对象添加一个 <code>defaults</code> 属性，表示默认配置，你甚至可以直接修改这些默认配置：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>common<span class="token punctuation">[</span><span class="token string">'test'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">123</span>
axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>post<span class="token punctuation">[</span><span class="token string">'Content-Type'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">'application/x-www-form-urlencoded'</span>
axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>timeout <span class="token operator">=</span> <span class="token number">2000</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>其中对于 <code>headers</code> 的默认配置支持 <code>common</code> 和一些请求 <code>method</code> 字段，<code>common</code> 表示对于任何类型的请求都要添加该属性，而 <code>method</code> 表示只有该类型请求方法才会添加对应的属性。</p>
<p>在上述例子中，我们会默认为所有请求的 <code>header</code> 添加 <code>test</code> 属性，会默认为 <code>post</code> 请求的 <code>header</code> 添加 <code>Content-Type</code> 属性。</p>
<h2 id="默认配置"><a class="header-anchor" href="#默认配置">#</a> 默认配置</h2>
<h3 id="默认配置定义"><a class="header-anchor" href="#默认配置定义">#</a> 默认配置定义</h3>
<p>接下来，我们先实现默认配置</p>
<p><code>defaults.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> AxiosRequestConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./types'</span>

<span class="token keyword">const</span> defaults<span class="token operator">:</span> AxiosRequestConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>

  timeout<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>

  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    common<span class="token operator">:</span> <span class="token punctuation">{</span>
      Accept<span class="token operator">:</span> <span class="token string">'application/json, text/plain, */*'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> methodsNoData <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'delete'</span><span class="token punctuation">,</span> <span class="token string">'get'</span><span class="token punctuation">,</span> <span class="token string">'head'</span><span class="token punctuation">,</span> <span class="token string">'options'</span><span class="token punctuation">]</span>

methodsNoData<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>method <span class="token operator">=></span> <span class="token punctuation">{</span>
  defaults<span class="token punctuation">.</span>headers<span class="token punctuation">[</span>method<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> methodsWithData <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'post'</span><span class="token punctuation">,</span> <span class="token string">'put'</span><span class="token punctuation">,</span> <span class="token string">'patch'</span><span class="token punctuation">]</span>

methodsWithData<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>method <span class="token operator">=></span> <span class="token punctuation">{</span>
  defaults<span class="token punctuation">.</span>headers<span class="token punctuation">[</span>method<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string">'Content-Type'</span><span class="token operator">:</span> <span class="token string">'application/x-www-form-urlencoded'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> defaults
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>我们定义了 <code>defaults</code> 常量，它包含默认请求的方法、超时时间，以及 <code>headers</code> 配置。</p>
<p>未来我们会根据新的需求添加更多的默认配置。</p>
<h3 id="添加到-axios-对象中"><a class="header-anchor" href="#添加到-axios-对象中">#</a> 添加到 axios 对象中</h3>
<p>根据需求，我们要给 <code>axios</code> 对象添加一个 <code>defaults</code> 属性，表示默认配置：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">Axios</span> <span class="token punctuation">{</span>
  defaults<span class="token operator">:</span> AxiosRequestConfig
  interceptors<span class="token operator">:</span> Interceptors

  <span class="token keyword">constructor</span><span class="token punctuation">(</span>initConfig<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>defaults <span class="token operator">=</span> initConfig
    <span class="token keyword">this</span><span class="token punctuation">.</span>interceptors <span class="token operator">=</span> <span class="token punctuation">{</span>
      request<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">InterceptorManager<span class="token operator">&lt;</span>AxiosRequestConfig<span class="token operator">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      response<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">InterceptorManager<span class="token operator">&lt;</span>AxiosResponse<span class="token operator">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>  
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>我们给 <code>Axios</code> 类添加一个 <code>defaults</code> 成员属性，并且让 <code>Axios</code> 的构造函数接受一个 <code>initConfig</code> 对象，把 <code>initConfig</code> 赋值给 <code>this.defaults</code>。</p>
<p>接着修改 <code>createInstance</code> 方法，支持传入 <code>config</code> 对象。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> defaults <span class="token keyword">from</span> <span class="token string">'./defaults'</span>

<span class="token keyword">function</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> AxiosStatic <span class="token punctuation">{</span>
  <span class="token keyword">const</span> context <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Axios</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  <span class="token keyword">const</span> instance <span class="token operator">=</span> Axios<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function">request</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span>

  <span class="token comment">// extend(instance, Axios.prototype, context)</span>

  <span class="token function">extend</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> context<span class="token punctuation">)</span>

  <span class="token keyword">return</span> instance <span class="token keyword">as</span> AxiosStatic
<span class="token punctuation">}</span>

<span class="token keyword">const</span> axios <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>defaults<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>这样我们就可以在执行 <code>createInstance</code> 创建 <code>axios</code> 对象的时候，把默认配置传入了。</p>
<h2 id="配置合并及策略"><a class="header-anchor" href="#配置合并及策略">#</a> 配置合并及策略</h2>
<p>定义了默认配置后，我们发送每个请求的时候需要把自定义配置和默认配置做合并，它并不是简单的 2 个普通对象的合并，对于不同的字段合并，会有不同的合并策略。举个例子：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>config1 <span class="token operator">=</span> <span class="token punctuation">{</span>
  method<span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span>

  timeout<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>

  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    common<span class="token operator">:</span> <span class="token punctuation">{</span>
      Accept<span class="token operator">:</span> <span class="token string">'application/json, text/plain, */*'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

config2 <span class="token operator">=</span> <span class="token punctuation">{</span>
  url<span class="token operator">:</span> <span class="token string">'/config/post'</span><span class="token punctuation">,</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    test<span class="token operator">:</span> <span class="token string">'321'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

merged <span class="token operator">=</span> <span class="token punctuation">{</span>
  url<span class="token operator">:</span> <span class="token string">'/config/post'</span><span class="token punctuation">,</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> <span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  timeout<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    common<span class="token operator">:</span> <span class="token punctuation">{</span>
      Accept<span class="token operator">:</span> <span class="token string">'application/json, text/plain, */*'</span>
    <span class="token punctuation">}</span>
    test<span class="token operator">:</span> <span class="token string">'321'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><p>我们在 <code>core/mergeConfig.ts</code> 中实现合并方法。</p>
<h3 id="合并方法"><a class="header-anchor" href="#合并方法">#</a> 合并方法</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span>
  config1<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">,</span>
  config2<span class="token operator">?</span><span class="token operator">:</span> AxiosRequestConfig
<span class="token punctuation">)</span><span class="token operator">:</span> AxiosRequestConfig <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>config2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    config2 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> config <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> config2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">mergeField</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> config1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>config2<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">mergeField</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">mergeField</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> strat <span class="token operator">=</span> strats<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">||</span> defaultStrat
    config<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">strat</span><span class="token punctuation">(</span>config1<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> config2<span class="token operator">!</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> config
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p>合并方法的整体思路就是对 <code>config1</code> 和 <code>config2</code> 中的属性遍历，执行 <code>mergeField</code> 方法做合并，这里 <code>config1</code> 代表默认配置，<code>config2</code> 代表自定义配置。</p>
<p>遍历过程中，我们会通过 <code>config2[key]</code> 这种索引的方式访问，所以需要给 <code>AxiosRequestConfig</code> 的接口定义添加一个字符串索引签名：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosRequestConfig</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>

  <span class="token punctuation">[</span>propName<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">any</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>在 <code>mergeField</code> 方法中，我们会针对不同的属性使用不同的合并策略。</p>
<h3 id="默认合并策略"><a class="header-anchor" href="#默认合并策略">#</a> 默认合并策略</h3>
<p>这是大部分属性的合并策略，如下：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">defaultStrat</span><span class="token punctuation">(</span>val1<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> val2<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">typeof</span> val2 <span class="token operator">!==</span> <span class="token string">'undefined'</span> <span class="token operator">?</span> val2 <span class="token operator">:</span> val1
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>它很简单，如果有 <code>val2</code> 则返回 <code>val2</code>，否则返回 <code>val1</code>，也就是如果自定义配置中定义了某个属性，就采用自定义的，否则就用默认配置。</p>
<h3 id="只接受自定义配置合并策略"><a class="header-anchor" href="#只接受自定义配置合并策略">#</a> 只接受自定义配置合并策略</h3>
<p>对于一些属性如 <code>url</code>、<code>params</code>、<code>data</code>，合并策略如下：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">fromVal2Strat</span><span class="token punctuation">(</span>val1<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> val2<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> val2 <span class="token operator">!==</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> val2
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> stratKeysFromVal2 <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'url'</span><span class="token punctuation">,</span> <span class="token string">'params'</span><span class="token punctuation">,</span> <span class="token string">'data'</span><span class="token punctuation">]</span>

stratKeysFromVal2<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>key <span class="token operator">=></span> <span class="token punctuation">{</span>
  strats<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> fromVal2Strat
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>因为对于 <code>url</code>、<code>params</code>、<code>data</code> 这些属性，默认配置显然是没有意义的，它们是和每个请求强相关的，所以我们只从自定义配置中获取。</p>
<h3 id="复杂对象合并策略"><a class="header-anchor" href="#复杂对象合并策略">#</a> 复杂对象合并策略</h3>
<p>对于一些属性如 <code>headers</code>，合并策略如下：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">deepMergeStrat</span><span class="token punctuation">(</span>val1<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> val2<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>val2<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span>val1<span class="token punctuation">,</span> val2<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> val2 <span class="token operator">!==</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> val2
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>val1<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span>val1<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> val1 <span class="token operator">!==</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> val1
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> stratKeysDeepMerge <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'headers'</span><span class="token punctuation">]</span>

stratKeysDeepMerge<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>key <span class="token operator">=></span> <span class="token punctuation">{</span>
  strats<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> deepMergeStrat
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p><code>helpers/util.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span><span class="token operator">...</span>objs<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> result <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span>

  objs<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>obj <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>key <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> val <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>result<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            result<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span>result<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> val<span class="token punctuation">)</span>
          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            result<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> val<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          result<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> val
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> result
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>对于 <code>headers</code> 这类的复杂对象属性，我们需要使用深拷贝的方式，同时也处理了其它一些情况，因为它们也可能是一个非对象的普通值。未来我们讲到认证授权的时候，<code>auth</code> 属性也是这个合并策略。</p>
<p>最后我们在 <code>request</code> 方法里添加合并配置的逻辑：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>config <span class="token operator">=</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>defaults<span class="token punctuation">,</span> config<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="flatten-headers"><a class="header-anchor" href="#flatten-headers">#</a> flatten headers</h2>
<p>经过合并后的配置中的 <code>headers</code> 是一个复杂对象，多了 <code>common</code>、<code>post</code>、<code>get</code> 等属性，而这些属性中的值才是我们要真正添加到请求 <code>header</code> 中的。</p>
<p>举个例子：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>headers<span class="token operator">:</span> <span class="token punctuation">{</span>
  common<span class="token operator">:</span> <span class="token punctuation">{</span>
    Accept<span class="token operator">:</span> <span class="token string">'application/json, text/plain, */*'</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  post<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string">'Content-Type'</span><span class="token operator">:</span><span class="token string">'application/x-www-form-urlencoded'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>我们需要把它压成一级的，如下：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>headers<span class="token operator">:</span> <span class="token punctuation">{</span>
  Accept<span class="token operator">:</span> <span class="token string">'application/json, text/plain, */*'</span><span class="token punctuation">,</span>
 <span class="token string">'Content-Type'</span><span class="token operator">:</span><span class="token string">'application/x-www-form-urlencoded'</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>这里要注意的是，对于 <code>common</code> 中定义的 <code>header</code> 字段，我们都要提取，而对于 <code>post</code>、<code>get</code> 这类提取，需要和该次请求的方法对应。</p>
<p>接下来我们实现 <code>flattenHeaders</code> 方法。</p>
<p><code>helpers/header.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">flattenHeaders</span><span class="token punctuation">(</span>headers<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> method<span class="token operator">:</span> Method<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>headers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> headers
  <span class="token punctuation">}</span>
  headers <span class="token operator">=</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span>headers<span class="token punctuation">.</span>common <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> headers<span class="token punctuation">[</span>method<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> headers<span class="token punctuation">)</span>

  <span class="token keyword">const</span> methodsToDelete <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">'delete'</span><span class="token punctuation">,</span> <span class="token string">'get'</span><span class="token punctuation">,</span> <span class="token string">'head'</span><span class="token punctuation">,</span> <span class="token string">'options'</span><span class="token punctuation">,</span> <span class="token string">'post'</span><span class="token punctuation">,</span> <span class="token string">'put'</span><span class="token punctuation">,</span> <span class="token string">'patch'</span><span class="token punctuation">,</span> <span class="token string">'common'</span><span class="token punctuation">]</span>

  methodsToDelete<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>method <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">delete</span> headers<span class="token punctuation">[</span>method<span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> headers
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>我们可以通过 <code>deepMerge</code> 的方式把 <code>common</code>、<code>post</code> 的属性拷贝到 <code>headers</code> 这一级，然后再把 <code>common</code>、<code>post</code> 这些属性删掉。</p>
<p>然后我们在真正发送请求前执行这个逻辑。</p>
<p><code>core/dispatchRequest.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">processConfig</span><span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  config<span class="token punctuation">.</span>url <span class="token operator">=</span> <span class="token function">transformURL</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>headers <span class="token operator">=</span> <span class="token function">transformHeaders</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token function">transformRequestData</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  config<span class="token punctuation">.</span>headers <span class="token operator">=</span> <span class="token function">flattenHeaders</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>headers<span class="token punctuation">,</span> config<span class="token punctuation">.</span>method<span class="token operator">!</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>这样确保我们了配置中的 <code>headers</code> 是可以正确添加到请求 <code>header</code> 中的</p>
<h2 id="demo-编写"><a class="header-anchor" href="#demo-编写">#</a> demo 编写</h2>
<p>在 <code>examples</code> 目录下创建 <code>config</code> 目录，在 <code>config</code> 目录下创建 <code>index.html</code>:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>utf-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Config example<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/__build__/config.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>接着创建 <code>app.ts</code> 作为入口文件：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">'../../src/index'</span>
<span class="token keyword">import</span> qs <span class="token keyword">from</span> <span class="token string">'qs'</span>

axios<span class="token punctuation">.</span>defaults<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>common<span class="token punctuation">[</span><span class="token string">'test2'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">123</span>

<span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  url<span class="token operator">:</span> <span class="token string">'/config/post'</span><span class="token punctuation">,</span>
  method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
  data<span class="token operator">:</span> qs<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    a<span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  headers<span class="token operator">:</span> <span class="token punctuation">{</span>
    test<span class="token operator">:</span> <span class="token string">'321'</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>这个例子中我们额外引入了 <code>qs</code> 库，它是一个查询字符串解析和字符串化的库。</p>
<p>比如我们的例子中对于 <code>{a:1}</code> 经过 <code>qs.stringify</code> 变成 <code>a=1</code>。</p>
<p>由于我们的例子给默认值添加了 <code>post</code> 和 <code>common</code> 的 <code>headers</code>，我们在请求前做配置合并，于是我们请求的 <code>header</code> 就添加了 <code>Content-Type</code> 字段，它的值是 <code>application/x-www-form-urlencoded</code>；另外我们也添加了 <code>test2</code> 字段，它的值是 <code>123</code>。</p>
<p>至此，我们合并配置的逻辑就实现完了。我们在前面的章节编写 <code>axios</code> 的基础功能的时候对请求数据和响应数据都做了处理，官方 <code>axios</code> 则把这俩部分逻辑也做到了默认配置中，意味这用户可以去修改这俩部分的逻辑，实现自己对请求和响应数据处理的逻辑。那么下一节我们就来实现这个 feature。</p>
</template>