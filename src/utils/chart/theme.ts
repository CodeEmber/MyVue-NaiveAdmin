import { VChart, type ITheme } from '@visactor/vchart'
import semiDesignLight from '@visactor/vchart-semi-theme/public/semiDesignLight.json'
import semiDesignDark from '@visactor/vchart-semi-theme/public/semiDesignDark.json'

/**
 * 初始化VChart主题，使用Semi Design主题
 * @param isDark 是否为暗色模式
 */
export function initVChartTheme(isDark: boolean = false): void {
  // 注册两种主题
  VChart.ThemeManager.registerTheme('semiDesignLight', semiDesignLight as Partial<ITheme>)
  VChart.ThemeManager.registerTheme('semiDesignDark', semiDesignDark as Partial<ITheme>)

  // 根据传入的isDark参数设置当前主题
  const currentTheme = isDark ? 'semiDesignDark' : 'semiDesignLight'
  VChart.ThemeManager.setCurrentTheme(currentTheme)
}

/**
 * 更新VChart的主题
 * @param isDark 是否为暗色模式
 */
export function updateVChartTheme(isDark: boolean): void {
  const currentTheme = isDark ? 'semiDesignDark' : 'semiDesignLight'
  VChart.ThemeManager.setCurrentTheme(currentTheme)
}
