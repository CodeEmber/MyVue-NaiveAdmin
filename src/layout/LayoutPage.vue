<template>
  <n-layout position="absolute" has-sider style="height: 100%">
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      :inverted="inverted"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <!-- 添加 Logo 和系统名称 -->
      <div class="logo-container" :class="{ collapsed: collapsed }">
        <img src="@/assets/logo.svg" alt="Logo" class="app-logo" />
        <span class="app-name" v-if="!collapsed">后台管理系统</span>
      </div>

      <n-menu
        :inverted="inverted"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="clickValue"
        @update:value="handleUpdateValue"
        :expanded-keys="expandedKeys"
        @update:expanded-keys="handleExpandedKeys"
        :indent="40"
        :root-indent="20"
      />
    </n-layout-sider>
    <n-layout class="main-layout">
      <app-navbar class="navbar"></app-navbar>
      <n-layout-content class="content-container">
        <div class="inner-content">
          <app-main></app-main>
          <n-layout-footer class="footer-container" bordered>
            <footer-area></footer-area>
          </n-layout-footer>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { h, ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import AppNavbar from './components/AppNavbar.vue'
import AppMain from './components/AppMain.vue'
import FooterArea from './components/FooterArea.vue'
import { asyncRoutes } from '../router'
import type { AppRouteRecordRaw } from '../router/types'
import type { Component } from 'vue'

// 添加图标组件的类型定义
function renderIcon(icon: Component | undefined) {
  return () => (icon ? h(NIcon, null, { default: () => h(icon) }) : null)
}

// 递归生成菜单选项
const generateMenuOptions = (routes: AppRouteRecordRaw[]): MenuOption[] => {
  if (!routes) return []

  return routes
    .filter((route) => {
      // 过滤掉不需要显示在菜单中的路由
      return !route.meta?.hidden && route.name
    })
    .map((route) => {
      // 基础的菜单项配置
      const menuOption: MenuOption = {
        label: route.meta?.title || route.name,
        key: route.name,
        icon: route.meta?.icon ? renderIcon(route.meta.icon as unknown as Component) : undefined,
      }

      // 如果有子路由，递归生成子菜单
      if (route.children && route.children.length > 0) {
        const childrenRoutes = generateMenuOptions(route.children)
        if (childrenRoutes.length > 0) {
          menuOption.children = childrenRoutes
        }
      }

      return menuOption
    })
}

// 从路由配置获取根路由的子路由，用于生成一级菜单
const menuOptions = computed<MenuOption[]>(() => {
  const rootRoute = asyncRoutes.find((route) => route.name === 'Layout')
  return rootRoute?.children ? generateMenuOptions(rootRoute.children) : []
})

const router = useRouter()
const route = useRoute()
const clickValue = ref<string | null>(route.name as string)
const collapsed = ref(false)
const inverted = ref(false)
const expandedKeys = ref<string[]>([])

function handleUpdateValue(key: string) {
  clickValue.value = key
  router.push({ name: key })
}

// 修改菜单展开处理函数，保持所有展开状态
function handleExpandedKeys(keys: string[]) {
  expandedKeys.value = keys
}

// 查找当前路由的父级菜单
const findParentRoute = (
  routes: AppRouteRecordRaw[],
  currentName: string | null | undefined,
  parentNames: string[] = [],
): string[] => {
  if (!currentName) return []

  for (const route of routes) {
    if (route.name === currentName) {
      return parentNames
    }

    if (route.children && route.children.length) {
      const result = findParentRoute(route.children, currentName, [...parentNames, route.name])
      if (result.length) return result
    }
  }
  return []
}

// 初始化菜单展开状态
const initExpandedKeys = () => {
  if (!route.name) return

  // 获取当前路由的父路由名称
  const parentNames = findParentRoute(asyncRoutes, route.name as string | null | undefined)

  // 将父路由名称添加到展开列表中
  if (parentNames.length) {
    parentNames.forEach((name) => {
      if (!expandedKeys.value.includes(name)) {
        expandedKeys.value.push(name)
      }
    })
  }
}

// 组件挂载时初始化菜单展开状态
onMounted(() => {
  initExpandedKeys()
})

// 监听路由变化，更新选中菜单和展开状态
watch(route, (newVal) => {
  clickValue.value = newVal.name as string

  // 获取当前路由的父路由名称
  const parentNames = findParentRoute(
    asyncRoutes,
    typeof newVal.name === 'string' ? newVal.name : null,
  )

  // 将新的父路由名称添加到已展开项，而不是替换
  if (parentNames.length) {
    // 确保不重复添加相同的key
    parentNames.forEach((name) => {
      if (!expandedKeys.value.includes(name)) {
        expandedKeys.value.push(name)
      }
    })
  }
})
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.navbar {
  flex-shrink: 0;
  height: 60px; /* 明确设置导航栏高度 */
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100% - 60px); /* 减去导航栏的高度 */
}

.inner-content {
  display: flex;
  flex-direction: column;
  min-height: 100%; /* 确保至少占满可视区域 */
}

.footer-container {
  flex-shrink: 0;
  padding: 0;
  margin-top: auto; /* 当内容不足时，页脚会被推到底部 */
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 16px;
  height: 64px;
  overflow: hidden;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.logo-container.collapsed {
  justify-content: center;
  padding: 16px 0;
}

.app-logo {
  width: 32px;
  height: 32px;
  transition: all 0.3s;
}

.app-name {
  margin-left: 12px;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-color, #18a058);
  transition:
    opacity 0.3s,
    margin-left 0.3s;
}
</style>
