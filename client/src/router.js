import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Userinfo from './views/Userinfo.vue'
import Item from './views/item/Item.vue'
import User from './views/user/User.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/api/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/api/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/api/userInfo',
      name: 'Item',
      component: Userinfo
    },
    {
      path: '/api/item',
      name: 'Item',
      component: Item
    },
    {
      path: '/api/user',
      name: 'User',
      component: User
    }
  ]
})
