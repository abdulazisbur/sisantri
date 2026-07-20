'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Building,
} from 'lucide-react'

export default function DashboardWakaPage() {
  const [activeSubTab, setActiveSubTab] = useState<'PROKER' | 'PERIZINAN' | 'PELANGGARAN'>('PROKER')
  const [actionAlertMsg, setActionAlertMsg] = useState('')

  // 1. Program Kerja Waka Data (Canva Link Integration)
  const [prokerList, setProkerList] = useState([
    {
      id: 'p1',
      wakaTitle: 'WAKA KESANTRIAN (USTZ. NIDATUL AZIZAH)',
      title: 'Penyusunan Standard Operasional Ketertiban & OSAKA TA 2026/2027',
      month: 'Juli 2026',
      targetPercent: 100,
      actualPercent: 90,
      status: 'IN_PROGRESS',
      canvaLink: 'https://canva.link/1wl8s3qhpey9jom',
    },
    {
      id: 'p2',
      wakaTitle: 'WAKA KURIKULUM (USTZ. ALDA NUR ALFI LAIL)',
      title: 'Pengembangan Kurikulum Ubudiyyah & Setoran Halqah Tahfizh',
      month: 'Juli 2026',
      targetPercent: 100,
      actualPercent: 95,
      status: 'IN_PROGRESS',
      canvaLink: 'https://canva.link/1wl8s3qhpey9jom',
    },
    {
      id: 'p3',
      wakaTitle: 'WAKA K2S (USTZ. LUTPIANA ULPAH)',
      title: 'Pemeriksaan Sanitasi Asrama & Peremajaan Sarana Prasarana',
      month: 'Juli 2026',
      targetPercent: 100,
      actualPercent: 85,
      status: 'IN_PROGRESS',
      canvaLink: 'https://canva.link/1wl8s3qhpey9jom',
    },
  ])

  // 2. Perizinan Approvals from Wali Santri
  const [perizinanList, setPerizinanList] = useState([
    {
      id: 'pz1',
      santriName: 'Aisyah Az-Zahra',
      nis: 'S2026005',
      room: 'An Nur 02',
      parentName: 'Bpk. Bambang',
      type: 'PERIZINAN PULANG',
      departDate: '2026-07-22',
      returnDate: '2026-07-25',
      reason: 'Syukuran Pernikahan Kakak Kandung',
      status: 'PENDING',
    },
    {
      id: 'pz2',
      santriName: 'Ahmad Raihan',
      nis: 'S2026001',
      room: 'Al Fajr 1',
      parentName: 'Bpk. Hendra',
      type: 'PERIZINAN SAKIT',
      departDate: '2026-07-20',
      returnDate: '2026-07-23',
      reason: 'Istirahat & Demem Tinggi (Rujukan Klinik)',
      status: 'PENDING',
    },
    {
      id: 'pz3',
      santriName: 'Salma Khairunnisa',
      nis: 'S2026007',
      room: 'An Najm 1',
      parentName: 'Bpk. Usman',
      type: 'PERIZINAN PULANG',
      departDate: '2026-07-15',
      returnDate: '2026-07-18',
      reason: 'Acara Keluarga',
      status: 'DISETUJUI',
    },
  ])

  // 3. Custom Pelanggaran Entry State
  const [pelanggaranText, setPelanggaranText] = useState('')
  const [santriNameInput, setSantriNameInput] = useState('Aisyah Az-Zahra')
  const [asramaInput, setAsramaInput] = useState('An Nur 02')
  const [kelasInput, setKelasInput] = useState('7A Banat')
  const [musyrifahInput, setMusyrifahInput] = useState('Ustadzah Afi Basyiroh, S.Pd.')
  const [demeritPoints, setDemeritPoints] = useState(10)
  const [tindakLanjutInput, setTindakLanjutInput] = useState('Surat Peringatan 1 & Tugas Hafalan Surat As-Sajdah')

  const [pelanggaranHistory, setPelanggaranHistory] = useState([
    {
      id: 'v1',
      date: '2026-07-20',
      type: 'Terlambat mengikuti halqah Al-Quran pagi',
      santriName: 'Aisyah Az-Zahra',
      asrama: 'An Nur 02',
      kelas: '7A Banat',
      musyrifah: 'Ustadzah Afi Basyiroh, S.Pd.',
      points: 5,
      tindakLanjut: 'Pembinaan kedisiplinan dan membaca Al-Quran 2 juz',
    },
  ])

  // Handle Approve / Reject Perizinan
  const handleApprovePerizinan = (id: string, isApprove: boolean) => {
    setPerizinanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: isApprove ? 'DISETUJUI' : 'DITOLAK' } : p))
    )
    setActionAlertMsg(`Perizinan santri telah ${isApprove ? 'DISETUJUI' : 'DITOLAK'}. Notifikasi terkirim ke Wali Santri.`)
    setTimeout(() => setActionAlertMsg(''), 4000)
  }

  // Handle Form Submit for Custom Pelanggaran
  const handlePelanggaranSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pelanggaranText.trim()) {
      alert('Tuliskan jenis pelanggaran terlebih dahulu.')
      return
    }

    const newRec = {
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      type: pelanggaranText,
      santriName: santriNameInput,
      asrama: asramaInput,
      kelas: kelasInput,
      musyrifah: musyrifahInput,
      points: demeritPoints,
      tindakLanjut: tindakLanjutInput,
    }

    setPelanggaranHistory([newRec, ...pelanggaranHistory])
    setPelanggaranText('')
    setActionAlertMsg('✅ Data Pelanggaran & Tindak Lanjut berhasil ditambahkan!')
    setTimeout(() => setActionAlertMsg(''), 4000)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        borderRadius: '16px',
        padding: '28px 24px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: '0 10px 20px rgba(6,78,59,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={28} color="#fde68a" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', background: 'rgba(251,191,36,0.2)', padding: '4px 10px', borderRadius: '6px', color: '#fef3c7' }}>
            DASHBOARD DEWAN WAKA (KESANTRIAN, KURIKULUM, K2S)
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>
          Program Kerja, Approval Perizinan & Catat Pelanggaran
        </h1>
        <p style={{ fontSize: '14px', color: '#d1fae5', margin: 0 }}>
          Pondok Pesantren Tahfizh Al-Kaukab Bojong Nangka — TA 2026/2027
        </p>
      </div>

      {actionAlertMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          color: '#065f46',
          padding: '14px 18px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: 700,
        }}>
          {actionAlertMsg}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('PROKER')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeSubTab === 'PROKER' ? '#064e3b' : '#f1f5f9',
            color: activeSubTab === 'PROKER' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Target size={18} /> Program Kerja & Target Bulanan Waka
        </button>

        <button
          onClick={() => setActiveSubTab('PERIZINAN')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeSubTab === 'PERIZINAN' ? '#064e3b' : '#f1f5f9',
            color: activeSubTab === 'PERIZINAN' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <UserCheck size={18} /> Approval Perizinan Wali Santri
        </button>

        <button
          onClick={() => setActiveSubTab('PELANGGARAN')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeSubTab === 'PELANGGARAN' ? '#064e3b' : '#f1f5f9',
            color: activeSubTab === 'PELANGGARAN' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={18} /> Update & Catat Pelanggaran Santri
        </button>
      </div>

      {/* SECTION 1: PROGRAM KERJA WAKA */}
      {activeSubTab === 'PROKER' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064e3b', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="#064e3b" /> Program Kerja & Target Bulanan Waka
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Pemantauan target realisasi bulanan divisi Kesantrian, Kurikulum, & K2S
              </p>
            </div>

            <a
              href="https://canva.link/1wl8s3qhpey9jom"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #bfdbfe',
              }}
            >
              <ExternalLink size={16} /> Buka Dokumen Canva Program Kerja ↗
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            {prokerList.map((p) => (
              <div key={p.id} style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '14px',
                padding: '20px',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#064e3b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {p.wakaTitle}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {p.title}
                </h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Bulan: {p.month}</span>
                  <span style={{ color: '#047857' }}>Realisasi: {p.actualPercent}% / {p.targetPercent}%</span>
                </div>

                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ width: `${p.actualPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }} />
                </div>

                <a
                  href={p.canvaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#2563eb',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  🔗 Lihat Detail di Canva ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PERIZINAN APPROVAL */}
      {activeSubTab === 'PERIZINAN' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#064e3b', margin: 0 }}>
              ✉️ Permohonan Perizinan Pulang & Sakit Santri Dari Wali Santri
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '12px 16px' }}>Santri & NIS</th>
                  <th style={{ padding: '12px 16px' }}>Asrama</th>
                  <th style={{ padding: '12px 16px' }}>Wali Santri</th>
                  <th style={{ padding: '12px 16px' }}>Jenis Izin</th>
                  <th style={{ padding: '12px 16px' }}>Tanggal Keberangkatan & Kembali</th>
                  <th style={{ padding: '12px 16px' }}>Alasan Izin</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Aksi Approval Waka</th>
                </tr>
              </thead>
              <tbody>
                {perizinanList.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.santriName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>NIS: {p.nis}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{p.room}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{p.parentName}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#064e3b' }}>{p.type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#475569' }}>
                      📅 {p.departDate} s/d {p.returnDate}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{p.reason}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background:
                          p.status === 'DISETUJUI' ? '#ecfdf5' :
                          p.status === 'DITOLAK' ? '#fef2f2' : '#fffbeb',
                        color:
                          p.status === 'DISETUJUI' ? '#047857' :
                          p.status === 'DITOLAK' ? '#dc2626' : '#b45309',
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleApprovePerizinan(p.id, true)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: '#10b981',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleApprovePerizinan(p.id, false)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: MENCATAT PELANGGARAN & TINDAK LANJUT */}
      {activeSubTab === 'PELANGGARAN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Custom Violation Form */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#dc2626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#dc2626" /> Pencatatan Pelanggaran & Tindak Lanjut
            </h3>

            <form onSubmit={handlePelanggaranSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Jenis Pelanggaran (Tulis Sendiri / Custom)
                </label>
                <input
                  type="text"
                  value={pelanggaranText}
                  onChange={(e) => setPelanggaranText(e.target.value)}
                  placeholder="Contoh: Menggunakan perangkat elektronik tanpa izin"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Nama Santri
                  </label>
                  <input
                    type="text"
                    value={santriNameInput}
                    onChange={(e) => setSantriNameInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Asrama
                  </label>
                  <input
                    type="text"
                    value={asramaInput}
                    onChange={(e) => setAsramaInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={kelasInput}
                    onChange={(e) => setKelasInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Musyrif / Musyrifah
                  </label>
                  <input
                    type="text"
                    value={musyrifahInput}
                    onChange={(e) => setMusyrifahInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Poin Pengurangan Pelanggaran
                </label>
                <input
                  type="number"
                  value={demeritPoints}
                  onChange={(e) => setDemeritPoints(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#dc2626' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Tindak Lanjut & Sanksi Mendidik
                </label>
                <textarea
                  rows={3}
                  value={tindakLanjutInput}
                  onChange={(e) => setTindakLanjutInput(e.target.value)}
                  placeholder="Tuliskan tindakan disiplin atau penugasan..."
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(220,38,38,0.25)',
                }}
              >
                Catat Pelanggaran & Tindak Lanjut
              </button>
            </form>
          </div>

          {/* History List */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              📋 Riwayat Record Pelanggaran Santri
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {pelanggaranHistory.map((item) => (
                <div key={item.id} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#dc2626', margin: 0 }}>
                      ⚠️ {item.type}
                    </h4>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: '#fef2f2', color: '#dc2626', padding: '3px 8px', borderRadius: '6px' }}>
                      -{item.points} Poin
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#334155', marginBottom: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>👤 <strong>{item.santriName}</strong></span>
                    <span>🏢 {item.asrama} ({item.kelas})</span>
                    <span>✍️ {item.musyrifah}</span>
                  </div>

                  <div style={{ fontSize: '12px', background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569' }}>
                    🛡️ <strong>Tindak Lanjut:</strong> {item.tindakLanjut}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
