'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserCheck, Plus, Edit, Trash2, X } from 'lucide-react'

interface Musyrif {
  id: string
  name: string
  gender: string
  phone?: string
  division?: string
  _count?: { santriList: number }
}

export default function MusyrifPage() {
  const [list, setList] = useState<Musyrif[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Musyrif | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', gender: 'L', phone: '', division: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/musyrif')
    setList(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', gender: 'L', phone: '', division: '' })
    setShowModal(true)
  }

  function openEdit(m: Musyrif) {
    setEditItem(m)
    setForm({ name: m.name, gender: m.gender, phone: m.phone || '', division: m.division || '' })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editItem) {
      await fetch(`/api/musyrif/${editItem.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/musyrif', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
    }
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus data musyrif ini?')) return
    await fetch(`/api/musyrif/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserCheck size={24} /> Data Musyrif/ah
      </h1>

      <div className="toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Tambah Musyrif
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><UserCheck size={28} /></div>
              <h3>Belum ada data musyrif</h3>
              <p>Klik tombol &quot;Tambah Musyrif&quot; untuk menambahkan data</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>L/P</th>
                    <th>Telepon</th>
                    <th>Divisi</th>
                    <th>Jumlah Santri</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.gender}</td>
                      <td>{m.phone || '-'}</td>
                      <td>{m.division || '-'}</td>
                      <td><span className="badge badge-info">{m._count?.santriList || 0} santri</span></td>
                      <td>
                        <div className="table-actions">
                          <button className="table-action-btn" onClick={() => openEdit(m)}><Edit size={16} /></button>
                          <button className="table-action-btn danger" onClick={() => handleDelete(m.id)}><Trash2 size={16} /></button>
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
              <h3 className="modal-title">{editItem ? 'Edit Musyrif' : 'Tambah Musyrif'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Jenis Kelamin</label>
                    <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telepon</label>
                    <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Divisi</label>
                  <input className="form-input" value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })} />
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
