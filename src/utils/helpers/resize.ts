import { useEffect, useState } from 'react'

export const useWindowWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const resizeHandler = () => {
    const width = window.innerWidth
    setWindowWidth(width)
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return windowWidth
}
