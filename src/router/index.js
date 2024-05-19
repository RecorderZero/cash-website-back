/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // {
  //   path: "/test",
  //   name: "Test",
  //   component: () => import('@/components/choseRelatedPage.vue')
  // },
  {
    path: "/",
    redirect: "/login",
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('@/pages/register.vue'),
  // },
  {
    path: '/dashboard',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    
    children: [
      {
        path: '',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/dashboard.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/carouselEdit',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'CarouselEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "carouselEdit" */ '@/pages/carouselEdit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/newsEdit',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'NewsEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "newsEdit" */ '@/pages/newsEdit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/projectEdit',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'ProjectEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "projectEdit" */ '@/pages/projectEdit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/chosenAwardEdit',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'ChosenAwardEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "chosenAwardEdit" */ '@/pages/chosenAwardEdit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/historyAwardEdit',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'HistoryAwardEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "historyAwardEdit" */ '@/pages/historyAwardEdit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/memberEdit',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'MemberEdit',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "memberEdit" */ '@/pages/memberEdit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  // {
  //   path: '/upload',
  //   component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
  //   children: [
  //     {
  //       path: '',
  //       name: 'Upload',
  //       // route level code-splitting
  //       // this generates a separate chunk (about.[hash].js) for this route
  //       // which is lazy-loaded when the route is visited.
  //       component: () => import(/* webpackChunkName: "upload" */ '@/pages/upload.vue'),
  //     },
  //   ],
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
    // children: [
    //   {
    //     path: '',
    //     name: 'Login',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "login" */ '@/pages/login.vue'),
    //   },
    // ],
  },
  // {
  //   path: '/logout',
  //   name: 'Logout',
  //   component: () => import('@/components/logout.vue')
  // }
  // {
  //   path: '/forgotPassword',
  //   name: 'ForgotPassword',
  //   component: () => import(/* webpackChunkName: "forgotPassword" */ '@/pages/forgotPassword.vue'),
  // },
  // {
  //   path: '/otp',
  //   name: 'OTP',
  //   component: () => import(/* webpackChunkName: "otp" */ '@/pages/otp.vue'),
  // },
  // {
  //   path: '/resetPassword',
  //   name: 'ResetPassword',
  //   component: () => import(/* webpackChunkName: "resetPassword" */ '@/pages/resetPassword.vue'),
  // },
  // {
  //   path: '/uploadFiles',
  //   name: 'UploadFiles',
  //   component: () => import(/* webpackChunkName: "uploadFiles" */ '@/components/UploadFiles.vue'),
  // },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = checkIfUserIsAuthenticated()
  
  if (to.name === 'Login' && isAuthenticated) {
    next('/dashboard')
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }

})

function checkIfUserIsAuthenticated() {
  const userName = localStorage.getItem('userName')
  // const userRole = localStorage.getItem('userRole')
  return !!userName
}

export default router
