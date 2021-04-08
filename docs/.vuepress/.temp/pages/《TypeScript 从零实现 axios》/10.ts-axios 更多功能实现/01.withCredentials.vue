<template><h1 id="withcredentials"><a class="header-anchor" href="#withcredentials">#</a> withCredentials</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>有些时候我们会发一些跨域请求，比如 <code>http://domain-a.com</code> 站点发送一个 <code>http://api.domain-b.com/get</code> 的请求，默认情况下，浏览器会根据同源策略限制这种跨域请求，但是可以通过 <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noopener noreferrer">CORS<OutboundLink/></a> 技术解决跨域问题。</p>
<p>在同域的情况下，我们发送请求会默认携带当前域下的 cookie，但是在跨域的情况下，默认是不会携带请求域下的 cookie 的，比如 <code>http://domain-a.com</code> 站点发送一个 <code>http://api.domain-b.com/get</code> 的请求，默认是不会携带 <code>api.domain-b.com</code> 域下的 cookie，如果我们想携带（很多情况下是需要的），只需要设置请求的 <code>xhr</code> 对象的 <code>withCredentials</code> 为 true 即可。</p>
<h2 id="代码实现"><a class="header-anchor" href="#代码实现">#</a> 代码实现</h2>
<p>先修改 <code>AxiosRequestConfig</code> 的类型定义。</p>
<p><code>types/index.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">AxiosRequestConfig</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  withCredentials<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>然后修改请求发送前的逻辑。</p>
<p><code>core/xhr.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token comment">/*...*/</span> withCredentials <span class="token punctuation">}</span> <span class="token operator">=</span> config

<span class="token keyword">if</span> <span class="token punctuation">(</span>withCredentials<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  request<span class="token punctuation">.</span>withCredentials <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="demo-编写"><a class="header-anchor" href="#demo-编写">#</a> demo 编写</h2>
<p>在 <code>examples</code> 目录下创建 <code>more</code> 目录，在 <code>cancel</code> 目录下创建 <code>index.html</code>:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>utf-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>More example<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/__build__/more.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>接着创建 <code>app.ts</code> 作为入口文件：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">'../../src/index'</span>

document<span class="token punctuation">.</span>cookie <span class="token operator">=</span> <span class="token string">'a=b'</span>

axios<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/more/get'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

axios<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'http://127.0.0.1:8088/more/server2'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  withCredentials<span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>res <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>这次我们除了给 <code>server.js</code> 去配置了接口路由，还创建了 <code>server2.js</code>，起了一个跨域的服务。</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'express'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> bodyParser <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'body-parser'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> cookieParser <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'cookie-parser'</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">urlencoded</span><span class="token punctuation">(</span><span class="token punctuation">{</span> extended<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token function">cookieParser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> router <span class="token operator">=</span> express<span class="token punctuation">.</span><span class="token function">Router</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> cors <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token string">'Access-Control-Allow-Origin'</span><span class="token operator">:</span> <span class="token string">'http://localhost:8080'</span><span class="token punctuation">,</span>
  <span class="token string">'Access-Control-Allow-Credentials'</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token string">'Access-Control-Allow-Methods'</span><span class="token operator">:</span> <span class="token string">'POST, GET, PUT, DELETE, OPTIONS'</span><span class="token punctuation">,</span>
  <span class="token string">'Access-Control-Allow-Headers'</span><span class="token operator">:</span> <span class="token string">'Content-Type'</span>
<span class="token punctuation">}</span>

router<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/more/server2'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>cors<span class="token punctuation">)</span>
  res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>cookies<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

router<span class="token punctuation">.</span><span class="token function">options</span><span class="token punctuation">(</span><span class="token string">'/more/server2'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>cors<span class="token punctuation">)</span>
  res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>router<span class="token punctuation">)</span>

<span class="token keyword">const</span> port <span class="token operator">=</span> <span class="token number">8088</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> app<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span>port<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><p>这里需要安装一下 <code>cookie-parser</code> 插件，用于请求发送的 cookie。</p>
<p>通过 demo 演示我们可以发现，对于同域请求，会携带 cookie，而对于跨域请求，只有我们配置了 <code>withCredentials</code> 为 true，才会携带 cookie。</p>
<p>至此我们的 <code>withCredentials</code> feature 开发完毕，下一节课我们来实现 axios 对 XSRF
的防御功能。</p>
</template>