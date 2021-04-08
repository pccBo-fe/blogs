  export const themeData = {
  "logo": "https://vuejs.org/images/logo.png",
  "navbar": [
    {
      "text": "首页",
      "link": "/"
    },
    {
      "text": "blogs",
      "children": [
        "/pages/react/汇总.md",
        "/pages/vue/汇总.md"
      ]
    }
  ],
  "sidebar": {
    "/pages/react/": [
      {
        "isGroup": true,
        "children": [
          "/pages/react/react hook相关.md"
        ]
      }
    ],
    "/pages/vue/": [
      {
        "isGroup": true,
        "children": [
          "/pages/vue/vue3 源码相关.md"
        ]
      }
    ]
  },
  "locales": {
    "/": {
      "selectLanguageName": "English",
      "danger": "WARNING"
    }
  },
  "repo": null,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "editLink": true,
  "editLinkText": "Edit this page",
  "lastUpdated": true,
  "lastUpdatedText": "Last Updated",
  "contributors": true,
  "contributorsText": "Contributors",
  "notFound": [
    "There's nothing here.",
    "How did we get here?",
    "That's a Four-Oh-Four.",
    "Looks like we've got some broken links."
  ],
  "backToHome": "Take me home",
  "openInNewWindow": "open in new window"
}
  
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
