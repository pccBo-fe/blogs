<template><h1 id="mergeconfig-模块单元测试"><a class="header-anchor" href="#mergeconfig-模块单元测试">#</a> mergeConfig 模块单元测试</h1>
<p>合并配置是 <code>ts-axios</code> 核心流程中非常重要的一个环节，我们需要为它的各种情况去编写测试。</p>
<h2 id="测试代码编写"><a class="header-anchor" href="#测试代码编写">#</a> 测试代码编写</h2>
<p><code>test/mergeConfig.spec.ts</code>：</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">'../src/index'</span>
<span class="token keyword">import</span> mergeConfig <span class="token keyword">from</span> <span class="token string">'../src/core/mergeConfig'</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">'mergeConfig'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> defaults <span class="token operator">=</span> axios<span class="token punctuation">.</span>defaults

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should accept undefined for second argument'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">expect</span><span class="token punctuation">(</span><span class="token function">mergeConfig</span><span class="token punctuation">(</span>defaults<span class="token punctuation">,</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span>defaults<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should accept an object for second argument'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">expect</span><span class="token punctuation">(</span><span class="token function">mergeConfig</span><span class="token punctuation">(</span>defaults<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span>defaults<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should not leave references'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> merged <span class="token operator">=</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span>defaults<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span>defaults<span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>headers<span class="token punctuation">)</span><span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span>defaults<span class="token punctuation">.</span>headers<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should allow setting request options'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
      url<span class="token operator">:</span> <span class="token string">'__sample url__'</span><span class="token punctuation">,</span>
      params<span class="token operator">:</span> <span class="token string">'__sample params__'</span><span class="token punctuation">,</span>
      data<span class="token operator">:</span> <span class="token punctuation">{</span> foo<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> merged <span class="token operator">=</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span>defaults<span class="token punctuation">,</span> config<span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>url<span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>params<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>params<span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>data<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should not inherit request options'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> localDefaults <span class="token operator">=</span> <span class="token punctuation">{</span>
      url<span class="token operator">:</span> <span class="token string">'__sample url__'</span><span class="token punctuation">,</span>
      params<span class="token operator">:</span> <span class="token string">'__sample params__'</span><span class="token punctuation">,</span>
      data<span class="token operator">:</span> <span class="token punctuation">{</span> foo<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> merged <span class="token operator">=</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span>localDefaults<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeUndefined</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>params<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeUndefined</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeUndefined</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should return default headers if pass config2 with undefined'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>
      <span class="token function">mergeConfig</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span>
          headers<span class="token operator">:</span> <span class="token string">'x-mock-header'</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token keyword">undefined</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      headers<span class="token operator">:</span> <span class="token string">'x-mock-header'</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should merge auth, headers with defaults'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>
      <span class="token function">mergeConfig</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span>
          auth<span class="token operator">:</span> <span class="token keyword">undefined</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          auth<span class="token operator">:</span> <span class="token punctuation">{</span>
            username<span class="token operator">:</span> <span class="token string">'foo'</span><span class="token punctuation">,</span>
            password<span class="token operator">:</span> <span class="token string">'test'</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      auth<span class="token operator">:</span> <span class="token punctuation">{</span>
        username<span class="token operator">:</span> <span class="token string">'foo'</span><span class="token punctuation">,</span>
        password<span class="token operator">:</span> <span class="token string">'test'</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>
      <span class="token function">mergeConfig</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span>
          auth<span class="token operator">:</span> <span class="token punctuation">{</span>
            username<span class="token operator">:</span> <span class="token string">'foo'</span><span class="token punctuation">,</span>
            password<span class="token operator">:</span> <span class="token string">'test'</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          auth<span class="token operator">:</span> <span class="token punctuation">{</span>
            username<span class="token operator">:</span> <span class="token string">'baz'</span><span class="token punctuation">,</span>
            password<span class="token operator">:</span> <span class="token string">'foobar'</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      auth<span class="token operator">:</span> <span class="token punctuation">{</span>
        username<span class="token operator">:</span> <span class="token string">'baz'</span><span class="token punctuation">,</span>
        password<span class="token operator">:</span> <span class="token string">'foobar'</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should overwrite auth, headers with a non-object value'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>
      <span class="token function">mergeConfig</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span>
          headers<span class="token operator">:</span> <span class="token punctuation">{</span>
            common<span class="token operator">:</span> <span class="token punctuation">{</span>
              Accept<span class="token operator">:</span> <span class="token string">'application/json, text/plain, */*'</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
          headers<span class="token operator">:</span> <span class="token keyword">null</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toEqual</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      headers<span class="token operator">:</span> <span class="token keyword">null</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token function">test</span><span class="token punctuation">(</span><span class="token string">'should allow setting other options'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> merged <span class="token operator">=</span> <span class="token function">mergeConfig</span><span class="token punctuation">(</span>defaults<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      timeout<span class="token operator">:</span> <span class="token number">123</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>merged<span class="token punctuation">.</span>timeout<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">123</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br></div></div><p>运行测试后我们发现 <code>mergeConfig.ts</code> 文件的分支覆盖率并未达到 100%，提示是 23 行，打开文件后发现最后一个 <code>else</code> 逻辑并未走到，也就是 <code>val1</code> 为 <code>undefined</code> 的情况。但实际上即使 <code>val1</code> 为 <code>undefined</code>，我们也是返回 <code>undefined</code>，也就是返回 <code>val1</code>，所以这块代码的逻辑可以优化。</p>
<div class="language-typescript ext-ts line-numbers-mode"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">deepMergeStrat</span><span class="token punctuation">(</span>val1<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> val2<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>val2<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span>val1<span class="token punctuation">,</span> val2<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> val2 <span class="token operator">!==</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> val2
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isPlainObject</span><span class="token punctuation">(</span>val1<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">deepMerge</span><span class="token punctuation">(</span>val1<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> val1
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>2 个分支可以合并到一个分支，这样我们再次跑测试，分支覆盖率就可以达到 100% 了。</p>
<p>至此我们完成了 <code>ts-axios</code> 库对 <code>mergeConfig</code> 模块的测试，下一节课我们来测试取消模块相关代码。</p>
</template>