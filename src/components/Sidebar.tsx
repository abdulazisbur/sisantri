'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
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
  Award,
  ShieldCheck,
  Fingerprint,
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
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Utama' },
      { href: '/dashboard/struktur', icon: Network, label: 'Struktur Organisasi 2026/2027' },
    ],
  },
  {
    section: 'Modul Eksekutif',
    items: [
      { href: '/dashboard/kepala', icon: Award, label: 'Dashboard Kepala (KPI & Presensi)' },
      { href: '/dashboard/waka', icon: ShieldCheck, label: 'Dashboard Waka (Proker & Approval)' },
      { href: '/dashboard/musyrif-akhlak', icon: Fingerprint, label: 'Pencatatan Point Akhlak' },
    ],
  },
  {
    section: 'Data Master',
    items: [
      { href: '/dashboard/santri', icon: Users, label: 'Data Santri' },
      { href: '/dashboard/musyrif', icon: UserCheck, label: 'Data Musyrif/ah' },
    ],
  },
  {
    section: 'Operasional & Penilaian',
    items: [
      { href: '/dashboard/absensi', icon: ClipboardList, label: 'Absensi Santri & Fingerprint' },
      { href: '/dashboard/perizinan/sakit', icon: HeartPulse, label: 'Perizinan Sakit' },
      { href: '/dashboard/perizinan/pulang', icon: Home, label: 'Perizinan Pulang' },
      { href: '/dashboard/pelanggaran', icon: AlertTriangle, label: 'Pelanggaran & Demerit' },
      { href: '/dashboard/raport', icon: BarChart3, label: 'Raport Santri' },
    ],
  },
]

const musyrifMenu = [
  {
    section: 'Utama',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/musyrif-akhlak', icon: Fingerprint, label: 'Pencatatan Point Akhlak (8 Indikator)' },
    ],
  },
  {
    section: 'Operasional Kemusyrifan',
    items: [
      { href: '/dashboard/santri', icon: Users, label: 'Santri Asrama Saya' },
      { href: '/dashboard/absensi', icon: ClipboardList, label: 'Absensi Kamar' },
      { href: '/dashboard/perizinan/pulang', icon: Home, label: 'Perizinan Pulang' },
      { href: '/dashboard/pelanggaran', icon: AlertTriangle, label: 'Catat Pelanggaran' },
      { href: '/dashboard/raport', icon: BarChart3, label: 'Input Raport' },
    ],
  },
]

const santriMenu = [
  {
    section: 'Portal Wali Santri',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Anak Saya' },
      { href: '/dashboard/raport', icon: BarChart3, label: 'Raport Semester' },
      { href: '/dashboard/musyrif-akhlak', icon: Fingerprint, label: 'Point Akhlak 8 Indikator' },
      { href: '/dashboard/pelanggaran', icon: AlertTriangle, label: 'Catatan Kedisiplinan' },
      { href: '/dashboard/perizinan/pulang', icon: Home, label: 'Pengajuan Perizinan' },
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
      ? 'Administrator / Executive'
      : user.role === 'MUSYRIF'
        ? 'Musyrif / Musyrifah'
        : 'Wali Santri'

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
              <Image src="/logo-alkaukab.jpg" alt="Logo Al-Kaukab" width={40} height={40} style={{ borderRadius: '8px' }} />
            </div>
            <div className="sidebar-brand-text">
              <h2>Al-Kaukab</h2>
              <p>Tahfizh Bojong Nangka</p>
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
                  (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon className="icon" size={18} />
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
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
            <LogOut className="icon" size={18} />
            Keluar Portal
          </button>
        </div>
      </aside>
    </>
  )
}
