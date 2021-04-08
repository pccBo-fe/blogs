module.exports = {
  lang: 'zh-CN',
  title: 'pccBo’s blog',
  description: '用于收录&整理博客',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
    navbar: [
      { text: '首页', link: '/' },
      // { 
      //   text: 'react',
      //   link: '/pages/react/react hook相关.md'
      // },
      // { 
      //   text: 'vue',
      //   link: '/pages/vue/vue3 源码相关.md'
      // },
      {
        text: 'blogs',
        children: ['/pages/react/汇总.md', '/pages/vue/汇总.md'],
      }
    ],
    sidebar: {
      '/pages/react/': [
        {
          isGroup: true,
          // text: 'React 好文整理',
          children: ['/pages/react/react hook相关.md'],
        },
      ],
      '/pages/vue/': [
        {
          isGroup: true,
          // text: 'vue 好文整理',
          children: ['/pages/vue/vue3 源码相关.md'],
        },
      ]
      // '/reference/': [
      //   {
      //     isGroup: true,
      //     text: 'Reference',
      //     children: ['/reference/cli.md', '/reference/config.md'],
      //   },
      // ],
    }
  },
}
