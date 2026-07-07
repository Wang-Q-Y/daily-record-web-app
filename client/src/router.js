import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Userinfo from './views/Userinfo.vue'
import Item from './views/item/Item.vue'
import User from './views/user/User.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        guestOnly: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guestOnly: true
      }
    },
    {
      path: '/userInfo',
      name: 'Userinfo',
      component: Userinfo,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/item',
      name: 'Item',
      component: Item,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(function (to, from, next) {
  const isLoggedIn = !!localStorage.getItem('token')

  if (to.matched.some(function (record) {
    return record.meta.requiresAuth
  }) && !isLoggedIn) {
    next('/login')
    return
  }

  if (to.matched.some(function (record) {
    return record.meta.guestOnly
  }) && isLoggedIn) {
    next('/')
    return
  }

  next()
})

export default router
