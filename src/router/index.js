import Vue from 'vue'
import Router from 'vue-router'
import ListarRecetas from '@/components/ListarRecetas'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ListarRecetas',
      component: ListarRecetas
    }
  ]
})
