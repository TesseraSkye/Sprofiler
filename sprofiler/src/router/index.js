import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Live from '../views/Live.vue'
import History from '../views/History.vue'
import Settings from '../views/Settings.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },

  {
    path: '/live',
    name: 'Live',
    component: Live
  },

  {
    path: '/history',
    name: 'History',
    component: History
  },

  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },

  // wildcard so that weird requests aren't unhandeled
  {
    path: '*',
    redirect: '/dash',
    meta: { transitionType: 'fade' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  // stuff to do after each route
  store.dispatch('initStorage')
})

export default router
