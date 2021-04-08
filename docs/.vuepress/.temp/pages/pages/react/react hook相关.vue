<template><h1 id="react-hook相关"><a class="header-anchor" href="#react-hook相关">#</a> react hook相关</h1>
<ul>
<li><a href="https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/" target="_blank" rel="noopener noreferrer">react作者Dan-useEffect 完整指南<OutboundLink/></a><br>
从&quot;心智模型&quot;的角度讲解hook<br>
1.如何用useEffect模拟componentDidMount生命周期?<br>
2.如何正确地在useEffect里请求数据?[]又是什么?<br>
3.应该把函数当做effect的依赖吗?<br>
4.为什么有时候会出现无限重复请求的问题?<br>
5.为什么有时候在effect里拿到的是旧的state或prop呢?</li>
<li><a href="https://overreacted.io/zh-hans/why-do-hooks-rely-on-call-order/" target="_blank" rel="noopener noreferrer">Dan-为什么hook要顺序调用<OutboundLink/></a><br>
以作者角度去分析hook的设计</li>
<li><a href="https://zhuanlan.zhihu.com/p/92211533" target="_blank" rel="noopener noreferrer">蚂蚁RichLab前端团队-hook上手指南<OutboundLink/></a><br>
1.hooks链表结构<br>
2.useState更新数据和setState不同的是，前者会与old state做merge，我们只需把更改的部分传进去，但是useState则是直接覆盖<br>
3.useEffect callback是在组件被渲染为真实DOM后执行（所以可以用于DOM操作）-- <strong>对比componentDidMount 在commit的layout阶段执行而useEffect callback会在commit阶段完成后异步调用</strong>useLayout同didMount调用时期一致</li>
<li><a href="https://juejin.cn/post/6844904165500518414" target="_blank" rel="noopener noreferrer">网易云音乐团队-hook最佳实践<OutboundLink/></a></li>
</ul>
</template>