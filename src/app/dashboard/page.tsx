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

  // If Wali Santri / Santri Login
  if (session.role === 'SANTRI') {
    const santri = await prisma.santri.findFirst({
      where: { OR: [{ id: session.id }, { userId: session.id }] },
      include: { musyrif: true, pelanggaran: true, raport: true, perizinanPulang: true },
    })

    const totalPelanggaran = santri?.pelanggaran?.length || 0
    const totalDeduction = santri?.pelanggaran?.reduce((sum, p) => sum + p.points, 0) || 0
    const currentPoints = Math.max(0, 100 - totalDeduction)
    const latestRaport = santri?.raport?.[0]

    return (
      <div style={{ paddingBottom: '30px' }}>
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 10px 20px rgba(6,78,59,0.15)',
        }}>
          <span style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '1px', background: 'rgba(251,191,36,0.2)',
            padding: '4px 10px', borderRadius: '6px', color: '#fef3c7', textTransform: 'uppercase',
          }}>
            PORTAL WALI SANTRI
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px', color: '#ffffff' }}>
            Assalamu&apos;alaikum, {session.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#d1fae5', margin: 0 }}>
            Pantau perkembangan akhlak, kedisiplinan, dan prestasi Ananda di Pesantren Al-Kaukab secara mudah &amp; transparan.
          </p>
        </div>

        {/* Biodata Santri Card */}
        {santri && (
          <div className="card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '6px solid #064e3b' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#064e3b', marginBottom: '16px' }}>
              👧 Info Biodata Ananda
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '14px' }}>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Nama Santri:</strong> <br /><span style={{ fontSize: '16px', fontWeight: 800 }}>{santri.name}</span></div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>NIS:</strong> <br /><span style={{ fontWeight: 700 }}>{santri.nis}</span></div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Kelas / Kamar:</strong> <br /><span style={{ fontWeight: 700 }}>{santri.class} / {santri.room}</span></div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Musyrif/ah Asrama:</strong> <br /><span style={{ fontWeight: 700, color: '#047857' }}>{santri.musyrif?.name || 'Musyrif Asrama'}</span></div>
            </div>
          </div>
        )}

        {/* Stats Grid for Wali */}
        <div className="stats-grid" style={{ marginBottom: '28px' }}>
          <div className="stat-card">
            <div className="stat-icon green"><TrendingUp size={24} /></div>
            <div className="stat-info">
              <h3 style={{ color: currentPoints >= 90 ? '#10b981' : currentPoints >= 75 ? '#eab308' : '#ef4444' }}>
                {currentPoints} / 100
              </h3>
              <p>Status Poin Kedisiplinan</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red"><AlertTriangle size={24} /></div>
            <div className="stat-info">
              <h3>{totalPelanggaran}</h3>
              <p>Catatan Pelanggaran</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gold"><BarChart3 size={24} /></div>
            <div className="stat-info">
              <h3>{latestRaport?.grade || 'MUMTAZ'}</h3>
              <p>Predikat Raport Terakhir</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue"><Home size={24} /></div>
            <div className="stat-info">
              <h3>{santri?.perizinanPulang?.length || 0}</h3>
              <p>Pengajuan Perizinan</p>
            </div>
          </div>
        </div>

        {/* Menu Navigation Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <a href="/dashboard/raport" className="card" style={{ padding: '20px', textDecoration: 'none', transition: 'transform 0.2s', border: '1.5px solid #a7f3d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#d1fae5', color: '#064e3b', padding: '12px', borderRadius: '12px' }}><BarChart3 size={24} /></div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '16px', color: '#064e3b', fontWeight: 800 }}>Raport Semester</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Cetak &amp; download PDF raport resmi</p>
              </div>
            </div>
          </a>

          <a href="/dashboard/musyrif-akhlak" className="card" style={{ padding: '20px', textDecoration: 'none', transition: 'transform 0.2s', border: '1.5px solid #fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '12px' }}><Users size={24} /></div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '16px', color: '#b45309', fontWeight: 800 }}>Point 8 Indikator Akhlak</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Pantau perkembangan adab &amp; ibadah</p>
              </div>
            </div>
          </a>

          <a href="/dashboard/pelanggaran" className="card" style={{ padding: '20px', textDecoration: 'none', transition: 'transform 0.2s', border: '1.5px solid #fca5a5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px' }}><AlertTriangle size={24} /></div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '16px', color: '#991b1b', fontWeight: 800 }}>Catatan Kedisiplinan</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Lihat riwayat catatan kedisiplinan</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    )
  }

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
          Assalamu&apos;alaikum, {session.name}. Selamat datang di Pesantren Al-Kaukab.
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
