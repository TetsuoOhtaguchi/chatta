import { Timestamp } from 'firebase/firestore'

/**
 * チャットメッセージの投稿日を表示させる関数
 * @param timestamp
 * @param index
 */

// formatDateとその日付に対する最小のindexのマップ
const formatDateMap: { [key: string]: number } = {}

// 与えられた日付に対して最小のindexを見つける関数
const findMinIndex = (formatDate: string, currentIndex: number) => {
  if (!(formatDate in formatDateMap)) {
    formatDateMap[formatDate] = currentIndex
    return currentIndex
  }

  if (formatDateMap[formatDate] > currentIndex) {
    formatDateMap[formatDate] = currentIndex
    return currentIndex
  }
  return formatDateMap[formatDate]
}

export const handlePostDate = (timestampNumber: Timestamp, index: number) => {
  const date = timestampNumber.toDate()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formatDate = `${year}/${month}/${day}`

  const minIndex = findMinIndex(formatDate, index)

  if (index === minIndex) {
    return formatDate
  } else {
    return ''
  }
}
