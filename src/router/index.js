import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import axios from '../axios_config'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: () => import('../views/Signup.vue'),
    meta: {
      redirect: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      redirect: true
    }
  },
  {
    path: '/control-panel',
    name: 'Control Panel',
    component: () => import('../views/ControlPanel.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-user',
    name: 'Create User',
    component: () => import('../views/CreateUser.vue'),
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    meta: {
      logout: true,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({
          path: '/login',
          params: { nextUrl: to.fullPath }
      })
    } else {
      if(to.matched.some(record => record.meta.is_admin)) {
        axios.post('/auth', { token, is_admin: true })
          .then(() => next())
          .catch(() => next({
            path: '/login',
            params: { nextUrl: to.fullPath }
          }))
      }else {
        axios.post('/auth', { token })
          .then(() => next())
          .catch(() => next({
            path: '/login',
            params: { nextUrl: to.fullPath }
          }))
      }
    }
  } else if (to.matched.some(record => record.meta.redirect)) {
    const token = localStorage.getItem('token')
    if (token) {
      next({
          path: '/',
          params: { nextUrl: to.fullPath }
      })
    }
    else {
      next()
    }
  } else if (to.matched.some(record => record.meta.logout)) {
    localStorage.removeItem('token')
    next({
      path: '/login',
      params: { nextUrl: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
