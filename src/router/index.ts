import { createRouter, createWebHistory } from 'vue-router'
import Home from '~/pages/index'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    }
  ]
})

export default router
