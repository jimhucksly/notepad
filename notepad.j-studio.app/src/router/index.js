import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import _404 from '@/components/_404'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '*',
      component: _404
    }
  ]
})
