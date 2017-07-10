import Vue from 'vue'
import Router from 'vue-router'
import Vue3D from '@/components/Vue3D'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Vue3D',
      component: Vue3D
    }
  ]
})
