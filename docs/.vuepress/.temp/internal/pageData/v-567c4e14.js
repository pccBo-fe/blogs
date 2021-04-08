export const data = {
  "key": "v-567c4e14",
  "path": "/pages/vue/%E6%B1%87%E6%80%BB.html",
  "title": "vue",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "filePathRelative": "pages/vue/汇总.md",
  "git": {
    "updatedTime": 1617849657000,
    "contributors": [
      {
        "name": "王博",
        "email": "wangbo17@xiaomi.com",
        "commits": 1
      }
    ]
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
