import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '~/pages/index'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    }
  ]
})

export default router
