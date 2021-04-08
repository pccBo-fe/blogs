<template><h1 id="ts-axios-编译与发布"><a class="header-anchor" href="#ts-axios-编译与发布">#</a> ts-axios 编译与发布</h1>
<h2 id="需求分析"><a class="header-anchor" href="#需求分析">#</a> 需求分析</h2>
<p>前面的章节我们完成 <code>ts-axios</code> 库的代码编写和单元测试。这一章我们希望把代码部署发布到公共 <code>npm</code> 上，供别人下载使用。但是并不是所有人都会使用 TypeScript 开发，仍然有大量的 JavaScript 用户，它们是不能直接引用 TypeScript 代码的，因此我们需要先对源码做编译和打包，然后再发布。</p>
<p>由于我们会把包发布到公共的 npm 源，如果你还没有 <code>npm</code> 账号，那么需要先去<a href="https://www.npmjs.com/signup" target="_blank" rel="noopener noreferrer">官网注册<OutboundLink/></a>。注册完成后，可以去终端执行 <code>npm login</code> 登录。这个步骤非常重要，决定你最终能否发布成功。</p>
<h2 id="编译和打包"><a class="header-anchor" href="#编译和打包">#</a> 编译和打包</h2>
<p>我们会利用 <a href="https://github.com/rollup/rollup" target="_blank" rel="noopener noreferrer">rollup<OutboundLink/></a> 来打包我们的 <code>ts-axios</code> 库，它是一个非常著名的编译打包工具，Vue.js 也是利用 rollup 编译打包的。相比 webpack，它非常适合去编译和打包一些 JS 库。</p>
<p>由于使用 <code>typescript-library-starter</code> 初始化我们的项目，我们已经拥有了 rollup 打包的相关配置和相关插件的安装，接下来我们就来对生成的 <code>rollup.config.ts</code> 做小小的修改。</p>
<h3 id="修改-rollup-config-ts"><a class="header-anchor" href="#修改-rollup-config-ts">#</a> 修改 rollup.config.ts</h3>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> resolve <span class="token keyword">from</span> <span class="token string">'rollup-plugin-node-resolve'</span>
<span class="token keyword">import</span> commonjs <span class="token keyword">from</span> <span class="token string">'rollup-plugin-commonjs'</span>
<span class="token keyword">import</span> sourceMaps <span class="token keyword">from</span> <span class="token string">'rollup-plugin-sourcemaps'</span>
<span class="token keyword">import</span> camelCase <span class="token keyword">from</span> <span class="token string">'lodash.camelcase'</span>
<span class="token keyword">import</span> typescript <span class="token keyword">from</span> <span class="token string">'rollup-plugin-typescript2'</span>
<span class="token keyword">import</span> json <span class="token keyword">from</span> <span class="token string">'rollup-plugin-json'</span>

<span class="token keyword">const</span> pkg <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">'./package.json'</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> libraryName <span class="token operator">=</span> <span class="token string">'axios'</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  input<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">src/index.ts</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
  output<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span> file<span class="token operator">:</span> pkg<span class="token punctuation">.</span>main<span class="token punctuation">,</span> name<span class="token operator">:</span> <span class="token function">camelCase</span><span class="token punctuation">(</span>libraryName<span class="token punctuation">)</span><span class="token punctuation">,</span> format<span class="token operator">:</span> <span class="token string">'umd'</span><span class="token punctuation">,</span> sourcemap<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> file<span class="token operator">:</span> pkg<span class="token punctuation">.</span><span class="token keyword">module</span><span class="token punctuation">,</span> format<span class="token operator">:</span> <span class="token string">'es'</span><span class="token punctuation">,</span> sourcemap<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')</span>
  external<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  watch<span class="token operator">:</span> <span class="token punctuation">{</span>
    include<span class="token operator">:</span> <span class="token string">'src/**'</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// Allow json resolution</span>
    <span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// Compile TypeScript files</span>
    <span class="token function">typescript</span><span class="token punctuation">(</span><span class="token punctuation">{</span> useTsconfigDeclarationDir<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)</span>
    <span class="token function">commonjs</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// Allow node_modules resolution, so you can use 'external' to control</span>
    <span class="token comment">// which external modules to include in the bundle</span>
    <span class="token comment">// https://github.com/rollup/rollup-plugin-node-resolve#usage</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>

    <span class="token comment">// Resolve source maps to the original source</span>
    <span class="token function">sourceMaps</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div><p>注意要修改的地方，把 <code>libraryName</code> 修改为 <code>axios</code>，<code>input</code> 修改为 <code>src/index.ts</code>。</p>
<p><code>rollup</code> 的配置很简单，我们简单地过一下。</p>
<ul>
<li>input</li>
</ul>
<p>表示打包入口文件。</p>
<ul>
<li>output</li>
</ul>
<p>表示输出的目标文件，它是一个对象数组，我们可以指定输出的格式，比如 <code>umd</code> 格式、<code>es</code> 模式等。</p>
<ul>
<li>external</li>
</ul>
<p>声明它的外部依赖，可以不被打包进去。</p>
<ul>
<li>watch</li>
</ul>
<p>监听文件的变化，重新编译，只有在编译的时候开启 <code>--watch</code> 才生效。</p>
<ul>
<li>plugins</li>
</ul>
<p>编译过程中使用的插件，其中 <code>rollup-plugin-typescript2</code> 就是用来编译 TypeScript 文件，<code>useTsconfigDeclarationDir</code> 表示使用 <code>tsconfig.json</code> 文件中定义的 <code>declarationDir</code>。其它插件感兴趣的同学可以自己去查阅文档。</p>
<h3 id="修改-package-json"><a class="header-anchor" href="#修改-package-json">#</a> 修改 package.json</h3>
<p>由于我们已经在 <code>rollup.config.ts</code> 中修改了 <code>libraryName</code> 为 <code>axios</code>， 那么在 <code>package.json</code> 文件中你需要做相关的修改：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token punctuation">{</span>
  <span class="token string">"main"</span><span class="token operator">:</span> <span class="token string">"dist/axios.umd.js"</span><span class="token punctuation">,</span>
  <span class="token string">"module"</span><span class="token operator">:</span> <span class="token string">"dist/axios.es5.js"</span><span class="token punctuation">,</span>
  <span class="token string">"typings"</span><span class="token operator">:</span> <span class="token string">"dist/types/index.d.ts"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>然后我们在控制台执行 <code>npm run build</code>，会编译输出 <code>dist</code> 目录，其中 <code>lib</code> 目录是单个 <code>.ts</code> 文件编译后的 <code>.js</code> 文件。<code>types</code> 目录是所有 <code>.ts</code> 文件编译后生产的 <code>.d.ts</code> 声明文件。<code>axios.es5.js</code> 是编译后生成的 es 模式的入口文件，用在 <code>package.json</code> 的 <code>module</code> 字段，<code>axios.umd.js</code> 文件是编译后生成的 <code>umd</code> 模式的入口文件，用在 <code>package.json</code> 的 <code>main</code> 字段。</p>
<h2 id="自动化部署"><a class="header-anchor" href="#自动化部署">#</a> 自动化部署</h2>
<p>由于 <code>semantic-release</code> 插件过于黑盒也略微重量，我还是决定教同学们自己编写自动化部署脚本，这样更灵活，意义也更大，因为大部分场景是用不到那么多 feature 的。</p>
<h3 id="修改-package-json-1"><a class="header-anchor" href="#修改-package-json-1">#</a> 修改 package.json</h3>
<p>发布到 npm 之前你需要为你的包命名，由于 <code>ts-axios</code> 这个名字已经被占用了，我使用了 <code>ts-axios-new</code> 这个名称，当然你学到这里，就需要起一个新名字了。可以使用 <code>npm view [&lt;@scope&gt;/]&lt;pkg&gt;[@&lt;version&gt;]</code> 的方式去搜索一个包名是否已经存在，比如你搜索 <code>npm view ts-axios-new</code> 会发现这个包已经存在，返回这个包相关信息。如果你搜索 <code>npm view xxxx</code> 返回错误 404 的话，那么你就可以使用 <code>xxxx</code> 这个包名了。</p>
<p>如果你想让你发布的包关联你的仓库地址，可以配置 <code>repository</code> 的 <code>url</code> 字段。</p>
<p>另外我们增加 2 个 npm scripts：</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"prepub"</span><span class="token operator">:</span> <span class="token string">"npm run test:prod &amp;&amp; npm run build"</span><span class="token punctuation">,</span>
  <span class="token property">"pub"</span><span class="token operator">:</span> <span class="token string">"sh release.sh"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>当我们运行 <code>npm run pub</code> 的时候，会优先执行 <code>prepub</code> 脚本，在 <code>prepub</code> 中我们运行了 <code>test:prod</code> 和 <code>build</code> 2 个脚本。<code>&amp;&amp;</code> 符号表示前面一个命令执行成功后才会执行后面的任务。</p>
<p><code>npm run test:prod</code> 实际上运行了 <code>npm run lint &amp;&amp; npm run test -- --no-cache</code>。 先运行 <code>lint</code> 去校验我们的源码和测试文件是否遵循 <code>tslint</code> 规范，再运行 <code>test</code> 去跑测试。</p>
<p><code>npm run build</code> 实际上运行了 <code>tsc --module commonjs</code>、<code>rollup -c rollup.config.ts</code> 和 <code>typedoc --out docs --target es6 --theme minimal --mode file src</code>。先运行 <code>tsc</code> 去编译我们的 <code>TypeScript</code> 文件，<code>dist/lib</code> 和 <code>dist/types</code> 下的文件就是该命令产生的，然后运行 <code>rollup</code> 去构建 <code>axios.umd.js</code> 及 <code>axios.es.js</code>，最后运行 <code>typedoc</code> 去构建项目的文档。</p>
<p>运行完 <code>prepub</code> 后就会再运行 <code>pub</code> 命令，实际上执行了 <code>sh release.sh</code> 命令，但是目前我们没有这个脚本，接下来我们就需要来编写部署脚本 <code>release.sh</code>。</p>
<h3 id="编写部署脚本"><a class="header-anchor" href="#编写部署脚本">#</a> 编写部署脚本</h3>
<p><code>release.sh</code>：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token shebang important">#!/usr/bin/env sh</span>
<span class="token builtin class-name">set</span> -e
<span class="token builtin class-name">echo</span> <span class="token string">"Enter release version: "</span>
<span class="token builtin class-name">read</span> VERSION
<span class="token builtin class-name">read</span> -p <span class="token string">"Releasing <span class="token variable">$VERSION</span> - are you sure? (y/n)"</span> -n <span class="token number">1</span> -r
<span class="token builtin class-name">echo</span>  <span class="token comment"># (optional) move to a new line</span>
<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token environment constant">$REPLY</span> <span class="token operator">=</span>~ ^<span class="token punctuation">[</span>Yy<span class="token punctuation">]</span>$ <span class="token punctuation">]</span><span class="token punctuation">]</span>
<span class="token keyword">then</span>
  <span class="token builtin class-name">echo</span> <span class="token string">"Releasing <span class="token variable">$VERSION</span> ..."</span>

  <span class="token comment"># commit</span>
  <span class="token function">git</span> <span class="token function">add</span> -A
  <span class="token function">git</span> commit -m <span class="token string">"[build] <span class="token variable">$VERSION</span>"</span>
  <span class="token function">npm</span> version <span class="token variable">$VERSION</span> --message <span class="token string">"[release] <span class="token variable">$VERSION</span>"</span>
  <span class="token function">git</span> push origin master

  <span class="token comment"># publish</span>
  <span class="token function">npm</span> publish
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>部署脚本是 shell 脚本，shell 脚本就是封装了多行控制台命令，来逐行解释他们的含义。</p>
<p><code>#!/usr/bin/env sh</code> 用来表示它是一个 shell 脚本。</p>
<p><code>set -e</code> 告诉脚本如果执行结果不为 true 则退出。</p>
<p><code>echo &quot;Enter release version: &quot;</code> 在控制台输出 <code>Enter release version:</code>。</p>
<p><code>read VERSION</code> 表示从标准输入读取值，并赋值给 $VERSION 变量。</p>
<p><code>read -p &quot;Releasing $VERSION - are you sure? (y/n)&quot; -n 1 -r</code>，其中 <code>read -p</code> 表示给出提示符，后面接着 <code>Releasing $VERSION - are you sure? (y/n)</code> 提示符；<code>-n 1</code> 表示限定最多可以有 1 个字符可以作为有效读入；<code>-r</code> 表示禁止反斜线的转义功能。因为我们的 read 并没有指定变量名，那么默认这个输入读取值会赋值给 <code>$REPLY</code> 变量。</p>
<p><code>echo</code> 输出空值表示跳到一个新行，<code>#</code> 在 shell 脚本中表示注释。</p>
<p><code>if [[ $REPLY =~ ^[Yy]$ ]]</code> 表示 shell 脚本中的流程控制语句，判断 <code>$REPLY</code> 是不是大小写的 <code>y</code>，如果满足，则走到后面的 <code>then</code> 逻辑。</p>
<p><code>echo &quot;Releasing $VERSION ...&quot;</code>  在控制台输出 <code>Releasing $VERSION ...</code>。</p>
<p><code>git add -A</code> 表示把代码所有变化提交到暂存区。</p>
<p><code>git commit -m &quot;[build] $VERSION&quot;</code> 表示提交代码，提交注释是 <code>[build] $VERSION</code>。</p>
<p><code>npm version $VERSION --message &quot;[release] $VERSION&quot;</code> 是修改 <code>package.json</code> 中的 <code>version</code> 字段到 <code>$VERSION</code>，并且提交一条修改记录，提交注释是 <code>[release] $VERSION</code>。</p>
<p><code>git push origin master</code> 是把代码发布到主干分支。</p>
<p><code>npm publish</code> 是把仓库发布到 <code>npm</code> 上，我们会把 <code>dist</code> 目录下的代码都发布到 <code>npm</code> 上，因为我们在 <code>package.json</code> 中配置的是 <code>files</code> 是 <code>[&quot;dist&quot;]</code>。</p>
<h2 id="运行部署脚本"><a class="header-anchor" href="#运行部署脚本">#</a> 运行部署脚本</h2>
<p>接下来我们就运行 <code>npm run pub</code> 脚本部署，我们会发现在 <code>npm run prepub</code> 阶段，在执行 <code>tslint  --project tsconfig.json -t codeFrame 'src/**/*.ts' 'test/**/*.ts'</code> 的时候失败了，原因是我们有代码不符合 lint 规范。原来是 <code>core/xhr.ts</code> 文件中 <code>processCancel</code> 函数中对 <code>promise</code> 的处理，我们没有对异常情况处理，所以我们要给它加上 <code>catch</code> 的逻辑：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">processCancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>cancelToken<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    cancelToken<span class="token punctuation">.</span>promise
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>reason <span class="token operator">=></span> <span class="token punctuation">{</span>
        request<span class="token punctuation">.</span><span class="token function">abort</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token function">reject</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>
        <span class="token comment">/* istanbul ignore next */</span>
        <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token comment">// do nothing</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>由于我们不会走到 <code>catch</code> 逻辑，所以我们给它添加一个注释 <code>/* istanbul ignore next */</code> 忽略该代码分支的测试。</p>
<p>然后我们再重新运行 <code>npm run pub</code> 逻辑，它会先执行 <code>test</code>，然后运行 <code>build</code> 编译代码，再执行 <code>release.sh</code> 脚本。我们输入了要发布的版本，它就可以完成了整个代码的发布流程。</p>
<p>通过编写部署脚本的一行命令发布的方式，不仅可以用在这种 JS 库，也可以用于我们平时项目开发中，可以大大帮助我们提高生产率，也是前端工程化中必不可少的一个环节，希望同学们都能学会并掌握它。</p>
<p>至此我们完成了项目的部署和发布，我们也可以在 <code>npm</code> 官网上看到我们发布的包，下一节课我们来创建一个实际项目，来引用我们开发的 <code>ts-axios</code> 库。</p>
</template>