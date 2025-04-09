/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式化模式，如 YYYY-MM-DD HH:mm:ss
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | number | string, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()

  // 格式化函数，保证两位数显示
  const formatNumber = (n: number): string => {
    return n < 10 ? `0${n}` : `${n}`
  }

  return format
    .replace(/YYYY/g, year.toString())
    .replace(/YY/g, year.toString().slice(-2))
    .replace(/MM/g, formatNumber(month))
    .replace(/M/g, month.toString())
    .replace(/DD/g, formatNumber(day))
    .replace(/D/g, day.toString())
    .replace(/HH/g, formatNumber(hours))
    .replace(/H/g, hours.toString())
    .replace(/mm/g, formatNumber(minutes))
    .replace(/m/g, minutes.toString())
    .replace(/ss/g, formatNumber(seconds))
    .replace(/s/g, seconds.toString())
}

/**
 * 获取相对时间描述，如"3天前"、"5分钟前"等
 * @param date 日期对象或时间戳
 * @returns 相对时间描述
 */
import i18n from '@/i18n' // Import the i18n instance directly from its module

export const getRelativeTime = (date: Date | number | string): string => {
  // 使用导入的i18n实例
  const now = new Date().getTime()
  const targetTime = new Date(date).getTime()
  const diff = now - targetTime

  // 小于1分钟
  if (diff < 60 * 1000) {
    return i18n.global.t('time.justNow')
  }

  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return i18n.global.t('time.minutesAgo', { minutes: Math.floor(diff / (60 * 1000)) })
  }

  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return i18n.global.t('time.hoursAgo', { hours: Math.floor(diff / (60 * 60 * 1000)) })
  }

  // 小于30天
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return i18n.global.t('time.daysAgo', { days: Math.floor(diff / (24 * 60 * 60 * 1000)) })
  }

  // 小于12个月
  if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
    return i18n.global.t('time.monthsAgo', {
      months: Math.floor(diff / (30 * 24 * 60 * 60 * 1000)),
    })
  }

  return i18n.global.t('time.yearsAgo', {
    years: Math.floor(diff / (12 * 30 * 24 * 60 * 60 * 1000)),
  })
}
