<template><h1 id="react-hook相关"><a class="header-anchor" href="#react-hook相关">#</a> react hook相关</h1>
<h3 id="react作者dan-useeffect-完整指南"><a class="header-anchor" href="#react作者dan-useeffect-完整指南">#</a> <a href="https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/" target="_blank" rel="noopener noreferrer">react作者Dan-useEffect 完整指南<OutboundLink/></a></h3>
<p>从&quot;心智模型&quot;的角度讲解hook<br>
1.如何用useEffect模拟componentDidMount生命周期?<br>
2.如何正确地在useEffect里请求数据?[]又是什么?<br>
3.应该把函数当做effect的依赖吗?<br>
4.为什么有时候会出现无限重复请求的问题?<br>
5.为什么有时候在effect里拿到的是旧的state或prop呢?</p>
<h3 id="dan-为什么hook要顺序调用"><a class="header-anchor" href="#dan-为什么hook要顺序调用">#</a> <a href="https://overreacted.io/zh-hans/why-do-hooks-rely-on-call-order/" target="_blank" rel="noopener noreferrer">Dan-为什么hook要顺序调用<OutboundLink/></a></h3>
<p>以作者角度去分析hook的设计,例如：<br>
1.为什么多次调用useState<br>
2.为什么不采用key区分state变量来摆脱hook顺序调用<br>
3.支持hook之间传值<br>
...</p>
<h3 id="蚂蚁richlab前端团队-hook上手指南"><a class="header-anchor" href="#蚂蚁richlab前端团队-hook上手指南">#</a> <a href="https://zhuanlan.zhihu.com/p/92211533" target="_blank" rel="noopener noreferrer">蚂蚁RichLab前端团队-hook上手指南<OutboundLink/></a></h3>
<p>1.hooks链表结构<br>
2.useState更新数据和setState不同的是，前者会与old state做merge，我们只需把更改的部分传进去，但是useState则是直接覆盖<br>
3.useEffect callback是在组件被渲染为真实DOM后执行（所以可以用于DOM操作）-- <strong>对比componentDidMount 在commit的layout阶段执行而useEffect callback会在commit阶段完成后异步调用</strong>,useLayout同didMount调用时期一致</p>
<h3 id="《hook实践指南》"><a class="header-anchor" href="#《hook实践指南》">#</a> <strong>《hook实践指南》</strong></h3>
<ul>
<li><a href="https://juejin.cn/post/6844904165500518414" target="_blank" rel="noopener noreferrer">网易云音乐团队-hook最佳实践<OutboundLink/></a></li>
<li><a href="https://juejin.cn/post/6844903985338400782" target="_blank" rel="noopener noreferrer">常用hook使用方法及注意事项<OutboundLink/></a><code>(推荐)</code></li>
<li><a href="https://juejin.cn/post/6888597510399623175" target="_blank" rel="noopener noreferrer">腾讯IMWeb团队-hook最佳实践<OutboundLink/></a></li>
</ul>
<h3 id="《hook源码解读》"><a class="header-anchor" href="#《hook源码解读》">#</a> <strong>《hook源码解读》</strong></h3>
<ul>
<li><a href="https://juejin.cn/post/6872223515580481544" target="_blank" rel="noopener noreferrer">手写hook<OutboundLink/></a>-虽然与react实现方式不同，但可以有助于理解常用hook的工作模式</li>
<li><a href="https://zhuanlan.zhihu.com/p/91935584" target="_blank" rel="noopener noreferrer">饿了么团队-hook源码解读<OutboundLink/></a><code>(推荐)</code><br>
1.函数组件在「第一次执行」时所使用的 Hook (useXXX) 指向的是对应的 mountXXX，而在更新时，Hook 指向的是对应的 updateXXX<br>
2. 函数组件在渲染时将 Hook 按照调用顺序以链表的形式挂在 Fiber Node 上面。得到的链表如下所示，其中 Fiber Node 的属性 memoizedState 用来指向Hook 链表的第一个节点，Hook 的属性 memoizedState 用来存放 state 值或 effect回调函数<br>
3.顺序调用的流程<br>
4.hook如何通过闭包实现状态管理(讲解的很清晰)</li>
<li><a href="https://juejin.cn/post/6944863057000529933" target="_blank" rel="noopener noreferrer">hook运行机制-配合饿了么的文章食用<OutboundLink/></a>
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d99a12ad708647d4bfd075a59d518c8b~tplv-k3u1fbpfcp-watermark.image?imageslim" alt=""></li>
<li><a href="https://zhuanlan.zhihu.com/p/200855720" target="_blank" rel="noopener noreferrer">useState源码解析<OutboundLink/></a></li>
</ul>
<h3 id="hook使用时一些值得关注的点"><a class="header-anchor" href="#hook使用时一些值得关注的点">#</a> <a href="https://juejin.cn/post/6844904176003055630" target="_blank" rel="noopener noreferrer">hook使用时一些值得关注的点<OutboundLink/></a></h3>
<p>文章中的例子还不错<br>
1.函数式组件每一次渲染都会<strong>从上到下将所有内容重新执行一次，如果有变量，就会创造新变量</strong><br>
2.useState初始值惰性更新-useState(func())这样写的话会导致每次都只写func()获取初始值<br>
注意区分useState(func())和useState(func)：useState(func()) ❎ useState(func)✅</p>
<h3 id="hook-vs-生命周期"><a class="header-anchor" href="#hook-vs-生命周期">#</a> <a href="https://juejin.cn/post/6844903901620092941" target="_blank" rel="noopener noreferrer">hook vs 生命周期<OutboundLink/></a></h3>
<p>前半部分hook <em>&quot;模拟&quot;</em> 生命周期可以帮助class component =》functional component更好的过度，<strong>但要注意&quot;心智模型&quot;!</strong><br>
1.componentDidCatch and getDerivedStateFromError：目前还没有这些方法的 Hook 等价写法, 所以一定程度上 class component并不能完全被替代<br>
2.这篇文章并没有准确提到如何模拟componentDidUpdate(可以用useRef&quot;模拟&quot;)</p>
<h3 id="阿里cro团队-hook所带来的变化"><a class="header-anchor" href="#阿里cro团队-hook所带来的变化">#</a> <a href="https://juejin.cn/post/6901956745417981959" target="_blank" rel="noopener noreferrer">阿里CRO团队-hook所带来的变化<OutboundLink/></a></h3>
<p>对比总结了在开发过程中,hooks 所带来的变化以及如何去应对这种变化,有助于理解Dan所说的&quot;心智模型&quot;</p>
<h3 id="《custom-hook》"><a class="header-anchor" href="#《custom-hook》">#</a> 《custom hook》</h3>
<ul>
<li><a href="https://juejin.cn/post/6890738145671938062" target="_blank" rel="noopener noreferrer">custom hook设计规范<OutboundLink/></a></li>
</ul>
<h3 id="react-hook-vs-vue3-composition-api的讨论"><a class="header-anchor" href="#react-hook-vs-vue3-composition-api的讨论">#</a> <a href="https://www.zhihu.com/question/378861485/answer/1125724740" target="_blank" rel="noopener noreferrer">react hook vs vue3 composition api的讨论<OutboundLink/></a></h3>
</template>