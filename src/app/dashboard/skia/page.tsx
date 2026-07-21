'use client'

import { useState, useEffect, useCallback } from 'react'
import { FileText, Plus, X } from 'lucide-react'

interface SKIA {
  id: string
  type: string
  issueDate: string
  description?: string
  status: string
  santri: { id: string; name: string; nis: string }
}

interface Santri { id: string; name: string; nis: string }

export default function SKIAPage() {
  const [list, setList] = useState<SKIA[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ santriId: '', type: 'IZIN_AKTIF', description: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [skiaRes, santriRes] = await Promise.all([
        fetch('/api/skia'),
        fetch('/api/santri'),
      ])
      if (skiaRes.ok) {
        const data = await skiaRes.json()
        setList(Array.isArray(data) ? data : [])
      }
      if (santriRes.ok) {
        const data = await santriRes.json()
        setSantriList(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching SKIA data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/skia', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setShowModal(false)
    fetchData()
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/skia', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchData()
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'IZIN_AKTIF': return 'Surat Izin Aktif'
      case 'KETERANGAN_SANTRI': return 'Keterangan Santri'
      case 'REKOMENDASI': return 'Surat Rekomendasi'
      default: return type
    }
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={24} /> SKIA (Surat Keterangan Ibadah Amaliyah)
      </h1>

      <div className="toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => {
            setForm({ santriId: '', type: 'IZIN_AKTIF', description: '' })
            setShowModal(true)
          }}>
            <Plus size={16} /> Buat Surat
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FileText size={28} /></div>
              <h3>Belum ada surat</h3>
              <p>Buat surat keterangan untuk santri</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Santri</th>
                    <th>Jenis Surat</th>
                    <th>Tanggal</th>
                    <th>Keterangan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.santri.name}</td>
                      <td><span className="badge badge-info">{getTypeLabel(s.type)}</span></td>
                      <td>{new Date(s.issueDate).toLocaleDateString('id-ID')}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{s.description || '-'}</td>
                      <td>
                        <span className={`badge ${s.status === 'DITERBITKAN' ? 'badge-success' : 'badge-warning'}`}>
                          {s.status === 'DITERBITKAN' ? 'Diterbitkan' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        {s.status === 'DRAFT' && (
                          <button className="btn btn-sm btn-primary" onClick={() => updateStatus(s.id, 'DITERBITKAN')}>
                            Terbitkan
                          </button>
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
              <h3 className="modal-title">Buat Surat Keterangan</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Santri</label>
                  <select className="form-select" value={form.santriId} onChange={(e) => setForm({ ...form, santriId: e.target.value })} required>
                    <option value="">-- Pilih Santri --</option>
                    {santriList.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Surat</label>
                  <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="IZIN_AKTIF">Surat Izin Aktif</option>
                    <option value="KETERANGAN_SANTRI">Keterangan Santri</option>
                    <option value="REKOMENDASI">Surat Rekomendasi</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan Tambahan</label>
                  <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
