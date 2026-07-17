'use client'

import { useState, useEffect, useCallback } from 'react'
import { Network, Plus, Edit, Trash2, X } from 'lucide-react'

interface StrukturItem {
  id: string
  name: string
  position: string
  period: string
  order: number
  parentId?: string
}

export default function StrukturPage() {
  const [items, setItems] = useState<StrukturItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<StrukturItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', position: '', period: '', order: 0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/struktur')
    setItems(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', position: '', period: new Date().getFullYear().toString(), order: items.length })
    setShowModal(true)
  }

  function openEdit(s: StrukturItem) {
    setEditItem(s)
    setForm({ name: s.name, position: s.position, period: s.period, order: s.order })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editItem) {
      await fetch('/api/struktur', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editItem.id, ...form }),
      })
    } else {
      await fetch('/api/struktur', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    }
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus jabatan ini?')) return
    await fetch('/api/struktur', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  // Group by level for visual org chart
  const topLeader = items.filter(i => i.order === 0)
  const midLeader = items.filter(i => i.order === 1)
  const staff = items.filter(i => i.order >= 2)

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Network size={24} /> Struktur Organisasi
      </h1>

      <div className="toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Tambah Jabatan
          </button>
        </div>
      </div>

      {/* Visual Org Chart */}
      {items.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h3 className="card-title">Bagan Organisasi</h3>
          </div>
          <div className="card-body">
            <div className="org-chart">
              {topLeader.length > 0 && (
                <>
                  <div className="org-level">
                    {topLeader.map((s) => (
                      <div key={s.id} className="org-node highlight">
                        <div className="org-node-name">{s.name}</div>
                        <div className="org-node-position">{s.position}</div>
                      </div>
                    ))}
                  </div>
                  {(midLeader.length > 0 || staff.length > 0) && <div className="org-connector" />}
                </>
              )}
              {midLeader.length > 0 && (
                <>
                  <div className="org-level">
                    {midLeader.map((s) => (
                      <div key={s.id} className="org-node">
                        <div className="org-node-name">{s.name}</div>
                        <div className="org-node-position">{s.position}</div>
                      </div>
                    ))}
                  </div>
                  {staff.length > 0 && <div className="org-connector" />}
                </>
              )}
              {staff.length > 0 && (
                <div className="org-level">
                  {staff.map((s) => (
                    <div key={s.id} className="org-node">
                      <div className="org-node-name">{s.name}</div>
                      <div className="org-node-position">{s.position}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Daftar Jabatan</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Network size={28} /></div>
              <h3>Belum ada struktur</h3>
              <p>Tambahkan jabatan untuk membentuk struktur organisasi</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Urutan</th>
                    <th>Nama</th>
                    <th>Jabatan</th>
                    <th>Periode</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.id}>
                      <td><span className="badge badge-info">{s.order}</span></td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.position}</td>
                      <td>{s.period}</td>
                      <td>
                        <div className="table-actions">
                          <button className="table-action-btn" onClick={() => openEdit(s)}><Edit size={16} /></button>
                          <button className="table-action-btn danger" onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button>
                        </div>
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
              <h3 className="modal-title">{editItem ? 'Edit Jabatan' : 'Tambah Jabatan'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Pengurus</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Jabatan</label>
                  <input className="form-input" placeholder="Contoh: Ketua, Sekretaris, Bendahara" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Periode</label>
                    <input className="form-input" placeholder="2024/2025" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Urutan Level (0=Tertinggi)</label>
                    <input className="form-input" type="number" min="0" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">{editItem ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
