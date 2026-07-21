'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Plus, X, Printer, FileText } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '@/components/DashboardShell'

interface Raport {
  id: string
  period: string
  totalPoints: number
  grade: string
  details?: string
  generatedAt: string
  santri: { id: string; name: string; nis: string; class?: string; room?: string }
}

interface Santri { id: string; name: string; nis: string }

export default function RaportPage() {
  const user = useUser()
  const [raportList, setRaportList] = useState<Raport[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState<Raport | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ santriId: '', period: '2024/2025 - Semester 1' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [raportRes, santriRes] = await Promise.all([
        fetch('/api/raport'),
        fetch('/api/santri'),
      ])
      if (raportRes.ok) {
        const data = await raportRes.json()
        setRaportList(Array.isArray(data) ? data : [])
      }
      if (santriRes.ok) {
        const data = await santriRes.json()
        setSantriList(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching raport data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/raport', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setShowModal(false)
    fetchData()
  }

  function handlePrint() {
    window.print()
  }

  const getGradeInfo = (grade: string) => {
    switch (grade) {
      case 'MUMTAZ': return { label: 'Mumtaz (Istimewa)', color: '#10b981', bgClass: 'badge-success' }
      case 'JAYYID_JIDDAN': return { label: 'Jayyid Jiddan (Sangat Baik)', color: '#3b82f6', bgClass: 'badge-info' }
      case 'JAYYID': return { label: 'Jayyid (Baik)', color: '#eab308', bgClass: 'badge-warning' }
      case 'MAQBUL': return { label: 'Maqbul (Cukup)', color: '#f97316', bgClass: 'badge-warning' }
      case 'RASIB': return { label: 'Rasib (Kurang)', color: '#ef4444', bgClass: 'badge-danger' }
      default: return { label: grade, color: '#94a3b8', bgClass: 'badge-neutral' }
    }
  }

  return (
    <div>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-raport, #printable-raport * {
            visibility: visible;
          }
          #printable-raport {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <BarChart3 size={24} /> Raport &amp; Evaluation Record Santri
      </h1>

      <div className="toolbar">
        <div className="toolbar-left">
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {raportList.length} raport telah digenerate
          </span>
        </div>
        {user?.role !== 'SANTRI' && (
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={() => {
              setForm({ santriId: '', period: '2024/2025 - Semester 1' })
              setShowModal(true)
            }}>
              <Plus size={16} /> Generate Raport
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="loading-spinner" /></div>
      ) : raportList.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><BarChart3 size={28} /></div>
            <h3>Belum ada raport</h3>
            <p>Generate raport untuk melihat hasil kalkulasi pelanggaran santri</p>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {raportList.map((r) => {
            const gradeInfo = getGradeInfo(r.grade)
            return (
              <div className="raport-card" key={r.id} onClick={() => setShowDetail(r)} style={{ cursor: 'pointer' }}>
                <div className="raport-header">
                  <h2>{r.santri.name}</h2>
                  <p>{r.period}</p>
                </div>
                <div className="raport-score">
                  <div className="score-circle" style={{ borderColor: gradeInfo.color, color: gradeInfo.color }}>
                    <span className="score-value">{r.totalPoints}</span>
                    <span className="score-label">Poin</span>
                  </div>
                  <div>
                    <span className={`badge ${gradeInfo.bgClass}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                      {gradeInfo.label}
                    </span>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '8px' }}>
                      {new Date(r.generatedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Generate Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Generate Raport</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleGenerate}>
              <div className="modal-body">
                <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                  ⚠️ Raport akan digenerate berdasarkan seluruh pelanggaran santri yang tercatat.
                </div>
                <div className="form-group">
                  <label className="form-label">Santri</label>
                  <select className="form-select" value={form.santriId} onChange={(e) => setForm({ ...form, santriId: e.target.value })} required>
                    <option value="">-- Pilih Santri --</option>
                    {santriList.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Periode</label>
                  <input className="form-input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2024/2025 - Semester 1" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail & Print PDF Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header no-print">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} /> Preview Raport Santri
              </h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Printer size={16} /> Cetak / Download PDF
                </button>
                <button className="modal-close" onClick={() => setShowDetail(null)}><X size={20} /></button>
              </div>
            </div>

            <div className="modal-body" id="printable-raport" style={{ background: '#fff', color: '#0f172a', borderRadius: '12px', padding: '24px' }}>
              {/* Kop Surat Al-Kaukab */}
              <div style={{ textAlign: 'center', borderBottom: '3px double #064e3b', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                  <Image src="/logo-alkaukab.jpg" alt="Logo Al-Kaukab" width={60} height={60} style={{ borderRadius: '8px' }} />
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#064e3b', margin: 0 }}>PONDOK PESANTREN TAHFIZH AL-KAUKAB</h2>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0 0', fontWeight: 600 }}>BOJONG NANGKA, GUNUNG PUTRI, BOGOR</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Jl. Raya Bojong Nangka RT.21 RW.09 Bojong Nangka, Gunung Putri, Bogor 16963</p>
                  </div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px', marginTop: '12px', textTransform: 'uppercase', color: '#064e3b' }}>
                  RAPORT KEDISIPLINAN &amp; EVALUASI AKHLAK
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>{showDetail.period}</p>
              </div>

              {/* Biodata Santri */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                <div><strong>Nama Santri:</strong> {showDetail.santri.name}</div>
                <div><strong>NIS:</strong> {showDetail.santri.nis}</div>
                <div><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div><strong>Status Poin:</strong> <span style={{ fontWeight: 800, color: getGradeInfo(showDetail.grade).color }}>{showDetail.totalPoints} / 100 Poin</span></div>
              </div>

              {/* Score Box */}
              <div className="raport-score" style={{ padding: '16px', background: '#f1f5f9', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '14px', margin: 0, color: '#475569' }}>Predikat Kedisiplinan</h4>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0', color: getGradeInfo(showDetail.grade).color }}>
                    {getGradeInfo(showDetail.grade).label}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: getGradeInfo(showDetail.grade).color }}>
                    {showDetail.totalPoints}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Total Poin Akhir</span>
                </div>
              </div>

              {/* Details */}
              {showDetail.details && (() => {
                try {
                  const details = JSON.parse(showDetail.details)
                  return (
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 700, color: '#064e3b' }}>Rincian Akumulasi Pelanggaran</h4>
                      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                        Total Pelanggaran Tercatat: <strong>{details.totalViolations} kasus</strong>
                      </p>
                      {details.categorySummary && Object.keys(details.categorySummary).length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
                          <thead>
                            <tr style={{ background: '#064e3b', color: 'white' }}>
                              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Kategori Pelanggaran</th>
                              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Pengurangan Poin</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(details.categorySummary).map(([cat, pts]) => (
                              <tr key={cat} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{cat}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', color: '#dc2626', fontWeight: 700 }}>-{pts as number} Poin</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )
                } catch { return null }
              })()}

              {/* Tanda Tangan Resmi */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', textAlign: 'center', fontSize: '12px' }}>
                <div>
                  <p style={{ marginBottom: '60px' }}>Musyrif / Wali Asrama,</p>
                  <p style={{ fontWeight: 700, textDecoration: 'underline' }}>( .................................................... )</p>
                </div>
                <div>
                  <p style={{ marginBottom: '60px' }}>Kepala Pengasuhan Santri,</p>
                  <p style={{ fontWeight: 700, textDecoration: 'underline' }}>( Ust. H. Ahmad Sholahudin, S.E. )</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

