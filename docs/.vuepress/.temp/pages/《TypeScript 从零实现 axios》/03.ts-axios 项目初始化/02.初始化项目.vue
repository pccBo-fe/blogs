<template><h1 id="初始化项目"><a class="header-anchor" href="#初始化项目">#</a> 初始化项目</h1>
<h2 id="创建代码仓库"><a class="header-anchor" href="#创建代码仓库">#</a> 创建代码仓库</h2>
<p>接下来，我们开始初始化项目，首先我们先去 GitHub 上创建一个 repo，填好 repo 名称，以及写一下 README，对项目先做个简单的描述。</p>
<p>通常我们初始化一个项目，需要配置一大堆东西，比如 <code>package.json</code>、<code>.editorconfig</code>、<code>.gitignore</code> 等；还包括一些构建工具如 <code>rollup</code>、<code>webpack</code> 以及它们的配置。</p>
<p>当我们使用 TypeScript 去写一个项目的时候，还需要配置 TypeScript 的编译配置文件 <code>tsconfig.json</code> 以及
<code>tslint.json</code> 文件。</p>
<p>这些茫茫多的配置往往会让一个想从零开始写项目的同学望而却步，如果有一个脚手架工具帮我们生成好这些初始化文件该多好。好在确实有这样的工具，接下来我们的主角 <code>TypeScript library starter</code> 隆重登场。</p>
<h2 id="typescript-library-starter"><a class="header-anchor" href="#typescript-library-starter">#</a> TypeScript library starter</h2>
<p>它是一个开源的 TypeScript 开发基础库的脚手架工具，可以帮助我们快速初始化一个 TypeScript 项目，我们可以去它的<a href="https://github.com/alexjoverm/typescript-library-starter" target="_blank" rel="noopener noreferrer">官网地址<OutboundLink/></a>学习和使用它。</p>
<h3 id="使用方式"><a class="header-anchor" href="#使用方式">#</a> 使用方式</h3>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/alexjoverm/typescript-library-starter.git ts-axios
<span class="token builtin class-name">cd</span> ts-axios

<span class="token function">npm</span> <span class="token function">install</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>先通过 <code>git clone</code> 把项目代码拉下来到我们的 <code>ts-axios</code> 目录，然后运行 <code>npm install</code> 安装依赖，并且给项目命名，我们仍然使用 <code>ts-axios</code>。</p>
<p>安装好依赖后，我们先来预览一下这个项目的目录结构。</p>
<h3 id="目录文件介绍"><a class="header-anchor" href="#目录文件介绍">#</a> 目录文件介绍</h3>
<p><code>TypeScript library starter</code> 生成的目录结构如下：</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>├── CONTRIBUTING.md
├── LICENSE 
├── README.md
├── code-of-conduct.md
├── node_modules
├── package-lock.json
├── package.json
├── rollup.config.ts // rollup 配置文件
├── src // 源码目录
├── test // 测试目录
├── tools // 发布到 GitHup pages 以及 发布到 npm 的一些配置脚本工具
├── tsconfig.json // TypeScript 编译配置文件
└── tslint.json // TypeScript lint 文件
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h3 id="优秀工具集成"><a class="header-anchor" href="#优秀工具集成">#</a> 优秀工具集成</h3>
<p>使用 <code>TypeScript library starter</code> 创建的项目集成了很多优秀的开源工具：</p>
<ul>
<li>使用 <a href="https://rollupjs.org/" target="_blank" rel="noopener noreferrer">RollupJS<OutboundLink/></a> 帮助我们打包。</li>
<li>使用 <a href="https://github.com/prettier/prettier" target="_blank" rel="noopener noreferrer">Prettier<OutboundLink/></a> 和 <a href="https://palantir.github.io/tslint/" target="_blank" rel="noopener noreferrer">TSLint<OutboundLink/></a> 帮助我们格式化代码以及保证代码风格一致性。</li>
<li>使用 <a href="https://typedoc.org/" target="_blank" rel="noopener noreferrer">TypeDoc<OutboundLink/></a> 帮助我们自动生成文档并部署到 GitHub pages。</li>
<li>使用 <a href="https://jestjs.io/" target="_blank" rel="noopener noreferrer">Jest<OutboundLink/></a>帮助我们做单元测试。</li>
<li>使用 <a href="https://github.com/commitizen/cz-cli" target="_blank" rel="noopener noreferrer">Commitizen<OutboundLink/></a>帮助我们生成规范化的提交注释。</li>
<li>使用 <a href="https://github.com/semantic-release/semantic-release" target="_blank" rel="noopener noreferrer">Semantic release<OutboundLink/></a>帮助我们管理版本和发布。</li>
<li>使用 <a href="https://github.com/typicode/husky" target="_blank" rel="noopener noreferrer">husky<OutboundLink/></a>帮助我们更简单地使用 git hooks。</li>
<li>使用 <a href="https://github.com/conventional-changelog/conventional-changelog" target="_blank" rel="noopener noreferrer">Conventional changelog<OutboundLink/></a>帮助我们通过代码提交信息自动生成 change log。</li>
</ul>
<p>这里我们列举了很多工具，感兴趣的同学们可以点开他们的链接对这些工具做进一步学习。</p>
<h3 id="npm-scripts"><a class="header-anchor" href="#npm-scripts">#</a> Npm Scripts</h3>
<p><code>TypeScript library starter</code> 同样在 <code>package.json</code> 中帮我们配置了一些 <code>npm scripts</code>，接下来我们先列举一下我们开发中常用的 <code>npm scripts</code>，剩余的我们在之后学习中遇到的时候再来介绍。</p>
<ul>
<li><code>npm run lint</code>: 使用 TSLint 工具检查 <code>src</code> 和 <code>test</code> 目录下 TypeScript 代码的可读性、可维护性和功能性错误。</li>
<li><code>npm start</code>: 观察者模式运行 <code>rollup</code> 工具打包代码。</li>
<li><code>npm test</code>: 运行 <code>jest</code> 工具跑单元测试。</li>
<li><code>npm run commit</code>: 运行 <code>commitizen</code> 工具提交格式化的 <code>git commit</code> 注释。</li>
<li><code>npm run build</code>: 运行 <code>rollup</code> 编译打包 TypeScript 代码，并运行 <code>typedoc</code> 工具生成文档。</li>
</ul>
<h2 id="关联远程分支"><a class="header-anchor" href="#关联远程分支">#</a> 关联远程分支</h2>
<p>代码已经初始化好，接下来我们要把当前代码仓库关联我们的远程仓库，首先在命令行中运行命令查看远程分支：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> remote -v
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>这里我们不会得到任何输出，因为我们还没有关联远程分支，我们先去 GitHub 上找到我们仓库的地址，在命令行运行：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> remote <span class="token function">add</span> origin 仓库地址
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>关联后，远程库的名字就是 <code>origin</code>，这是 <code>Git</code> 默认的叫法，也可以改成别的，但是 <code>origin</code> 这个名字一看就知道是远程库。</p>
<p>接着你就可以继续运行 <code>git remote -v</code> 查看关联结果了。</p>
<h3 id="拉取代码"><a class="header-anchor" href="#拉取代码">#</a> 拉取代码</h3>
<p>运行如下命令从远程仓库拉取 master 分支代码并合并：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> pull origin master
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>这个时候会报错：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>error: The following untracked working tree files would be overwritten by merge:
	README.md
Please move or remove them before you merge.
Aborting
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>因为我们在使用 <code>typescript library starter</code> 初始化代码的时候也创建了 <code>README.md</code>，和远程仓库的 <code>README.md</code> 冲突了。我们把 <code>README.md</code> 文件删除，再次运行：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> pull origin master
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>这次代码就拉取成功了，并且在本地也创建了一个 <code>master</code> 分支。</p>
<h3 id="提交代码"><a class="header-anchor" href="#提交代码">#</a> 提交代码</h3>
<p>最后我们来提交代码，首先运行：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>把提交的代码从工作区添加到暂存区，然后运行 <code>npm run commit</code> 这个 <code>npm</code> 脚本来提交代码，运行后它会依次询问你几个问题，比如你这次修改的范围包括哪些、提交的描述、是否有 break change、影响了哪些 issue 等等。</p>
<p>填写完毕，工具会帮我们运行 <code>git commit</code> 并且自动把我们提交的信息合成一条提交注释。接着运行命令把代码推送到远程 git 仓库中：</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">git</span> push origin master
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>接着我们去 GitHub 仓库中就可以看到刚才这条提交记录了。</p>
<p>至此，我们项目已经初始化完毕，接下来我们就开始编写源码实现 axios 了。</p>
</template>