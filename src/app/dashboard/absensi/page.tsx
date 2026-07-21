'use client'

import { useState, useEffect, useCallback } from 'react'
import { ClipboardList, Plus, X } from 'lucide-react'

interface Musyrif {
  id: string
  name: string
}

interface Absensi {
  id: string
  date: string
  status: string
  note?: string
  musyrif: { id: string; name: string }
}

export default function AbsensiPage() {
  const [absensiList, setAbsensiList] = useState<Absensi[]>([])
  const [musyrifList, setMusyrifList] = useState<Musyrif[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: 'HADIR',
    note: '',
    musyrifId: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [absensiRes, musyrifRes] = await Promise.all([
        fetch(`/api/absensi?month=${month}`),
        fetch('/api/musyrif'),
      ])
      if (absensiRes.ok) {
        const data = await absensiRes.json()
        setAbsensiList(Array.isArray(data) ? data : [])
      }
      if (musyrifRes.ok) {
        const data = await musyrifRes.json()
        setMusyrifList(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching absensi:', err)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/absensi', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setShowModal(false)
    fetchData()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HADIR': return 'badge-success'
      case 'IZIN': return 'badge-info'
      case 'SAKIT': return 'badge-warning'
      case 'ALPHA': return 'badge-danger'
      default: return 'badge-neutral'
    }
  }

  // Summary counts
  const summary = {
    hadir: absensiList.filter(a => a.status === 'HADIR').length,
    izin: absensiList.filter(a => a.status === 'IZIN').length,
    sakit: absensiList.filter(a => a.status === 'SAKIT').length,
    alpha: absensiList.filter(a => a.status === 'ALPHA').length,
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ClipboardList size={24} /> Absensi Musyrif/ah &amp; Fingerprint
      </h1>

      {/* Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green"><ClipboardList size={24} /></div>
          <div className="stat-info"><h3>{summary.hadir}</h3><p>Hadir</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><ClipboardList size={24} /></div>
          <div className="stat-info"><h3>{summary.izin}</h3><p>Izin</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><ClipboardList size={24} /></div>
          <div className="stat-info"><h3>{summary.sakit}</h3><p>Sakit</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><ClipboardList size={24} /></div>
          <div className="stat-info"><h3>{summary.alpha}</h3><p>Alpha</p></div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <input
            type="month"
            className="form-input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => {
            setForm({ date: new Date().toISOString().slice(0, 10), status: 'HADIR', note: '', musyrifId: '' })
            setShowModal(true)
          }}>
            <Plus size={16} /> Tambah Absensi
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : absensiList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><ClipboardList size={28} /></div>
              <h3>Belum ada data absensi</h3>
              <p>Tambahkan absensi musyrif/ah untuk bulan ini</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Musyrif/ah</th>
                    <th>Status</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {absensiList.map((a) => (
                    <tr key={a.id}>
                      <td>{new Date(a.date).toLocaleDateString('id-ID')}</td>
                      <td style={{ fontWeight: 600 }}>{a.musyrif.name}</td>
                      <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{a.note || '-'}</td>
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
              <h3 className="modal-title">Tambah Absensi</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tanggal</label>
                    <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Musyrif/ah</label>
                    <select className="form-select" value={form.musyrifId} onChange={(e) => setForm({ ...form, musyrifId: e.target.value })} required>
                      <option value="">-- Pilih --</option>
                      {musyrifList.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="HADIR">Hadir</option>
                    <option value="IZIN">Izin</option>
                    <option value="SAKIT">Sakit</option>
                    <option value="ALPHA">Alpha</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Catatan</label>
                  <textarea className="form-textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ minHeight: '60px' }} />
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
