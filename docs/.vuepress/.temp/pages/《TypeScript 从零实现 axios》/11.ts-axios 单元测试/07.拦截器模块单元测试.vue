<template><h1 id="拦截器模块单元测试"><a class="header-anchor" href="#拦截器模块单元测试">#</a> 拦截器模块单元测试</h1>
<p>拦截器是 <code>ts-axios</code> 库一个非常实用的功能，接下来我们来编写它的测试代码。</p>
<h2 id="测试代码编写"><a class="header-anchor" href="#测试代码编写">#</a> 测试代码编写</h2>
<p><code>test/interceptor.spec.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios<span class="token punctuation">,</span> <span class="token punctuation">{</span> AxiosRequestConfig<span class="token punctuation">,</span> AxiosResponse <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../src/index'</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getAjaxRequest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./helper'</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'interceptors'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    jasmine<span class="token punctuation">.</span>Ajax<span class="token punctuation">.</span><span class="token function">install</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">afterEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    jasmine<span class="token punctuation">.</span>Ajax<span class="token punctuation">.</span><span class="token function">uninstall</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add a request interceptor'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      config<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>test <span class="token operator">=</span> <span class="token string">'added by interceptor'</span>
      <span class="token keyword">return</span> config
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>requestHeaders<span class="token punctuation">.</span>test<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'added by interceptor'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add a request interceptor that returns a new config object'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span>
        url<span class="token operator">:</span> <span class="token string">'/bar'</span><span class="token punctuation">,</span>
        method<span class="token operator">:</span> <span class="token string">'post'</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>method<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'POST'</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'/bar'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add a request interceptor that returns a promise'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token punctuation">(</span>config<span class="token operator">:</span> AxiosRequestConfig<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Promise</span></span><span class="token punctuation">(</span>resolve <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          config<span class="token punctuation">.</span>headers<span class="token punctuation">.</span><span class="token keyword">async</span> <span class="token operator">=</span> <span class="token string">'promise'</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>

    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>requestHeaders<span class="token punctuation">.</span><span class="token keyword">async</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'promise'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add multiple request interceptors'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>config <span class="token operator">=></span> <span class="token punctuation">{</span>
      config<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>test1 <span class="token operator">=</span> <span class="token string">'1'</span>
      <span class="token keyword">return</span> config
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>config <span class="token operator">=></span> <span class="token punctuation">{</span>
      config<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>test2 <span class="token operator">=</span> <span class="token string">'2'</span>
      <span class="token keyword">return</span> config
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>request<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>config <span class="token operator">=></span> <span class="token punctuation">{</span>
      config<span class="token punctuation">.</span>headers<span class="token punctuation">.</span>test3 <span class="token operator">=</span> <span class="token string">'3'</span>
      <span class="token keyword">return</span> config
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>requestHeaders<span class="token punctuation">.</span>test1<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'1'</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>requestHeaders<span class="token punctuation">.</span>test2<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'2'</span><span class="token punctuation">)</span>
      <span class="token function">expect</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>requestHeaders<span class="token punctuation">.</span>test3<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'3'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add a response interceptor'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">' - modified by interceptor'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'OK'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'OK - modified by interceptor'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add a response interceptor that returns a new data object'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span>
        data<span class="token operator">:</span> <span class="token string">'stuff'</span><span class="token punctuation">,</span>
        headers<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        status<span class="token operator">:</span> <span class="token number">500</span><span class="token punctuation">,</span>
        statusText<span class="token operator">:</span> <span class="token string">'ERR'</span><span class="token punctuation">,</span>
        request<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        config<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'OK'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'stuff'</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>headers<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeNull</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>status<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>statusText<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'ERR'</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>request<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeNull</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>config<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add a response interceptor that returns a promise'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Promise</span></span><span class="token punctuation">(</span>resolve <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token comment">// do something async</span>
        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          data<span class="token punctuation">.</span>data <span class="token operator">=</span> <span class="token string">'you have been promised!'</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> res
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'OK'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'you have been promised!'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should add multiple response interceptors'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">'1'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">'2'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">'3'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'OK'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'OK123'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should allow removing interceptors'</span><span class="token punctuation">,</span> done <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> response<span class="token operator">:</span> AxiosResponse
    <span class="token keyword">let</span> intercept
    <span class="token keyword">const</span> instance <span class="token operator">=</span> axios<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">'1'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    intercept <span class="token operator">=</span> instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">'2'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      data<span class="token punctuation">.</span>data <span class="token operator">=</span> data<span class="token punctuation">.</span>data <span class="token operator">+</span> <span class="token string">'3'</span>
      <span class="token keyword">return</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">eject</span><span class="token punctuation">(</span>intercept<span class="token punctuation">)</span>
    instance<span class="token punctuation">.</span>interceptors<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">eject</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>

    <span class="token function">instance</span><span class="token punctuation">(</span><span class="token string">'/foo'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>data <span class="token operator">=></span> <span class="token punctuation">{</span>
      response <span class="token operator">=</span> data
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token function">getAjaxRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>request <span class="token operator">=></span> <span class="token punctuation">{</span>
      request<span class="token punctuation">.</span><span class="token function">respondWith</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        status<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
        responseText<span class="token operator">:</span> <span class="token string">'OK'</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">expect</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">'OK13'</span><span class="token punctuation">)</span>
        <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br></div></div><p>运行测试后我们发现在测试用例 <code>should add a request interceptor that returns a new config object</code> 报错了，是代码运行的报错，而不是测试期望结果的报错，顺着报错信息，我们可以找到报错原因。</p>
<p>在 <code>core/xhr.ts</code> 中，执行到 <code>processHeaders</code> 中的 <code>Object.keys(headers).forEach</code> 代码报错，因为我们在拦截器对请求配置做了修改，导致 <code>headers</code> 为空，所以报错。</p>
<p>于是我们在解构赋值 <code>headers</code> 的时候，给它添加默认值即可。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  headers <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span> <span class="token operator">=</span> config
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>再次运行测试，发现全部测试通过。</p>
<p>至此，我们完成了 <code>ts-axios</code> 库对拦截器模块的单元测试，下节课我们来测试 <code>mergeConfig</code> 模块的业务逻辑。</p>
</template>