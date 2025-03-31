import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LayoutPage from '../layout/LayoutPage.vue'
import { type AppRouteRecordRaw } from './types'
import { GridOutline, People, ColorPalette, AlertCircleOutline } from '@vicons/ionicons5'
import { getUserInfo } from '../api/auth'

// 定义路由
const routes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/LoginView.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    component: LayoutPage,
    name: 'Layout',
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          icon: GridOutline,
        },
        redirect: '/dashboard/main',
        children: [
          {
            path: 'dashboard/main',
            name: 'MainConsole',
            component: () => import('../views/dashboard/MainConsole.vue'),
            meta: {
              title: '中控台',
              requiresAuth: true,
            },
          },
          {
            path: 'dashboard/monitor',
            name: 'MonitorConsole',
            component: () => import('../views/dashboard/MonitorConsole.vue'),
            meta: {
              title: '监控台',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/blogs',
        name: 'Blogs',
        meta: {
          title: '博客管理',
          icon: People,
          requiresAuth: true,
        },
        children: [
          {
            path: 'list',
            name: 'BlogsList',
            component: () => import('../views/blogs/BlogsList.vue'),
            meta: {
              title: '博客列表',
              requiresAuth: true,
            },
          },
          {
            path: 'add',
            name: 'AddBlog',
            component: () => import('../views/blogs/AddBlog.vue'),
            meta: {
              title: '添加博客',
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
  // 错误页面路由 - 从Layout移出，作为独立页面
  {
    path: '/error/403',
    name: 'Forbidden',
    component: () => import('../views/error/403.vue'),
    meta: {
      title: '403 - 无权限访问',
      hidden: true,
    },
  },
  {
    path: '/error/404',
    name: 'NotFoundPage',
    component: () => import('../views/error/404.vue'),
    meta: {
      title: '404 - 页面不存在',
      hidden: true,
    },
  },
  {
    path: '/error/500',
    name: 'ServerError',
    component: () => import('../views/error/500.vue'),
    meta: {
      title: '500 - 服务器错误',
      hidden: true,
    },
  },
  // 404路由 - 需要放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/error/404',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as unknown as RouteRecordRaw[],
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 更新页面标题
  document.title = to.meta.title ? `${to.meta.title} - 健身管理系统` : '健身管理系统'

  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const user = await getUserInfo()
    if (user) {
      // 已登录，允许访问
      next()
    } else {
      // 未登录，重定向到登录页
      next({
        name: 'Login',
        query: { redirect: to.fullPath }, // 保存原来要去的路径
      })
    }
  } else {
    // 不需要认证的路由，直接通过
    next()
  }
})

// 添加全局错误处理
export const handleError = (error: { response: { status: number } }) => {
  const status = error?.response?.status
  if (status === 403) {
    router.push('/error/403')
  } else if (status === 404) {
    router.push('/error/404')
  } else if (status >= 500) {
    router.push('/error/500')
  }
}

// 导出路由以便在其他地方使用
export const asyncRoutes = routes

export default router
