'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Network,
  Layers,
  ClipboardList,
  HeartPulse,
  Home,
  FileText,
  AlertTriangle,
  BarChart3,
  LogOut,
  BookOpen,
} from 'lucide-react'

interface SidebarProps {
  user: {
    name: string
    role: string
    email: string
  }
  isOpen: boolean
  onClose: () => void
}

const adminMenu = [
  {
    section: 'Utama',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    section: 'Organisasi',
    items: [
      { href: '/dashboard/struktur', icon: Network, label: 'Struktur' },
      { href: '/dashboard/divisi', icon: Layers, label: 'Divisi' },
    ],
  },
  {
    section: 'Data',
    items: [
      { href: '/dashboard/santri', icon: Users, label: 'Data Santri' },
      { href: '/dashboard/musyrif', icon: UserCheck, label: 'Data Musyrif/ah' },
    ],
  },
  {
    section: 'Operasional',
    items: [
      { href: '/dashboard/absensi', icon: ClipboardList, label: 'Absensi' },
      {
        href: '/dashboard/perizinan/sakit',
        icon: HeartPulse,
        label: 'Perizinan Sakit',
      },
      {
        href: '/dashboard/perizinan/pulang',
        icon: Home,
        label: 'Perizinan Pulang',
      },
      { href: '/dashboard/skia', icon: FileText, label: 'SKIA' },
    ],
  },
  {
    section: 'Penilaian',
    items: [
      {
        href: '/dashboard/pelanggaran',
        icon: AlertTriangle,
        label: 'Pelanggaran',
      },
      { href: '/dashboard/raport', icon: BarChart3, label: 'Raport' },
    ],
  },
]

const musyrifMenu = [
  {
    section: 'Utama',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    section: 'Operasional',
    items: [
      { href: '/dashboard/santri', icon: Users, label: 'Santri Bimbingan' },
      { href: '/dashboard/absensi', icon: ClipboardList, label: 'Absensi' },
      {
        href: '/dashboard/perizinan/sakit',
        icon: HeartPulse,
        label: 'Perizinan Sakit',
      },
      {
        href: '/dashboard/perizinan/pulang',
        icon: Home,
        label: 'Perizinan Pulang',
      },
    ],
  },
  {
    section: 'Penilaian',
    items: [
      {
        href: '/dashboard/pelanggaran',
        icon: AlertTriangle,
        label: 'Pelanggaran',
      },
      { href: '/dashboard/raport', icon: BarChart3, label: 'Raport' },
    ],
  },
]

const santriMenu = [
  {
    section: 'Utama',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    section: 'Informasi',
    items: [
      { href: '/dashboard/raport', icon: BarChart3, label: 'Raport Saya' },
      {
        href: '/dashboard/pelanggaran',
        icon: AlertTriangle,
        label: 'Riwayat Pelanggaran',
      },
      {
        href: '/dashboard/perizinan/sakit',
        icon: HeartPulse,
        label: 'Perizinan Sakit',
      },
      {
        href: '/dashboard/perizinan/pulang',
        icon: Home,
        label: 'Perizinan Pulang',
      },
    ],
  },
]

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menu =
    user.role === 'ADMIN'
      ? adminMenu
      : user.role === 'MUSYRIF'
        ? musyrifMenu
        : santriMenu

  const roleLabel =
    user.role === 'ADMIN'
      ? 'Administrator'
      : user.role === 'MUSYRIF'
        ? 'Musyrif/ah'
        : 'Santri'

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <BookOpen size={22} />
            </div>
            <div className="sidebar-brand-text">
              <h2>SiSantri</h2>
              <p>Pondok Pesantren</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((section) => (
            <div className="sidebar-section" key={section.section}>
              <div className="sidebar-section-title">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon className="icon" size={20} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{roleLabel}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ marginTop: '8px', width: '100%' }}
          >
            <LogOut className="icon" size={20} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
