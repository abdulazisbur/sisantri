'use client'

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu, Sun, Moon } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const UserContext = createContext<User | null>(null)

export function useUser() {
  return useContext(UserContext)
}

export default function DashboardShell({
  children,
  user,
}: {
  children: ReactNode
  user: User
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <UserContext.Provider value={user}>
      <div className="dashboard-layout">
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="main-content">
          <header className="main-header">
            <div className="main-header-left">
              <button
                className="mobile-menu-btn btn-ghost"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
            <div className="main-header-right">
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </header>
          <main className="main-body">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  )
}
