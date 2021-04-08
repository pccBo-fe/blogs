import { Vuepress } from '@vuepress/client/lib/components/Vuepress'
import pageRoutes0 from '/Users/1158790130qq.com/P7/blogs-dir/docs/.vuepress/.temp/internal/pageRoutes/v-8daa1a0e.js'
import pageRoutes1 from '/Users/1158790130qq.com/P7/blogs-dir/docs/.vuepress/.temp/internal/pageRoutes/v-8fa91a4e.js'
import pageRoutes2 from '/Users/1158790130qq.com/P7/blogs-dir/docs/.vuepress/.temp/internal/pageRoutes/v-41ac9c0d.js'
import pageRoutes3 from '/Users/1158790130qq.com/P7/blogs-dir/docs/.vuepress/.temp/internal/pageRoutes/v-60c80a98.js'
import pageRoutes4 from '/Users/1158790130qq.com/P7/blogs-dir/docs/.vuepress/.temp/internal/pageRoutes/v-567c4e14.js'
import pageRoutes5 from '/Users/1158790130qq.com/P7/blogs-dir/docs/.vuepress/.temp/internal/pageRoutes/v-3706649a.js'

export const pagesRoutes = [
  ...pageRoutes0,
  ...pageRoutes1,
  ...pageRoutes2,
  ...pageRoutes3,
  ...pageRoutes4,
  ...pageRoutes5,
  {
    name: "404",
    path: "/:catchAll(.*)",
    component: Vuepress,
  },
]
