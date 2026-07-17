import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  Users,
  UserCheck,
  AlertTriangle,
  ClipboardList,
  HeartPulse,
  Home,
  BarChart3,
  TrendingUp,
} from 'lucide-react'

async function getAdminStats() {
  const [
    totalSantri,
    totalMusyrif,
    totalPelanggaran,
    pelanggaranBulanIni,
    perizinanSakitPending,
    perizinanPulangPending,
    santriAktif,
  ] = await Promise.all([
    prisma.santri.count(),
    prisma.musyrif.count(),
    prisma.pelanggaran.count(),
    prisma.pelanggaran.count({
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.perizinanSakit.count({ where: { status: 'PENDING' } }),
    prisma.perizinanPulang.count({ where: { status: 'PENDING' } }),
    prisma.santri.count({ where: { status: 'AKTIF' } }),
  ])

  return {
    totalSantri,
    totalMusyrif,
    totalPelanggaran,
    pelanggaranBulanIni,
    perizinanSakitPending,
    perizinanPulangPending,
    santriAktif,
  }
}

async function getRecentPelanggaran() {
  return prisma.pelanggaran.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { santri: true },
  })
}

async function getRecentPerizinan() {
  const [sakit, pulang] = await Promise.all([
    prisma.perizinanSakit.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { santri: true },
    }),
    prisma.perizinanPulang.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { santri: true },
    }),
  ])
  return { sakit, pulang }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const stats = await getAdminStats()
  const recentPelanggaran = await getRecentPelanggaran()
  const recentPerizinan = await getRecentPerizinan()

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'RINGAN': return 'badge-info'
      case 'SEDANG': return 'badge-warning'
      case 'BERAT': return 'badge-danger'
      case 'SANGAT_BERAT': return 'badge-danger'
      default: return 'badge-neutral'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'badge-warning'
      case 'DISETUJUI': return 'badge-success'
      case 'DITOLAK': return 'badge-danger'
      default: return 'badge-neutral'
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Assalamu&apos;alaikum, {session.name}. Selamat datang di SiSantri.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalSantri}</h3>
            <p>Total Santri</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalMusyrif}</h3>
            <p>Musyrif/ah</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gold">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.pelanggaranBulanIni}</h3>
            <p>Pelanggaran Bulan Ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <ClipboardList size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.perizinanSakitPending + stats.perizinanPulangPending}</h3>
            <p>Perizinan Pending</p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Recent Violations */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} />
              Pelanggaran Terbaru
            </h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentPelanggaran.length === 0 ? (
              <div className="empty-state">
                <TrendingUp size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                <p>Belum ada pelanggaran</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Santri</th>
                      <th>Level</th>
                      <th>Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPelanggaran.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.santri.name}</td>
                        <td>
                          <span className={`badge ${getLevelColor(p.level)}`}>
                            {p.level.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--status-danger)' }}>-{p.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Permissions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={18} />
              Perizinan Terbaru
            </h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentPerizinan.sakit.length === 0 && recentPerizinan.pulang.length === 0 ? (
              <div className="empty-state">
                <Home size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                <p>Belum ada perizinan</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Santri</th>
                      <th>Tipe</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPerizinan.sakit.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.santri.name}</td>
                        <td><span className="badge badge-info">Sakit</span></td>
                        <td><span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span></td>
                      </tr>
                    ))}
                    {recentPerizinan.pulang.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.santri.name}</td>
                        <td><span className="badge badge-neutral">Pulang</span></td>
                        <td><span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bottom */}
      <div className="stats-grid" style={{ marginTop: '20px' }}>
        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.santriAktif}</h3>
            <p>Santri Aktif</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <HeartPulse size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.perizinanSakitPending}</h3>
            <p>Izin Sakit Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Home size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.perizinanPulangPending}</h3>
            <p>Izin Pulang Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalPelanggaran}</h3>
            <p>Total Pelanggaran</p>
          </div>
        </div>
      </div>
    </div>
  )
}
