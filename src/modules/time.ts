import { match } from 'ts-pattern'

export const parseTimeStr = (timeStr: string) => {
  return match(timeStr)
    .with('midnight', () => [24, 0])
    .with('noon', () => [12, 0])
    .when(v => v.includes(':') && v.split(':').map(v => parseInt(v)).every(v => !isNaN(v)), v => v.split(':').map(v => parseInt(v)))
    .otherwise(() => null)
}

// 次のhour時minute分を取得
export const getNextSuggestedTime = (hour: number, minute: number, now: Date) => {
  if ([hour, minute].some((v) => isNaN(v))) {
    return null
  }
  const result = new Date(now)
  result.setHours(hour)
  result.setMinutes(minute)
  result.setSeconds(0)
  result.setMilliseconds(0)
  if (result < now) {
    result.setDate(result.getDate() + 1)
  }
  return result
}

// hour時間minute分後を取得
export const getPassedTime = (hour: number, minute: number, now: Date) => {
  if ([hour, minute].some((v) => isNaN(v))) {
    return null
  }
  const result = new Date(now)
  result.setHours(now.getHours() + hour)
  result.setMinutes(now.getMinutes() + minute)
  result.setSeconds(0)
  result.setMilliseconds(0)
  return result
}
