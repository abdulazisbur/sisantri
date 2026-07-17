'use client'

import { useState, useEffect, useCallback } from 'react'
import { HeartPulse, Plus, X, Check, XCircle } from 'lucide-react'

interface PerizinanSakit {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: string
  document?: string
  santri: { id: string; name: string; nis: string }
  musyrif: { id: string; name: string }
}

interface Santri { id: string; name: string; nis: string }
interface Musyrif { id: string; name: string }

export default function PerizinanSakitPage() {
  const [list, setList] = useState<PerizinanSakit[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [musyrifList, setMusyrifList] = useState<Musyrif[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    santriId: '', musyrifId: '', startDate: '', endDate: '', reason: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [perizinanRes, santriRes, musyrifRes] = await Promise.all([
      fetch('/api/perizinan/sakit'),
      fetch('/api/santri'),
      fetch('/api/musyrif'),
    ])
    setList(await perizinanRes.json())
    setSantriList(await santriRes.json())
    setMusyrifList(await musyrifRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/perizinan/sakit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setShowModal(false)
    fetchData()
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/perizinan/sakit', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchData()
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
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <HeartPulse size={24} /> Perizinan Sakit
      </h1>

      <div className="toolbar">
        <div className="toolbar-left">
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {list.filter(l => l.status === 'PENDING').length} perizinan menunggu persetujuan
          </span>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => {
            setForm({ santriId: '', musyrifId: '', startDate: '', endDate: '', reason: '' })
            setShowModal(true)
          }}>
            <Plus size={16} /> Buat Perizinan
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><HeartPulse size={28} /></div>
              <h3>Belum ada perizinan sakit</h3>
              <p>Buat perizinan sakit untuk santri yang sedang sakit</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Santri</th>
                    <th>Mulai</th>
                    <th>Selesai</th>
                    <th>Alasan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.santri.name}</td>
                      <td>{new Date(p.startDate).toLocaleDateString('id-ID')}</td>
                      <td>{new Date(p.endDate).toLocaleDateString('id-ID')}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.reason}</td>
                      <td><span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span></td>
                      <td>
                        {p.status === 'PENDING' && (
                          <div className="table-actions">
                            <button className="table-action-btn" onClick={() => updateStatus(p.id, 'DISETUJUI')} title="Setujui">
                              <Check size={16} style={{ color: 'var(--status-success)' }} />
                            </button>
                            <button className="table-action-btn" onClick={() => updateStatus(p.id, 'DITOLAK')} title="Tolak">
                              <XCircle size={16} style={{ color: 'var(--status-danger)' }} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Buat Perizinan Sakit</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Santri</label>
                    <select className="form-select" value={form.santriId} onChange={(e) => setForm({ ...form, santriId: e.target.value })} required>
                      <option value="">-- Pilih Santri --</option>
                      {santriList.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Musyrif</label>
                    <select className="form-select" value={form.musyrifId} onChange={(e) => setForm({ ...form, musyrifId: e.target.value })} required>
                      <option value="">-- Pilih --</option>
                      {musyrifList.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai</label>
                    <input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Alasan / Keluhan</label>
                  <textarea className="form-textarea" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
