'use client'

import { useState, useEffect, useCallback } from 'react'
import { Network, UserCheck, Shield, BookOpen, Award, Building, Sparkles, Plus, Edit, Trash2, X } from 'lucide-react'

interface StrukturItem {
  id?: string
  name: string
  position: string
  period: string
  order: number
}

export default function StrukturOrganisasiPage() {
  const [activeTab, setActiveTab] = useState<'IDARAH' | 'BANIN' | 'BANAT'>('IDARAH')
  const [customList, setCustomList] = useState<StrukturItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<StrukturItem | null>(null)
  const [form, setForm] = useState({ name: '', position: '', period: '2026/2027', order: 1 })

  const fetchStruktur = useCallback(async () => {
    try {
      const res = await fetch('/api/struktur')
      if (res.ok) {
        const data = await res.json()
        setCustomList(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error('Error fetching struktur:', e)
    }
  }, [])

  useEffect(() => {
    fetchStruktur()
  }, [fetchStruktur])

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', position: '', period: '2026/2027', order: customList.length + 1 })
    setShowModal(true)
  }

  function openEdit(item: StrukturItem) {
    setEditItem(item)
    setForm({ name: item.name, position: item.position, period: item.period, order: item.order })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editItem?.id) {
      await fetch('/api/struktur', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editItem.id, ...form }),
      })
    } else {
      await fetch('/api/struktur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setShowModal(false)
    fetchStruktur()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus pengurus ini?')) return
    await fetch('/api/struktur', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchStruktur()
  }

  const mudirah = {
    name: 'Ibu Nyai Hj. Endang Riska Yani, S.Pd.I.',
    title: 'Mudirah / Pengasuh Pesantren',
  }

  const baninStructure = [
    { title: 'Kepala Pesantren Banin', name: 'Ustadz Asrarun Najib, S.Pd.', icon: '👑', badge: 'Pimpinan Banin' },
    { title: 'Waka. Kesantrian (Ketertiban & Osaka)', name: 'Ustadz Angga Hermawan, S.Ag., Al Hafidz', icon: '🛡️', badge: 'Kesantrian' },
    { title: 'Waka. Kurikulum (Ubudiyyah, Pendidikan, Bahasa)', name: 'Ustadz Haikal Rifai, Lc.', icon: '📖', badge: 'Kurikulum' },
    { title: 'Waka. Kebersihan, Kesehatan, & Sarpras (K2S)', name: 'Ustadz Sholahudin, S.E.', icon: '🏥', badge: 'K2S' },
    { title: 'TU Pesantren', name: 'Ustadzah Sarah Julianti', icon: '📝', badge: 'Administrasi' },
  ]

  const banatStructure = [
    { title: 'Kepala Pesantren Banat', name: 'Ustadzah Siti Wahyuni, S. Ag., Al Hafidzah', icon: '👑', badge: 'Pimpinan Banat' },
    { title: 'Waka. Kesantrian (Ketertiban & OSAKA)', name: 'Ustadzah Nidatul Azizah, Al Hafidzah', icon: '🛡️', badge: 'Kesantrian' },
    { title: 'Waka. Kurikulum (Ubudiyyah, Pendidikan, Bahasa)', name: 'Ustadzah Alda Nur Alfi Lail, S.Ag Al Hafizah', icon: '📖', badge: 'Kurikulum' },
    { title: 'Waka. Kebersihan, Kesehatan, & Sarpras (K2S)', name: 'Ustadzah Lutpiana Ulpah', icon: '🏥', badge: 'K2S' },
    { title: 'TU Pesantren', name: 'Ustadzah Sarah Julianti', icon: '📝', badge: 'Administrasi' },
  ]

  const musyrifBaninList = [
    { no: 1, name: 'Ustadz M. Rafli Apriliyan, Al Hafidz', room: 'Musyrif Al Fajr 1' },
    { no: 2, name: 'Ustadz Maulana Rohman, Al Hafidz', room: 'Musyrif Al Fajr 2' },
    { no: 3, name: 'Ustadz Sholahudin, S.E.', room: 'Musyrif Al Misbah 1' },
    { no: 4, name: 'Ustadz Haikal Rifai, Lc.', room: 'Musyrif Al Misbah 2' },
    { no: 5, name: 'Ustadz Angga Hermawan, S.Ag., Al Hafidz', room: 'Musyrif Al Qomar 1 & 2' },
    { no: 6, name: 'Ustadz Muhammad Yusuf Al Hafizh', room: 'Musyrif Asy Syams 1' },
    { no: 7, name: 'Ustadz Andika Wildan Gunaeba, S.Pd.', room: 'Musyrif Asy Syams 2' },
    { no: 8, name: 'Ustadz Muhammad Fadeil', room: 'Musyrif Asy Syams 3' },
    { no: 9, name: 'Ustadz Muh. Iqbal, S.H.', room: 'Musyrif Al A’la 1 & 2' },
  ]

  const musyrifahBanatList = [
    { no: 1, name: 'Ustadzah Rif`atuzzulfa, Al Hafidzah', room: 'Musyrifah An Najm 1' },
    { no: 2, name: 'Ustadzah Zahrotul Fitriyah, Al Hafidzah', room: 'Musyrifah An Najm 2' },
    { no: 3, name: 'Ustadzah Reri Yullian Putri, S.Pd.', room: 'Musyrifah An Najm 3' },
    { no: 4, name: 'Ustadzah Afi Basyiroh, S.Pd., Al Hafidzah', room: 'Musyrifah An Nur 2' },
    { no: 5, name: 'Ustadzah Hamida A\'la Zama', room: 'Musyrifah An Nur 3' },
    { no: 6, name: 'Ustadzah Eldis Pravita Syukrila', room: 'Musyrifah An Nur 4' },
    { no: 7, name: 'Ustadzah Zahrotul Aini, Al Hafidzah', room: 'Musyrifah An Nur 5' },
    { no: 8, name: 'Ustadzah Melani Putri, Al Hafidzah', room: 'Musyrifah An Nur 6' },
  ]

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        borderRadius: '16px',
        padding: '28px 24px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: '0 10px 20px rgba(6,78,59,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Network size={28} color="#fde68a" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', background: 'rgba(251,191,36,0.2)', padding: '4px 10px', borderRadius: '6px', color: '#fef3c7' }}>
            TAHUN AJARAN 2026/2027
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '0.5px' }}>
          Struktur Organisasi & Personalia Idarah 1 Pesantren
        </h1>
        <p style={{ fontSize: '14px', color: '#d1fae5', margin: 0, opacity: 0.9 }}>
          Pendidikan Non Formal & Kemusyrifan — Pondok Pesantren Tahfizh Al-Kaukab Bojong Nangka
        </p>
      </div>

      {/* Mudirah Top Card */}
      <div style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        border: '2px solid #fcd34d',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '32px',
        boxShadow: '0 4px 12px rgba(245,158,11,0.1)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#d97706',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          fontSize: '24px',
          fontWeight: 700,
          boxShadow: '0 4px 10px rgba(217,119,6,0.3)',
        }}>
          👑
        </div>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
          {mudirah.title}
        </h3>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#78350f', margin: 0 }}>
          {mudirah.name}
        </h2>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('IDARAH')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'IDARAH' ? '#064e3b' : '#f1f5f9',
            color: activeTab === 'IDARAH' ? '#ffffff' : '#64748b',
          }}
        >
          🏛️ Overview Struktur Idarah
        </button>

        <button
          onClick={() => setActiveTab('BANIN')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'BANIN' ? '#1e40af' : '#f1f5f9',
            color: activeTab === 'BANIN' ? '#ffffff' : '#64748b',
          }}
        >
          🕌 Pesantren Banin & Musyrif (9)
        </button>

        <button
          onClick={() => setActiveTab('BANAT')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'BANAT' ? '#9d174d' : '#f1f5f9',
            color: activeTab === 'BANAT' ? '#ffffff' : '#64748b',
          }}
        >
          🌸 Pesantren Banat & Musyrifah (8)
        </button>
      </div>

      {/* TAB 1: OVERVIEW IDARAH */}
      {(activeTab === 'IDARAH' || activeTab === 'BANIN') && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🕌 PESANTREN BANIN (TA 2026/2027)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {baninStructure.map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#1e40af', padding: '3px 8px', borderRadius: '6px' }}>
                    {item.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          {/* Kemusyrifan Banin List */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#1e40af" /> Kemusyrifan Asrama Banin (9 Ustadz)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
              {musyrifBaninList.map((m) => (
                <div key={m.no} style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#1e40af',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}>
                    {m.no}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>{m.room}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{m.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BANAT SECTION */}
      {(activeTab === 'IDARAH' || activeTab === 'BANAT') && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#9d174d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌸 PESANTREN BANAT (TA 2026/2027)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {banatStructure.map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1.5px solid #fbcfe8',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#fdf2f8', color: '#9d174d', padding: '3px 8px', borderRadius: '6px' }}>
                    {item.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>

          {/* Kemusyrifan Banat List */}
          <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#831843', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#9d174d" /> Kemusyrifan Asrama Banat (8 Ustadzah)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
              {musyrifahBanatList.map((m) => (
                <div key={m.no} style={{
                  background: '#ffffff',
                  border: '1px solid #f472b6',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#9d174d',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}>
                    {m.no}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#db2777' }}>{m.room}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{m.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC CUSTOM PENGURUS DB SECTION */}
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px stroke var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#d97706" /> Personalia &amp; Pengurus Tambahan (Database Input)
          </h2>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Tambah Pengurus
          </button>
        </div>

        {customList.length === 0 ? (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Belum ada pengurus tambahan yang diinput. Klik tombol &quot;Tambah Pengurus&quot; untuk menambahkan data secara dinamis.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {customList.map((item) => (
              <div key={item.id} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {item.position}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px' }}>{item.name}</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Periode: {item.period}</div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button className="table-action-btn" onClick={() => openEdit(item)} title="Edit"><Edit size={14} /></button>
                  <button className="table-action-btn danger" onClick={() => item.id && handleDelete(item.id)} title="Hapus"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editItem ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap &amp; Gelar</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Ustadz Ahmad, M.Pd." required />
                </div>
                <div className="form-group">
                  <label className="form-label">Jabatan / Posisi</label>
                  <input className="form-input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Contoh: Koordinator Ubudiyyah Banin" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Periode</label>
                    <input className="form-input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Urutan</label>
                    <input className="form-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} required />
                  </div>
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
