/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: "/test",
    name: "Test",
    component: () => import('@/components/newimageUploader.vue')
  },
  {
    path: '/register',
    component: () => import('@/layouts/sandwich/SandwichLayout.vue'),
    children: [
      {
        path: '',
        name: 'Register',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "register" */ '@/pages/register.vue'),
      },
    ],
  },
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
      },
    ],
  },
  {
    path: '/upload',
    component: () => import('@/layouts/sandwich/BackstageLayout.vue'),
    children: [
      {
        path: '',
        name: 'Upload',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "upload" */ '@/pages/upload.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/sandwich/SandwichLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "login" */ '@/pages/login.vue'),
      },
    ],
  },
  {
    path: '/forgotPassword',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "forgotPassword" */ '@/pages/forgotPassword.vue'),
  },
  {
    path: '/otp',
    name: 'OTP',
    component: () => import(/* webpackChunkName: "otp" */ '@/pages/otp.vue'),
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: () => import(/* webpackChunkName: "resetPassword" */ '@/pages/resetPassword.vue'),
  },
  {
    path: '/uploadFiles',
    name: 'UploadFiles',
    component: () => import(/* webpackChunkName: "uploadFiles" */ '@/components/UploadFiles.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
