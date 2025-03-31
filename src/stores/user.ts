import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, getUserInfo, logout as apiLogout } from '../api/auth'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const isLoggedIn = ref<boolean>(!!token.value)
  const loginLoading = ref(false)

  // 登录
  async function login(username: string, password: string) {
    try {
      loginLoading.value = true
      const res = await apiLogin({ username, password })

      // 保存token到localStorage
      localStorage.setItem('token', res.token)
      token.value = res.token

      // 保存用户信息
      userInfo.value = res.user
      localStorage.setItem('userInfo', JSON.stringify(res.user))

      isLoggedIn.value = true
      return res.user
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    } finally {
      loginLoading.value = false
    }
  }

  // 退出登录
  async function logout() {
    await apiLogout()
    token.value = null
    userInfo.value = null
    isLoggedIn.value = false
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const user = await getUserInfo()
      if (user) {
        userInfo.value = user
        isLoggedIn.value = true
      } else {
        userInfo.value = null
        isLoggedIn.value = false
      }
      return user
    } catch (error) {
      console.error('获取用户信息失败:', error)
      userInfo.value = null
      isLoggedIn.value = false
      return null
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    loginLoading,
    login,
    logout,
    fetchUserInfo,
  }
})
