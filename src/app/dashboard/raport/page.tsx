'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Plus, X } from 'lucide-react'

interface Raport {
  id: string
  period: string
  totalPoints: number
  grade: string
  details?: string
  generatedAt: string
  santri: { id: string; name: string; nis: string }
}

interface Santri { id: string; name: string; nis: string }

export default function RaportPage() {
  const [raportList, setRaportList] = useState<Raport[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState<Raport | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ santriId: '', period: '2024/2025 - Semester 1' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [raportRes, santriRes] = await Promise.all([
      fetch('/api/raport'),
      fetch('/api/santri'),
    ])
    setRaportList(await raportRes.json())
    setSantriList(await santriRes.json())
    setLoading(false)
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
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <BarChart3 size={24} /> Raport Pelanggaran
      </h1>

      <div className="toolbar">
        <div className="toolbar-left">
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {raportList.length} raport telah digenerate
          </span>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => {
            setForm({ santriId: '', period: '2024/2025 - Semester 1' })
            setShowModal(true)
          }}>
            <Plus size={16} /> Generate Raport
          </button>
        </div>
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

      {/* Detail Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Detail Raport</h3>
              <button className="modal-close" onClick={() => setShowDetail(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="raport-header" style={{ borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-arabic)', fontSize: '20px' }}>
                  بسم الله الرحمن الرحيم
                </h2>
                <h2 style={{ fontSize: '18px', marginTop: '8px' }}>Raport Pelanggaran Santri</h2>
                <p>{showDetail.period}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p><strong>Nama:</strong> {showDetail.santri.name}</p>
                <p><strong>NIS:</strong> {showDetail.santri.nis}</p>
                <p><strong>Periode:</strong> {showDetail.period}</p>
              </div>

              <div className="raport-score" style={{ padding: '20px 0' }}>
                <div className="score-circle" style={{
                  borderColor: getGradeInfo(showDetail.grade).color,
                  color: getGradeInfo(showDetail.grade).color
                }}>
                  <span className="score-value">{showDetail.totalPoints}</span>
                  <span className="score-label">Poin</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
                    {getGradeInfo(showDetail.grade).label}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Pengurangan: {100 - showDetail.totalPoints} poin
                  </p>
                </div>
              </div>

              {showDetail.details && (() => {
                try {
                  const details = JSON.parse(showDetail.details)
                  return (
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 700 }}>Rincian Pelanggaran</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Total Pelanggaran: {details.totalViolations} kasus
                      </p>
                      {details.categorySummary && Object.keys(details.categorySummary).length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {Object.entries(details.categorySummary).map(([cat, pts]) => (
                            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600 }}>{cat}</span>
                              <span style={{ fontSize: '13px', color: 'var(--status-danger)', fontWeight: 700 }}>-{pts as number} poin</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                } catch { return null }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
