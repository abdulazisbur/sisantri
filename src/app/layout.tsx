import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pesantren Al-Kaukab - Sistem Manajemen Pondok Pesantren',
  description:
    'Aplikasi manajemen pondok pesantren untuk mengelola santri, absensi, perizinan, pelanggaran, dan raport.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
