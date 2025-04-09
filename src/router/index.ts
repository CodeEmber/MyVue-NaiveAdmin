import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LayoutPage from '../layout/LayoutPage.vue'
import { type AppRouteRecordRaw } from './types'
import { GridOutline, People, ColorPalette, AlertCircleOutline } from '@vicons/ionicons5'
import { getUserInfo } from '../api/auth'
import i18n from '@/i18n'
import type { RouteLocationNormalized } from 'vue-router'

// 定义路由
const routes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/LoginView.vue'),
    meta: {
      title: 'menu.login',
      hidden: true,
    },
  },
  {
    path: '/',
    component: LayoutPage,
    name: 'Layout',
    meta: {
      title: 'menu.home',
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        meta: {
          title: 'menu.dashboard',
          icon: GridOutline,
        },
        redirect: '/dashboard/main',
        children: [
          {
            path: 'dashboard/main',
            name: 'MainConsole',
            component: () => import('../views/dashboard/MainConsole.vue'),
            meta: {
              title: 'menu.mainConsole',
              requiresAuth: true,
            },
          },
          {
            path: 'dashboard/monitor',
            name: 'MonitorConsole',
            component: () => import('../views/dashboard/MonitorConsole.vue'),
            meta: {
              title: 'menu.monitorConsole',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/blogs',
        name: 'Blogs',
        meta: {
          title: 'menu.blogs',
          icon: People,
          requiresAuth: true,
        },
        children: [
          {
            path: 'list',
            name: 'BlogsList',
            component: () => import('../views/blogs/BlogsList.vue'),
            meta: {
              title: 'menu.blogsList',
              requiresAuth: true,
            },
          },
          {
            path: 'add',
            name: 'AddBlog',
            component: () => import('../views/blogs/AddBlog.vue'),
            meta: {
              title: 'menu.addBlog',
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
      title: 'menu.forbidden',
      hidden: true,
    },
  },
  {
    path: '/error/404',
    name: 'NotFoundPage',
    component: () => import('../views/error/404.vue'),
    meta: {
      title: 'menu.notFoundPage',
      hidden: true,
    },
  },
  {
    path: '/error/500',
    name: 'ServerError',
    component: () => import('../views/error/500.vue'),
    meta: {
      title: 'menu.serverError',
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

// 更新页面标题的函数 - 改为使用已导入的i18n实例，避免异步问题
export const updatePageTitle = (route?: RouteLocationNormalized) => {
  const currentRoute = (route || router.currentRoute.value) as RouteLocationNormalized
  // 直接使用导入的i18n实例，而不是动态导入
  const appTitle = i18n.global.t('app.title')

  // 获取当前匹配路由中的所有标题，从父到子
  const titles: string[] = []
  if (currentRoute.matched && currentRoute.matched.length) {
    // 遍历匹配的路由，获取所有标题
    currentRoute.matched.forEach((record) => {
      if (record.meta?.title) {
        const translatedTitle = i18n.global.t(record.meta.title as string)
        if (translatedTitle && !titles.includes(translatedTitle)) {
          titles.push(translatedTitle)
        }
      }
    })
  }

  // 如果有标题，则使用最后一个（最具体的路由标题）
  const pageTitle = titles.length > 0 ? titles[titles.length - 1] : ''

  // 设置文档标题，格式统一为：[页面标题] - [应用名称]
  document.title = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle
}

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 更新页面标题
  updatePageTitle(to)

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
