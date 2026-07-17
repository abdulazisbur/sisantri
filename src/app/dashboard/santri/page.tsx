'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Search, Edit, Trash2, X } from 'lucide-react'

interface Santri {
  id: string
  nis: string
  name: string
  gender: string
  room: string
  class: string
  parentName: string
  parentPhone: string
  address?: string
  entryYear: string
  status: string
  musyrifId?: string
  musyrif?: { id: string; name: string }
}

interface Musyrif {
  id: string
  name: string
}

export default function SantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [musyrifList, setMusyrifList] = useState<Musyrif[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Santri | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    nis: '', name: '', gender: 'L', room: '', class: '',
    parentName: '', parentPhone: '', address: '', entryYear: new Date().getFullYear().toString(),
    status: 'AKTIF', musyrifId: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [santriRes, musyrifRes] = await Promise.all([
      fetch(`/api/santri?search=${search}`),
      fetch('/api/musyrif'),
    ])
    setSantriList(await santriRes.json())
    setMusyrifList(await musyrifRes.json())
    setLoading(false)
  }, [search])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    setEditItem(null)
    setForm({
      nis: '', name: '', gender: 'L', room: '', class: '',
      parentName: '', parentPhone: '', address: '', entryYear: new Date().getFullYear().toString(),
      status: 'AKTIF', musyrifId: '',
    })
    setShowModal(true)
  }

  function openEdit(s: Santri) {
    setEditItem(s)
    setForm({
      nis: s.nis, name: s.name, gender: s.gender, room: s.room, class: s.class,
      parentName: s.parentName, parentPhone: s.parentPhone, address: s.address || '',
      entryYear: s.entryYear, status: s.status, musyrifId: s.musyrifId || '',
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = { ...form, musyrifId: form.musyrifId || null }
    if (editItem) {
      await fetch(`/api/santri/${editItem.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/santri', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
    }
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus data santri ini?')) return
    await fetch(`/api/santri/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Users size={24} /> Data Santri
      </h1>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input">
            <Search className="search-icon" />
            <input
              placeholder="Cari nama atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Tambah Santri
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner" /></div>
          ) : santriList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Users size={28} /></div>
              <h3>Belum ada data santri</h3>
              <p>Klik tombol &quot;Tambah Santri&quot; untuk menambahkan data</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>NIS</th>
                    <th>Nama</th>
                    <th>L/P</th>
                    <th>Kamar</th>
                    <th>Kelas</th>
                    <th>Musyrif</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {santriList.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.nis}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.gender}</td>
                      <td>{s.room}</td>
                      <td>{s.class}</td>
                      <td>{s.musyrif?.name || '-'}</td>
                      <td>
                        <span className={`badge ${s.status === 'AKTIF' ? 'badge-success' : 'badge-neutral'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="table-action-btn" onClick={() => openEdit(s)} title="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="table-action-btn danger" onClick={() => handleDelete(s.id)} title="Hapus">
                            <Trash2 size={16} />
                          </button>
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
              <h3 className="modal-title">{editItem ? 'Edit Santri' : 'Tambah Santri'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">NIS</label>
                    <input className="form-input" value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
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
                    <label className="form-label">Kamar</label>
                    <input className="form-input" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Kelas</label>
                    <input className="form-input" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tahun Masuk</label>
                    <input className="form-input" value={form.entryYear} onChange={(e) => setForm({ ...form, entryYear: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nama Orang Tua</label>
                    <input className="form-input" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telepon Orang Tua</label>
                    <input className="form-input" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Alamat</label>
                  <textarea className="form-textarea" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ minHeight: '60px' }} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Musyrif/ah</label>
                    <select className="form-select" value={form.musyrifId} onChange={(e) => setForm({ ...form, musyrifId: e.target.value })}>
                      <option value="">-- Pilih Musyrif --</option>
                      {musyrifList.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="AKTIF">Aktif</option>
                      <option value="NONAKTIF">Non-Aktif</option>
                      <option value="ALUMNI">Alumni</option>
                    </select>
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
