"use client"

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasDark = document.documentElement.classList.contains('dark')
    setIsDark(hasDark)
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !isDark
    setIsDark(next)
    if (next) root.classList.add('dark')
    else root.classList.remove('dark')
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      className="fixed left-4 bottom-4 z-50 rounded-full px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-lg"
    >
      {isDark ? 'وضع فاتح' : 'وضع داكن'}
    </button>
  )
} 