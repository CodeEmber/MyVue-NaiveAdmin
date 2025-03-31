import type { GlobalThemeOverrides } from 'naive-ui'

// 创建动态主题配置函数，用于根据主题色生成覆盖配置
export function createThemeOverrides(primaryColor: string, isDark: boolean): GlobalThemeOverrides {
  // 根据主色计算衍生色
  const primaryColorHover = isDark ? lightenColor(primaryColor, 10) : darkenColor(primaryColor, 10)

  const primaryColorPressed = isDark ? darkenColor(primaryColor, 10) : darkenColor(primaryColor, 20)

  const primaryColorSuppl = isDark ? lightenColor(primaryColor, 10) : lightenColor(primaryColor, 10)

  if (isDark) {
    return {
      common: {
        primaryColor: primaryColor,
        primaryColorHover: primaryColorHover,
        primaryColorPressed: primaryColorPressed,
        primaryColorSuppl: primaryColorSuppl,
      },
      Button: {
        textColor: '#FFF',
      },
      Card: {
        borderRadius: '8px',
      },
    }
  } else {
    return {
      common: {
        primaryColor: primaryColor,
        primaryColorHover: primaryColorHover,
        primaryColorPressed: primaryColorPressed,
        primaryColorSuppl: primaryColorSuppl,
      },
      Button: {
        textColor: '#333',
      },
      Card: {
        borderRadius: '8px',
      },
    }
  }
}

// 默认的明亮主题
export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',
  },
  Button: {
    textColor: '#333',
  },
  Card: {
    borderRadius: '8px',
  },
}

// 默认的暗色主题
export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#63e2b7',
    primaryColorHover: '#7fe7c4',
    primaryColorPressed: '#5acea7',
    primaryColorSuppl: '#7fe7c4',
  },
  Button: {
    textColor: '#FFF',
  },
  Card: {
    borderRadius: '8px',
  },
}

// 辅助函数：使颜色变亮
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  )
}

// 辅助函数：使颜色变暗
function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) - amt
  const G = ((num >> 8) & 0x00ff) - amt
  const B = (num & 0x0000ff) - amt

  return (
    '#' +
    (
      0x1000000 +
      (R > 0 ? (R < 255 ? R : 255) : 0) * 0x10000 +
      (G > 0 ? (G < 255 ? G : 255) : 0) * 0x100 +
      (B > 0 ? (B < 255 ? B : 255) : 0)
    )
      .toString(16)
      .slice(1)
  )
}
