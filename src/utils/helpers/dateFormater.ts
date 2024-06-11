import { Timestamp } from 'firebase/firestore'

type Format = 'yyyy/mm/dd' | 'yyyy/mm/dd/hh/mm' | 'hh/mm'

/**
 * 日付を整形する関数
 * @param timestamp
 * @param format
 */
export const dateFormater = (
  timestamp: Timestamp | undefined,
  format: Format
) => {
  if (!timestamp) return ''

  // 本日の日付
  const today = new Date()
  const year = today.getFullYear()
  const month = ('0' + (today.getMonth() + 1)).slice(-2)
  const date = ('0' + today.getDate()).slice(-2)

  // 'yyyy/mm/dd'の形式で値を返す（本日の日付とメッセージの日付が一致する場合、時間をリターンする）
  if (format === 'yyyy/mm/dd') {
    // メッセージの日付
    const targetDate = timestamp.toDate()
    const targetYear = targetDate.getFullYear()
    const targetMonth = ('0' + (targetDate.getMonth() + 1)).slice(-2)
    const targetDay = ('0' + targetDate.getDate()).slice(-2)

    if (year + month + date === targetYear + targetMonth + targetDay) {
      // 本日の日付とメッセージの日付が一致する場合、時間をリターンする
      const targetHour = ('0' + targetDate.getHours()).slice(-2)
      const targetMin = ('0' + targetDate.getMinutes()).slice(-2)

      return `${targetHour}:${targetMin}`
    } else {
      // 本日の日付とメッセージの日付が一致しない場合、日付をリターンする
      return `${targetYear}/${targetMonth}/${targetDay}`
    }
  }

  // 'yyyy/mm/dd/ hh:mm'の形式で値を返す（本日の日付とメッセージの日付が一致する場合、時間をリターンする）
  if (format === 'yyyy/mm/dd/hh/mm') {
    // メッセージの日付
    const targetDate = timestamp.toDate()
    const targetYear = targetDate.getFullYear()
    const targetMonth = ('0' + (targetDate.getMonth() + 1)).slice(-2)
    const targetDay = ('0' + targetDate.getDate()).slice(-2)
    const targetHour = ('0' + targetDate.getHours()).slice(-2)
    const targetMin = ('0' + targetDate.getMinutes()).slice(-2)

    if (year + month + date === targetYear + targetMonth + targetDay) {
      // 本日の日付とメッセージの日付が一致する場合、時間をリターンする
      return `${targetHour}:${targetMin}`
    } else {
      // 本日の日付とメッセージの日付が一致しない場合、日付をリターンする
      return `${targetYear}/${targetMonth}/${targetDay} ${targetHour}:${targetMin}`
    }
  }

  // 'hh:mm'の形式で値を返す
  if (format === 'hh/mm') {
    // メッセージの日付
    const targetDate = timestamp.toDate()
    const targetHour = ('0' + targetDate.getHours()).slice(-2)
    const targetMin = ('0' + targetDate.getMinutes()).slice(-2)

    return `${targetHour}:${targetMin}`
  }
}
