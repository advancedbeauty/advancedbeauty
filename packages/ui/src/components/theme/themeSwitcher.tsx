'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Early return with a placeholder of the same size
  if (!mounted) {
    return <div className="h-8 w-14">{/* Placeholder with same dimensions */}</div>
  }

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={resolvedTheme === 'dark'}
          onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="sr-only"
        />
        <div
          className={`box block h-8 w-14 rounded-full transition-colors duration-200 ${
            resolvedTheme === 'dark' ? 'bg-[#222222]' : 'bg-border'
          }`}
        ></div>
        <div
          className={`
                        absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full 
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                        transition-transform duration-200 ease-in-out
                        ${resolvedTheme === 'dark' ? 'translate-x-full' : 'translate-x-0'}
                    `}
        ></div>
      </div>
    </label>
  )
}
