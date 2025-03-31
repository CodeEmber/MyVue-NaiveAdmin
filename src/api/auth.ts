// 用户认证相关API
interface LoginParams {
  username: string
  password: string
}

interface LoginResult {
  token: string
  user: {
    id: number
    username: string
    nickname: string
    avatar: string
    role: string
  }
}

// 模拟登录API，实际项目中应替换为真实API请求
export function login(data: LoginParams): Promise<LoginResult> {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟的用户数据
      const users = [
        {
          username: 'admin',
          password: '123456',
          id: 1,
          nickname: '管理员',
          avatar: 'https://placeholder.pics/svg/100',
          role: 'admin',
        },
        {
          username: 'user',
          password: '123456',
          id: 2,
          nickname: '普通用户',
          avatar: 'https://placeholder.pics/svg/100',
          role: 'user',
        },
      ]

      // 查找用户
      const user = users.find((u) => u.username === data.username && u.password === data.password)

      if (user) {
        // 模拟生成token
        const token = `token-${Math.random().toString(36).substr(2)}`

        // 返回用户信息，真实项目中通常不会返回密码
        const { password, ...userInfo } = user

        // 成功返回
        resolve({
          token,
          user: userInfo,
        })
      } else {
        // 失败返回
        reject(new Error('用户名或密码错误'))
      }
    }, 1000)
  })
}

// 获取用户信息
export function getUserInfo(): Promise<LoginResult['user'] | null> {
  return new Promise((resolve) => {
    // 从localStorage获取token和用户信息
    const token = localStorage.getItem('token')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')

    if (token && userInfo) {
      resolve(userInfo)
    } else {
      resolve(null)
    }
  })
}

// 退出登录
export function logout(): Promise<void> {
  return new Promise((resolve) => {
    // 清除localStorage中的token和用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    resolve()
  })
}
