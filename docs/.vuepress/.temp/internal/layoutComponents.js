import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import("/Users/1158790130qq.com/P7/blogs-dir/node_modules/@vuepress/theme-default/lib/layouts/404.vue")),
  "Layout": defineAsyncComponent(() => import("/Users/1158790130qq.com/P7/blogs-dir/node_modules/@vuepress/theme-default/lib/layouts/Layout.vue")),
}
