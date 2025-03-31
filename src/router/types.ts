import type { Component } from 'vue'
import { type RouteRecordRaw } from 'vue-router'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  name: string
  meta: {
    title?: string
    icon?: string | Component
    sort?: number
    hidden?: boolean
    keepAlive?: boolean
    requiresAuth?: boolean
    activeMenu?: string
    breadcrumb?: boolean
  }
  children?: AppRouteRecordRaw[]
}

export interface TabRouteRecord {
  name: string
  path: string
  title: string
  fullPath: string
  query?: Record<string, string>
  params?: Record<string, string>
}
