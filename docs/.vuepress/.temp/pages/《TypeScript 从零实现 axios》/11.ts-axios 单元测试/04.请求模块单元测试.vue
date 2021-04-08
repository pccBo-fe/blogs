<template><h1 id="请求模块单元测试"><a class="header-anchor" href="#请求模块单元测试">#</a> 请求模块单元测试</h1>
<p>请求模块是 axios 最基础的模块，通过一个 axios 方法发送 Ajax 请求。</p>
<h2 id="jasmine-ajax"><a class="header-anchor" href="#jasmine-ajax">#</a> jasmine-ajax</h2>
<p><a href="https://jasmine.github.io/pages/getting_started.html" target="_blank" rel="noopener noreferrer">Jasmine<OutboundLink/></a> 是一个 BDD(行为驱动开发)的测试框架，它有很多成熟的插件，比如我们要用到的 <a href="https://github.com/jasmine/jasmine-ajax" target="_blank" rel="noopener noreferrer"><code>jasmine-ajax</code><OutboundLink/></a>，它会为我们发出的 Ajax 请求根据规范定义一组假的响应，并跟踪我们发出的Ajax请求，可以让我们方便的为结果做断言。</p>
<p>其实 Jest 也可以去写插件，但并没有现成的 Ajax 相关的 Jest 插件，但是 Jest 测试中我们仍然可以使用 Jasmine 相关的插件，只需要做一些小小的配置即可。</p>
<p>当然，未来我也会考虑去编写一个 Ajax 相关的 Jest 插件，目前我们仍然使用 <code>jasmine-ajax</code> 去配合我们编写测试。</p>
<p><code>jasmine-ajax</code> 依赖 <code>jasmine-core</code>，因此首先我们要安装几个依赖包，<code>jasmine-ajax</code>、<code>jasmine-core</code> 和 <code>@types/jasmine-ajax</code>。</p>
<p>这个时候我们需要去修改 <code>test/boot.ts</code> 文件，因为每次跑具体测试代码之前会先运行该文件，我们可以在这里去初始化 <code>jasmine-ajax</code>。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> JasmineCore <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">'jasmine-core'</span><span class="token punctuation">)</span>
<span class="token comment">// @ts-ignore</span>
global<span class="token punctuation">.</span><span class="token function-variable function">getJasmineRequireObj</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> JasmineCore
<span class="token punctuation">}</span>
<span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">'jasmine-ajax'</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>这里为了让 <code>jasmine-ajax</code> 插件运行成功，我们需要手动添加全局的 <code>getJasmineRequireObj</code> 方法，参考 <a href="https://github.com/jasmine/jasmine-ajax/issues/178" target="_blank" rel="noopener noreferrer">issue<OutboundLink/></a>。</p>
<p>接下来，我们就开始编写请求模块的单元测试。</p>
<h2 id="测试代码编写"><a class="header-anchor" href="#测试代码编写">#</a> 测试代码编写</h2>
<p><code>test/requests.spec.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios<span class="token punctuation">,</span> <span class="token punctuation">{</span> AxiosResponse<span class="token punctuation">,</span> AxiosError <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../src/index'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getAjaxRequest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./helper'</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'requests'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    jasmine<span class="token punctuation">.</span>Ajax<span class="token punctuation">.</span><span class="token function">install</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">afterEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    jasmine<span class="token punctuation">.</span>Ajax<span class="token punctuation">.</span><span class="token function">uninstall</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should treat single string arg as url'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>method<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'GET'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should treat method value as lowercase string'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      url<span class="token operator">:</span> <span class="token string">'/foo'</span><span class="token punctuation">,</span>
      method<span class="token operator">:</span> <span class="token string">'POST'</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>response <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>config<span class="token punctuation">.</span>method<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'post'</span><span class="token punctuation">)</span>
      <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should reject on network errors'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> resolveSpy <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> rejectSpy <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> e
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    jasmine<span class="token punctuation">.</span>Ajax<span class="token punctuation">.</span><span class="token function">uninstall</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolveSpy<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>rejectSpy<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>next<span class="token punctuation">)</span>

    <span class="token keyword">function</span> <span class="token function">next</span><span class="token punctuation">(</span>reason<span class="token operator">:</span> AxiosResponse <span class="token operator">|</span> AxiosError<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>resolveSpy<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>rejectSpy<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>reason <span class="token keyword">instanceof</span> <span class="token class-name">Error</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeTruthy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span><span class="token punctuation">(</span>reason <span class="token keyword">as</span> AxiosError<span class="token punctuation">)</span><span class="token punctuation">.</span>message<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'Network Error'</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>reason<span class="token punctuation">.</span>request<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span>expect<span class="token punctuation">.</span><span class="token function">any</span><span class="token punctuation">(</span>XMLHttpRequest<span class="token punctuation">)</span><span class="token punctuation">)</span>

      jasmine<span class="token punctuation">.</span>Ajax<span class="token punctuation">.</span><span class="token function">install</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

      <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should reject when request timeout'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> err<span class="token operator">:</span> AxiosError

    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      timeout<span class="token operator">:</span> <span class="token number">2000</span><span class="token punctuation">,</span>
      method<span class="token operator">:</span> <span class="token string">'post'</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=></span> <span class="token punctuation">{</span>
      err <span class="token operator">=</span> error
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token comment">// @ts-ignore</span>
      request<span class="token punctuation">.</span>eventBus<span class="token punctuation">.</span><span class="token function">trigger</span><span class="token punctuation">(</span><span class="token string">'timeout'</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>err <span class="token keyword">instanceof</span> <span class="token class-name">Error</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeTruthy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>err<span class="token punctuation">.</span>message<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'Timeout of 2000 ms exceeded'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should reject when validateStatus returns false'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> resolveSpy <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> rejectSpy <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> e
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token function">validateStatus</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> status <span class="token operator">!==</span> <span class="token number">500</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolveSpy<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>rejectSpy<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>next<span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">500</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">function</span> <span class="token function">next</span><span class="token punctuation">(</span>reason<span class="token operator">:</span> AxiosError <span class="token operator">|</span> AxiosResponse<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>resolveSpy<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>rejectSpy<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>reason <span class="token keyword">instanceof</span> <span class="token class-name">Error</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeTruthy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span><span class="token punctuation">(</span>reason <span class="token keyword">as</span> AxiosError<span class="token punctuation">)</span><span class="token punctuation">.</span>message<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'Request failed with status code 500'</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span><span class="token punctuation">(</span>reason <span class="token keyword">as</span> AxiosError<span class="token punctuation">)</span><span class="token punctuation">.</span>response<span class="token operator">!</span><span class="token punctuation">.</span>status<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span>

      <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should resolve when validateStatus returns true'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> resolveSpy <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">(</span>res<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> rejectSpy <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">(</span>e<span class="token operator">:</span> AxiosError<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> e
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token function">validateStatus</span><span class="token punctuation">(</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> status <span class="token operator">===</span> <span class="token number">500</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolveSpy<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>rejectSpy<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>next<span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">500</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">function</span> <span class="token function">next</span><span class="token punctuation">(</span>res<span class="token operator">:</span> AxiosResponse <span class="token operator">|</span> AxiosError<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>resolveSpy<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>rejectSpy<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toHaveBeenCalled</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>res<span class="token punctuation">.</span>config<span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>

      <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should return JSON when resolved'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse

    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/api/account/signup'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      auth<span class="token operator">:</span> <span class="token punctuation">{</span>
        username<span class="token operator">:</span> <span class="token string">''</span><span class="token punctuation">,</span>
        password<span class="token operator">:</span> <span class="token string">''</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
      headers<span class="token operator">:</span> <span class="token punctuation">{</span>
        Accept<span class="token operator">:</span> <span class="token string">'application/json'</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        statusText<span class="token operator">:</span> <span class="token string">'OK'</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'{"a": 1}'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span><span class="token punctuation">{</span> a<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should return JSON when rejecting'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse

    <span class="token function">axios</span><span class="token punctuation">(</span><span class="token string">'/api/account/signup'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      auth<span class="token operator">:</span> <span class="token punctuation">{</span>
        username<span class="token operator">:</span> <span class="token string">''</span><span class="token punctuation">,</span>
        password<span class="token operator">:</span> <span class="token string">''</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      method<span class="token operator">:</span> <span class="token string">'post'</span><span class="token punctuation">,</span>
      headers<span class="token operator">:</span> <span class="token punctuation">{</span>
        Accept<span class="token operator">:</span> <span class="token string">'application/json'</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> error<span class="token punctuation">.</span>response
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">400</span><span class="token punctuation">,</span>
        statusText<span class="token operator">:</span> <span class="token string">'Bad Request'</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'{"error": "BAD USERNAME", "code": 1}'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'object'</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">.</span>error<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'BAD USERNAME'</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">.</span>code<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should supply correct response'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse

    axios<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        statusText<span class="token operator">:</span> <span class="token string">'OK'</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'{"foo": "bar"}'</span><span class="token punctuation">,</span>
        responseHeaders<span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token string">'Content-Type'</span><span class="token operator">:</span> <span class="token string">'application/json'</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">.</span>foo<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'bar'</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>status<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>statusText<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'OK'</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>headers<span class="token punctuation">[</span><span class="token string">'content-type'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'application/json'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should allow overriding Content-Type header case-insensitive'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse

    axios
      <span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span>
        <span class="token string">'/foo'</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span> prop<span class="token operator">:</span> <span class="token string">'value'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          headers<span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string">'content-type'</span><span class="token operator">:</span> <span class="token string">'application/json'</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
        response <span class="token operator">=</span> res
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>requestHeaders<span class="token punctuation">[</span><span class="token string">'Content-Type'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'application/json'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br></div></div><p>我们要注意的一些点，在这里列出：</p>
<ul>
<li>beforeEach &amp; afterEach</li>
</ul>
<p><a href="https://jestjs.io/docs/en/api#beforeeachfn-timeout" target="_blank" rel="noopener noreferrer">beforeEach<OutboundLink/></a>表示每个测试用例运行前的钩子函数，在这里我们执行 <code>jasmine.Ajax.install()</code> 安装 <code>jasmine.Ajax</code>。</p>
<p><a href="https://jestjs.io/docs/en/api#aftereachfn-timeout" target="_blank" rel="noopener noreferrer">afterEach<OutboundLink/></a>表示每个测试用例运行后的钩子函数，在这里我们执行 <code>jasmine.Ajax.uninstall()</code> 卸载 <code>jasmine.Ajax</code>。</p>
<ul>
<li><code>getAjaxRequest</code></li>
</ul>
<p><code>getAjaxRequest</code> 是我们在 <code>test/helper.ts</code> 定义的一个辅助方法，通过 <code>jasmine.Ajax.requests.mostRecent()</code> 拿到最近一次请求的 <code>request</code> 对象，这个 <code>request</code> 对象是 <code>jasmine-ajax</code> 库伪造的 <code>xhr</code> 对象，它模拟了 <code>xhr</code> 对象上的方法，并且提供一些 <code>api</code> 让我们使用，比如 <code>request.respondWith</code> 方法返回一个响应。</p>
<ul>
<li>异步测试</li>
</ul>
<p>注意到我们这里大部分的测试用例不再是同步的代码了，几乎都是一些异步逻辑，Jest 非常好地支持<a href="https://jestjs.io/docs/en/asynchronous" target="_blank" rel="noopener noreferrer">异步测试代码<OutboundLink/></a>。通常有 2 种解决方案。</p>
<p>第一种是利用 <code>done</code> 参数，每个测试用例函数有一个 <code>done</code> 参数，一旦我们使用了该参数，只有当 <code>done</code> 函数执行的时候表示这个测试用例结束。</p>
<p>第二种是我们的测试函数返回一个 Promise 对象，一旦这个 Promise 对象 <code>resolve</code> 了，表示这个测试结束。</p>
<ul>
<li>expect.any(constructor)</li>
</ul>
<p>它表示匹配任意由 <code>constructor</code> 创建的对象实例。</p>
<ul>
<li><code>request.eventBus.trigger</code></li>
</ul>
<p>由于 <code>request.responseTimeout</code> 方法内部依赖了 <code>jasmine.clock</code> 方法会导致运行失败，这里我直接用了 <code>request.eventBus.trigger('timeout')</code> 方法触发了 <code>timeout</code> 事件。因为这个方法不在接口定义中，所以需要加 <code>// @ts-ignore</code>。</p>
<p>另外，我们在测试中发现 2 个 case 没有通过。</p>
<p>第一个是 <code>should treat method value as lowercase string</code>，这个测试用例是我们发送请求的 <code> method</code> 需要转换成小写字符串，这么做的目的也是为了之后 <code>flattenHeaders</code> 能正常处理这些 <code>method</code>，所以我们需要修改源码逻辑。</p>
<p><code>core/Axios.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code>  <span class="token function">request</span><span class="token punctuation">(</span>url<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> config<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> AxiosPromise <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> url <span class="token operator">===</span> <span class="token string">'string'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>config<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        config <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      config<span class="token punctuation">.</span>url <span class="token operator">=</span> url
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      config <span class="token operator">=</span> url
    <span class="token punctuation">}</span>

    config <span class="token operator">=</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>defaults<span class="token punctuation">,</span> config<span class="token punctuation">)</span>
    config<span class="token punctuation">.</span>method <span class="token operator">=</span> config<span class="token punctuation">.</span>method<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>在合并配置后，我们需要把 <code>config.method</code> 转成小写字符串。</p>
<p>另一个是 <code>should return JSON when rejecting</code>，这个测试用例是当我们发送请求失败后，也能把响应数据转换成 JSON 格式，所以也需要修改源码逻辑。</p>
<p><code>core/dispatchRequest.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">dispatchRequest</span><span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span><span class="token operator">:</span> AxiosPromise <span class="token punctuation">{</span>
  <span class="token function">throwIfCancellationRequested</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  <span class="token function">processConfig</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
  <span class="token keyword">return</span> <span class="token function">xhr</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>
    res <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">transformResponseData</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    e <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>e <span class="token operator">&amp;&amp;</span> e<span class="token punctuation">.</span>response<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        e<span class="token punctuation">.</span>response <span class="token operator">=</span> <span class="token function">transformResponseData</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>response<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> <span class="token builtin">Promise</span><span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>除了对正常情况的响应数据做转换，我们也需要对异常情况的响应数据做转换。</p>
<p>至此我们完成了 <code>ts-axios</code> 库对请求模块的测试，下一节课我们会从业务的角度来测试 <code>headers</code> 模块。</p>
</template>