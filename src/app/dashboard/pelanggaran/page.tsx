'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, Plus, X, Search } from 'lucide-react'

interface Pelanggaran {
  id: string
  date: string
  category: string
  level: string
  description: string
  points: number
  santri: { id: string; name: string; nis: string }
  musyrif: { id: string; name: string }
}

interface Santri { id: string; name: string; nis: string }
interface Musyrif { id: string; name: string }

export default function PelanggaranPage() {
  const [list, setList] = useState<Pelanggaran[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [musyrifList, setMusyrifList] = useState<Musyrif[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    santriId: '', musyrifId: '', date: new Date().toISOString().slice(0, 10),
    category: 'KETERTIBAN', level: 'RINGAN', description: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [pelRes, santriRes, musyrifRes] = await Promise.all([
      fetch('/api/pelanggaran'),
      fetch('/api/santri'),
      fetch('/api/musyrif'),
    ])
    setList(await pelRes.json())
    setSantriList(await santriRes.json())
    setMusyrifList(await musyrifRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/pelanggaran', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setShowModal(false)
    fetchData()
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'RINGAN': return 'badge-info'
      case 'SEDANG': return 'badge-warning'
      case 'BERAT': return 'badge-danger'
      case 'SANGAT_BERAT': return 'badge-danger'
      default: return 'badge-neutral'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'RINGAN': return 'Ringan'
      case 'SEDANG': return 'Sedang'
      case 'BERAT': return 'Berat'
      case 'SANGAT_BERAT': return 'Sangat Berat'
      default: return level
    }
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'IBADAH': return 'Ibadah'
      case 'AKHLAK': return 'Akhlak'
      case 'KETERTIBAN': return 'Ketertiban'
      case 'KEBERSIHAN': return 'Kebersihan'
      case 'AKADEMIK': return 'Akademik'
      default: return cat
    }
  }

  const filtered = list.filter(p =>
    p.santri.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  // Summary
  const totalPoin = filtered.reduce((sum, p) => sum + p.points, 0)

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertTriangle size={24} /> Pelanggaran Santri
      </h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red"><AlertTriangle size={24} /></div>
          <div className="stat-info"><h3>{filtered.length}</h3><p>Total Pelanggaran</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><AlertTriangle size={24} /></div>
          <div className="stat-info"><h3>{totalPoin}</h3><p>Total Poin Pengurangan</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><AlertTriangle size={24} /></div>
          <div className="stat-info"><h3>{filtered.filter(p => p.level === 'BERAT' || p.level === 'SANGAT_BERAT').length}</h3><p>Pelanggaran Berat</p></div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search className="search-icon" />
            <input placeholder="Cari santri atau deskripsi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => {
            setForm({ santriId: '', musyrifId: '', date: new Date().toISOString().slice(0, 10), category: 'KETERTIBAN', level: 'RINGAN', description: '' })
            setShowModal(true)
          }}>
            <Plus size={16} /> Input Pelanggaran
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><AlertTriangle size={28} /></div>
              <h3>Belum ada pelanggaran</h3>
              <p>Alhamdulillah, belum ada pelanggaran tercatat</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Santri</th>
                    <th>Kategori</th>
                    <th>Level</th>
                    <th>Deskripsi</th>
                    <th>Poin</th>
                    <th>Pencatat</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>{new Date(p.date).toLocaleDateString('id-ID')}</td>
                      <td style={{ fontWeight: 600 }}>{p.santri.name}</td>
                      <td><span className="badge badge-neutral">{getCategoryLabel(p.category)}</span></td>
                      <td><span className={`badge ${getLevelBadge(p.level)}`}>{getLevelLabel(p.level)}</span></td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</td>
                      <td style={{ fontWeight: 700, color: 'var(--status-danger)' }}>-{p.points}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.musyrif.name}</td>
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
              <h3 className="modal-title">Input Pelanggaran</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Santri</label>
                    <select className="form-select" value={form.santriId} onChange={(e) => setForm({ ...form, santriId: e.target.value })} required>
                      <option value="">-- Pilih --</option>
                      {santriList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pencatat (Musyrif)</label>
                    <select className="form-select" value={form.musyrifId} onChange={(e) => setForm({ ...form, musyrifId: e.target.value })} required>
                      <option value="">-- Pilih --</option>
                      {musyrifList.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal</label>
                  <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="IBADAH">Ibadah</option>
                      <option value="AKHLAK">Akhlak</option>
                      <option value="KETERTIBAN">Ketertiban</option>
                      <option value="KEBERSIHAN">Kebersihan</option>
                      <option value="AKADEMIK">Akademik</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select className="form-select" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                      <option value="RINGAN">Ringan (-5 poin)</option>
                      <option value="SEDANG">Sedang (-15 poin)</option>
                      <option value="BERAT">Berat (-30 poin)</option>
                      <option value="SANGAT_BERAT">Sangat Berat (-50 poin)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Deskripsi Pelanggaran</label>
                  <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Jelaskan pelanggaran yang dilakukan..." />
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
