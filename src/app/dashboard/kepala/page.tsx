'use client'

import { useState } from 'react'
import {
  ClipboardCheck,
  Fingerprint,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  BarChart2,
  UserCheck,
  Award,
  FileText,
  Filter,
  RefreshCw,
} from 'lucide-react'

export default function DashboardKepalaPage() {
  const [activeTab, setActiveTab] = useState<'ABSENSI' | 'KPI' | 'RAPORT'>('ABSENSI')
  const [selectedSession, setSelectedSession] = useState<'SESI_1' | 'SESI_2'>('SESI_1')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BANIN' | 'BANAT'>('ALL')
  const [fingerprintSyncing, setFingerprintSyncing] = useState(false)
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('')

  // Initial Attendance Data for Musyrif/ah
  const [attendanceData, setAttendanceData] = useState([
    // Waka & TU Special Tracking
    { id: 'w1', name: 'Ustadzah Lutpiana Ulpah', position: 'Waka K2S Banat', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:12', time2: '16:32', source: 'FINGERPRINT' },
    { id: 'w2', name: 'Ustadzah Nidatul Azizah, Al Hafidzah', position: 'Waka Kesantrian Banat', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:15', time2: '16:35', source: 'FINGERPRINT' },
    { id: 'w3', name: 'Ustadzah Alda Nur Alfi Lail, S.Ag', position: 'Waka Kurikulum Banat', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:18', time2: '16:40', source: 'FINGERPRINT' },
    { id: 'w4', name: 'Ustadzah Sarah Julianti', position: 'TU Pesantren', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:25', time2: '16:45', source: 'FINGERPRINT' },

    // Musyrifah Banat
    { id: 'm1', name: 'Ustadzah Rif`atuzzulfa, Al Hafidzah', position: 'Musyrifah An Najm 1', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:05', time2: '16:30', source: 'FINGERPRINT' },
    { id: 'm2', name: 'Ustadzah Zahrotul Fitriyah, Al Hafidzah', position: 'Musyrifah An Najm 2', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:10', time2: '16:31', source: 'FINGERPRINT' },
    { id: 'm3', name: 'Ustadzah Reri Yullian Putri, S.Pd.', position: 'Musyrifah An Najm 3', category: 'BANAT', sesi1: 'IZIN', sesi2: 'IZIN', time1: '-', time2: '-', source: 'MANUAL' },
    { id: 'm4', name: 'Ustadzah Afi Basyiroh, S.Pd., Al Hafidzah', position: 'Musyrifah An Nur 2', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:08', time2: '16:33', source: 'FINGERPRINT' },
    { id: 'm5', name: 'Ustadzah Hamida A\'la Zama', position: 'Musyrifah An Nur 3', category: 'BANAT', sesi1: 'HADIR', sesi2: 'TELAT', time1: '04:20', time2: '17:05', source: 'FINGERPRINT' },
    { id: 'm6', name: 'Ustadzah Eldis Pravita Syukrila', position: 'Musyrifah An Nur 4', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:15', time2: '16:34', source: 'FINGERPRINT' },
    { id: 'm7', name: 'Ustadzah Zahrotul Aini, Al Hafidzah', position: 'Musyrifah An Nur 5', category: 'BANAT', sesi1: 'SAKIT', sesi2: 'SAKIT', time1: '-', time2: '-', source: 'MANUAL' },
    { id: 'm8', name: 'Ustadzah Melani Putri, Al Hafidzah', position: 'Musyrifah An Nur 6', category: 'BANAT', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:02', time2: '16:28', source: 'FINGERPRINT' },

    // Musyrif Banin
    { id: 'mb1', name: 'Ustadz M. Rafli Apriliyan, Al Hafidz', position: 'Musyrif Al Fajr 1', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:10', time2: '16:35', source: 'FINGERPRINT' },
    { id: 'mb2', name: 'Ustadz Maulana Rohman, Al Hafidz', position: 'Musyrif Al Fajr 2', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:12', time2: '16:36', source: 'FINGERPRINT' },
    { id: 'mb3', name: 'Ustadz Sholahudin, S.E.', position: 'Musyrif Al Misbah 1', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:05', time2: '16:30', source: 'FINGERPRINT' },
    { id: 'mb4', name: 'Ustadz Haikal Rifai, Lc.', position: 'Musyrif Al Misbah 2', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:15', time2: '16:40', source: 'FINGERPRINT' },
    { id: 'mb5', name: 'Ustadz Angga Hermawan, S.Ag.', position: 'Musyrif Al Qomar 1 & 2', category: 'BANIN', sesi1: 'TUGAS_LEMBAGA', sesi2: 'TUGAS_LEMBAGA', time1: '-', time2: '-', source: 'MANUAL' },
    { id: 'mb6', name: 'Ustadz Muhammad Yusuf Al Hafizh', position: 'Musyrif Asy Syams 1', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:08', time2: '16:32', source: 'FINGERPRINT' },
    { id: 'mb7', name: 'Ustadz Andika Wildan Gunaeba, S.Pd.', position: 'Musyrif Asy Syams 2', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:14', time2: '16:38', source: 'FINGERPRINT' },
    { id: 'mb8', name: 'Ustadz Muhammad Fadeil', position: 'Musyrif Asy Syams 3', category: 'BANIN', sesi1: 'ALFA', sesi2: 'HADIR', time1: '-', time2: '16:45', source: 'MANUAL' },
    { id: 'mb9', name: 'Ustadz Muh. Iqbal, S.H.', position: 'Musyrif Al A’la 1 & 2', category: 'BANIN', sesi1: 'HADIR', sesi2: 'HADIR', time1: '04:11', time2: '16:35', source: 'FINGERPRINT' },
  ])

  // KPI Sample Data
  const kpiList = [
    { name: 'Ustadzah Siti Wahyuni, S. Ag.', position: 'Kepala Pesantren Banat', score: 96, grade: 'SANGAT BAIK', evaluation: 'Manajemen asrama & kurikulum santriwati berjalan sangat optimal.' },
    { name: 'Ustadz Asrarun Najib, S.Pd.', position: 'Kepala Pesantren Banin', score: 95, grade: 'SANGAT BAIK', evaluation: 'Kedisiplinan musyrif dan capaian target tahfizh santri terpelihara.' },
    { name: 'Ustadzah Lutpiana Ulpah', position: 'Waka K2S Banat', score: 92, grade: 'SANGAT BAIK', evaluation: 'Sanitasi, kesehatan, dan sarpras asrama terawat.' },
    { name: 'Ustadzah Nidatul Azizah, Al Hafidzah', position: 'Waka Kesantrian Banat', score: 94, grade: 'SANGAT BAIK', evaluation: 'Penanganan izin & penegakan tata tertib sangat responsif.' },
    { name: 'Ustadzah Alda Nur Alfi Lail, S.Ag', position: 'Waka Kurikulum Banat', score: 93, grade: 'SANGAT BAIK', evaluation: 'Pelaksanaan ubudiyyah dan bahasa arab/inggris terlaksana sesuai target.' },
    { name: 'Ustadzah Sarah Julianti', position: 'TU Pesantren', score: 90, grade: 'BAIK', evaluation: 'Administrasi & pelaporan santri tepat waktu.' },
  ]

  // Filtered List based on category
  const filteredAttendance = attendanceData.filter((item) => {
    if (selectedCategory === 'ALL') return true
    return item.category === selectedCategory
  })

  // Recapitulation Counters
  const getStatusCount = (statusKey: string) => {
    return filteredAttendance.filter((item) => {
      const s = selectedSession === 'SESI_1' ? item.sesi1 : item.sesi2
      return s === statusKey
    }).length
  }

  const updateAttendanceStatus = (id: string, newStatus: string) => {
    setAttendanceData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (selectedSession === 'SESI_1') return { ...item, sesi1: newStatus }
          return { ...item, sesi2: newStatus }
        }
        return item
      })
    )
  }

  // Simulate Fingerprint Sync
  const handleFingerprintSync = () => {
    setFingerprintSyncing(true)
    setSyncSuccessMsg('')

    setTimeout(() => {
      setFingerprintSyncing(false)
      setSyncSuccessMsg('✅ Sinkronisasi Mesin Fingerprint Mesin 01 & 02 Berhasil! Data kehadiran terbarui otomatis.')
      setTimeout(() => setSyncSuccessMsg(''), 5000)
    }, 1500)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        borderRadius: '16px',
        padding: '28px 24px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: '0 10px 20px rgba(6,78,59,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            background: 'rgba(251,191,36,0.2)',
            padding: '4px 10px',
            borderRadius: '6px',
            color: '#fef3c7',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}>
            <Award size={14} color="#fbbf24" /> DASHBOARD UTAMA KEPALA PESANTREN
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>
            Monitoring Absensi Fingerprint, KPI & Raport
          </h1>
          <p style={{ fontSize: '14px', color: '#d1fae5', margin: 0 }}>
            Pondok Pesantren Tahfizh Al-Kaukab Bojong Nangka — TA 2026/2027
          </p>
        </div>

        <button
          onClick={handleFingerprintSync}
          disabled={fingerprintSyncing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            color: '#064e3b',
            fontSize: '13px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
          }}
        >
          <Fingerprint size={20} className={fingerprintSyncing ? 'animate-spin' : ''} />
          {fingerprintSyncing ? 'Menarik Data Biometric...' : 'Sync Fingerprint Mesin'}
        </button>
      </div>

      {syncSuccessMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          color: '#065f46',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: 700,
        }}>
          {syncSuccessMsg}
        </div>
      )}

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('ABSENSI')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'ABSENSI' ? '#064e3b' : '#f1f5f9',
            color: activeTab === 'ABSENSI' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ClipboardCheck size={18} /> Absensi Musyrif/ah (Fingerprint)
        </button>

        <button
          onClick={() => setActiveTab('KPI')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'KPI' ? '#064e3b' : '#f1f5f9',
            color: activeTab === 'KPI' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <BarChart2 size={18} /> KPI Ustadz & Ustadzah
        </button>

        <button
          onClick={() => setActiveTab('RAPORT')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'RAPORT' ? '#064e3b' : '#f1f5f9',
            color: activeTab === 'RAPORT' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FileText size={18} /> Input & View Raport Santri
        </button>
      </div>

      {/* TAB 1: ABSENSI FINGERPRINT MUSYRIF/AH */}
      {activeTab === 'ABSENSI' && (
        <div>
          {/* Controls Bar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}>
            {/* Session Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#064e3b" /> Pilih Sesi Absensi:
              </span>

              <button
                onClick={() => setSelectedSession('SESI_1')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedSession === 'SESI_1' ? '#064e3b' : '#f1f5f9',
                  color: selectedSession === 'SESI_1' ? '#ffffff' : '#475569',
                }}
              >
                🌅 Sesi 1 (04.00 - 07.30 WIB)
              </button>

              <button
                onClick={() => setSelectedSession('SESI_2')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedSession === 'SESI_2' ? '#064e3b' : '#f1f5f9',
                  color: selectedSession === 'SESI_2' ? '#ffffff' : '#475569',
                }}
              >
                🌇 Sesi 2 (16.30 - 22.00 WIB)
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="#64748b" />
              <button
                onClick={() => setSelectedCategory('ALL')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === 'ALL' ? '#334155' : '#f1f5f9',
                  color: selectedCategory === 'ALL' ? '#ffffff' : '#64748b',
                }}
              >
                Semua
              </button>

              <button
                onClick={() => setSelectedCategory('BANIN')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === 'BANIN' ? '#1e40af' : '#f1f5f9',
                  color: selectedCategory === 'BANIN' ? '#ffffff' : '#64748b',
                }}
              >
                Banin
              </button>

              <button
                onClick={() => setSelectedCategory('BANAT')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === 'BANAT' ? '#9d174d' : '#f1f5f9',
                  color: selectedCategory === 'BANAT' ? '#ffffff' : '#64748b',
                }}
              >
                Banat
              </button>
            </div>
          </div>

          {/* Automatic Recapitulation Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', marginBottom: '4px' }}>HADIR</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#047857' }}>{getStatusCount('HADIR')}</div>
            </div>

            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>TELAT</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#b45309' }}>{getStatusCount('TELAT')}</div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>IZIN / CUTI</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#1d4ed8' }}>{getStatusCount('IZIN') + getStatusCount('CUTI')}</div>
            </div>

            <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#9d174d', marginBottom: '4px' }}>SAKIT</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#be185d' }}>{getStatusCount('SAKIT')}</div>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>ALFA</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#dc2626' }}>{getStatusCount('ALFA')}</div>
            </div>
          </div>

          {/* Table of Attendance Records */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Fingerprint size={18} color="#064e3b" /> Data Presensi Musyrif / Musyrifah ({selectedSession === 'SESI_1' ? 'Sesi 1: 04.00 - 07.30' : 'Sesi 2: 16.30 - 22.00'})
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Total Terdata: {filteredAttendance.length} Orang
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700, borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 16px' }}>Nama Ustadz / Ustadzah</th>
                    <th style={{ padding: '12px 16px' }}>Jabatan / Asrama</th>
                    <th style={{ padding: '12px 16px' }}>Waktu Log Fingerprint</th>
                    <th style={{ padding: '12px 16px' }}>Metode</th>
                    <th style={{ padding: '12px 16px' }}>Status Kehadiran</th>
                    <th style={{ padding: '12px 16px' }}>Aksi Edit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((row) => {
                    const currentStatus = selectedSession === 'SESI_1' ? row.sesi1 : row.sesi2
                    const logTime = selectedSession === 'SESI_1' ? row.time1 : row.time2

                    return (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                          {row.name}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: row.category === 'BANAT' ? '#fdf2f8' : '#eff6ff',
                            color: row.category === 'BANAT' ? '#9d174d' : '#1e40af',
                          }}>
                            {row.position}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                          {logTime !== '-' ? `⏱️ ${logTime} WIB` : '-'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Fingerprint size={14} color="#064e3b" /> {row.source}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background:
                              currentStatus === 'HADIR' ? '#ecfdf5' :
                              currentStatus === 'TELAT' ? '#fffbeb' :
                              currentStatus === 'SAKIT' ? '#fdf2f8' :
                              currentStatus === 'IZIN' ? '#eff6ff' : '#fef2f2',
                            color:
                              currentStatus === 'HADIR' ? '#047857' :
                              currentStatus === 'TELAT' ? '#b45309' :
                              currentStatus === 'SAKIT' ? '#be185d' :
                              currentStatus === 'IZIN' ? '#1d4ed8' : '#dc2626',
                          }}>
                            {currentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={currentStatus}
                            onChange={(e) => updateAttendanceStatus(row.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              fontWeight: 600,
                              outline: 'none',
                            }}
                          >
                            <option value="HADIR">Hadir</option>
                            <option value="SAKIT">Sakit</option>
                            <option value="IZIN">Izin</option>
                            <option value="TELAT">Telat</option>
                            <option value="TUGAS_LEMBAGA">Tugas Lembaga</option>
                            <option value="CUTI">Cuti</option>
                            <option value="ALFA">Alfa</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KPI USTADZ & USTADZAH */}
      {activeTab === 'KPI' && (
        <div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064e3b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={20} /> Evaluasi Key Performance Indicator (KPI) TA 2026/2027
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
              {kpiList.map((kpi, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                        {kpi.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: 600 }}>
                        {kpi.position}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      background: '#ecfdf5',
                      color: '#047857',
                    }}>
                      {kpi.grade}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ margin: '14px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      <span style={{ color: '#475569' }}>Target Realisasi</span>
                      <span style={{ color: '#064e3b' }}>{kpi.score}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${kpi.score}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }} />
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#334155', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: 0, lineHeight: 1.4 }}>
                    💬 <strong>Catatan Evaluasi:</strong> {kpi.evaluation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAPORT SANTRI */}
      {activeTab === 'RAPORT' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064e3b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} /> Preview & Pencetakan Raport Santri (TA 2026/2027)
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Musyrif/ah dapat langsung menginput data perolehan nilai, hafalan, dan poin akhlak santri untuk dicetak secara resmi.
          </p>

          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <Award size={24} color="#d97706" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#92400e', margin: '0 0 2px' }}>
                Status Cetak Raport Semester 1 2026/2027
              </h4>
              <p style={{ fontSize: '12px', color: '#b45309', margin: 0 }}>
                Seluruh nilai adab (8 Indikator Akhlak) dan setoran hafalan sudah terkoneksi otomatis dari Kemusyrifan.
              </p>
            </div>
          </div>

          <a
            href="/dashboard/raport"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              background: '#064e3b',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Buka Halaman Lengkap Raport Santri →
          </a>
        </div>
      )}
    </div>
  )
}
