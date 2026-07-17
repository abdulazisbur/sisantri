'use client'

import { useState, useEffect, useCallback } from 'react'
import { Layers, Plus, Trash2, X } from 'lucide-react'

interface DivisiAnggota {
  id: string
  role: string
  musyrif: { id: string; name: string; gender: string }
}

interface Divisi {
  id: string
  name: string
  description?: string
  anggota: DivisiAnggota[]
}

export default function DivisiPage() {
  const [divisiList, setDivisiList] = useState<Divisi[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/divisi')
    setDivisiList(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/divisi', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setShowModal(false)
    setForm({ name: '', description: '' })
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus divisi ini?')) return
    await fetch('/api/divisi', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Layers size={24} /> Divisi
      </h1>

      <div className="toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Tambah Divisi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="loading-spinner" /></div>
      ) : divisiList.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Layers size={28} /></div>
            <h3>Belum ada divisi</h3>
            <p>Buat divisi baru untuk mengorganisir musyrif/ah</p>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {divisiList.map((d) => (
            <div className="divisi-card" key={d.id}>
              <div className="divisi-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{d.name}</h3>
                    {d.description && <p>{d.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(d.id)}
                    style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '4px', color: 'white' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="divisi-card-body">
                {d.anggota.length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                    Belum ada anggota
                  </p>
                ) : (
                  d.anggota.map((a) => (
                    <div className="divisi-member" key={a.id}>
                      <div className="divisi-member-avatar">{a.musyrif.name.charAt(0)}</div>
                      <div className="divisi-member-info">
                        <h4>{a.musyrif.name}</h4>
                        <span>{a.role}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tambah Divisi</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Divisi</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Deskripsi</label>
                  <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: '60px' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Tambah</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
