import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'discoverMusic',
      component: ()=> import ('@/view/discoverMusic/discoverMusic'),
      redirect: '/recommend',
      children: [
        {
          path: 'recommend',
          name: 'Recommend',
          component: ()=> import ('@/view/discoverMusic/navPage/recommend/recommend')
        },
        {
          path: 'taste',
          name: 'taste',
          component: ()=> import ('@/view/discoverMusic/navPage/taste/taste')
        }
      ]
    },
    {
      path: '/myMusic',
      name: 'myMusic',
      component: ()=> import ('@/view/myMusic/myMusic')
    },
  ]
})
