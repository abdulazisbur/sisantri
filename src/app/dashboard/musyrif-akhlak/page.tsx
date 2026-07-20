'use client'

import { useState } from 'react'
import {
  Building,
  UserCheck,
  Award,
  AlertTriangle,
  PlusCircle,
  Calendar,
  CheckCircle,
  Filter,
  Users,
  Sparkles,
} from 'lucide-react'

export default function DashboardMusyrifAkhlakPage() {
  const [selectedRoom, setSelectedRoom] = useState<string>('An Nur 02')
  const [dateInput, setDateInput] = useState<string>('2026-07-20')
  const [selectedSantriId, setSelectedSantriId] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('SHALAT_BERJAMAAH')
  const [pointValue, setPointValue] = useState<number>(-5)
  const [noteInput, setNoteInput] = useState<string>('')
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false)

  // Rooms List (Banat & Banin)
  const roomList = [
    { label: '🌸 Musyrifah An Nur 02', value: 'An Nur 02', musyrifah: 'Ustadzah Afi Basyiroh, S.Pd., Al Hafidzah' },
    { label: '🌸 Musyrifah An Najm 1', value: 'An Najm 1', musyrifah: 'Ustadzah Rif`atuzzulfa, Al Hafidzah' },
    { label: '🌸 Musyrifah An Najm 2', value: 'An Najm 2', musyrifah: 'Ustadzah Zahrotul Fitriyah, Al Hafidzah' },
    { label: '🌸 Musyrifah An Najm 3', value: 'An Najm 3', musyrifah: 'Ustadzah Reri Yullian Putri, S.Pd.' },
    { label: '🌸 Musyrifah An Nur 3', value: 'An Nur 3', musyrifah: 'Ustadzah Hamida A\'la Zama' },
    { label: '🌸 Musyrifah An Nur 4', value: 'An Nur 4', musyrifah: 'Ustadzah Eldis Pravita Syukrila' },
    { label: '🌸 Musyrifah An Nur 5', value: 'An Nur 5', musyrifah: 'Ustadzah Zahrotul Aini, Al Hafidzah' },
    { label: '🌸 Musyrifah An Nur 6', value: 'An Nur 6', musyrifah: 'Ustadzah Melani Putri, Al Hafidzah' },

    { label: '🕌 Musyrif Al Fajr 1', value: 'Al Fajr 1', musyrifah: 'Ustadz M. Rafli Apriliyan, Al Hafidz' },
    { label: '🕌 Musyrif Al Fajr 2', value: 'Al Fajr 2', musyrifah: 'Ustadz Maulana Rohman, Al Hafidz' },
    { label: '🕌 Musyrif Al Misbah 1', value: 'Al Misbah 1', musyrifah: 'Ustadz Sholahudin, S.E.' },
    { label: '🕌 Musyrif Al Misbah 2', value: 'Al Misbah 2', musyrifah: 'Ustadz Haikal Rifai, Lc.' },
    { label: '🕌 Musyrif Al Qomar 1 & 2', value: 'Al Qomar 1 & 2', musyrifah: 'Ustadz Angga Hermawan, S.Ag.' },
    { label: '🕌 Musyrif Asy Syams 1', value: 'Asy Syams 1', musyrifah: 'Ustadz Muhammad Yusuf Al Hafizh' },
    { label: '🕌 Musyrif Asy Syams 2', value: 'Asy Syams 2', musyrifah: 'Ustadz Andika Wildan Gunaeba' },
    { label: '🕌 Musyrif Asy Syams 3', value: 'Asy Syams 3', musyrifah: 'Ustadz Muhammad Fadeil' },
    { label: '🕌 Musyrif Al A’la 1 & 2', value: 'Al A’la 1 & 2', musyrifah: 'Ustadz Muh. Iqbal, S.H.' },
  ]

  // Santri List per Room
  const santriListMock = [
    { id: '1', nis: 'S2026005', name: 'Aisyah Az-Zahra', room: 'An Nur 02', currentPoints: 95 },
    { id: '2', nis: 'S2026006', name: 'Fatimah Nur Nabila', room: 'An Nur 02', currentPoints: 100 },
    { id: '3', nis: 'S2026007', name: 'Salma Khairunnisa', room: 'An Najm 1', currentPoints: 90 },
    { id: '4', nis: 'S2026008', name: 'Naylah Putri Syafiqah', room: 'An Nur 3', currentPoints: 95 },
    { id: '5', nis: 'S2026001', name: 'Ahmad Raihan', room: 'Al Fajr 1', currentPoints: 95 },
    { id: '6', nis: 'S2026002', name: 'Faqih Al-Habsyi', room: 'Al Fajr 2', currentPoints: 100 },
  ]

  const currentRoomInfo = roomList.find((r) => r.value === selectedRoom)
  const roomSantriList = santriListMock.filter((s) => s.room === selectedRoom || selectedRoom === 'ALL')

  // 8 Specific Indicators required by prompt
  const akhlakIndicators = [
    { id: 'SHALAT_BERJAMAAH', title: '1. Shalat Berjamaah', desc: 'Kedisiplinan mengikuti shalat fardhu tepat waktu di masjid/musholla' },
    { id: 'AMALAN_SUNNAH', title: '2. Amalan Sunnah', desc: 'Pelaksanaan shalat dhuha, tahajud, dan puasa sunnah' },
    { id: 'HORMAT_GURU', title: '3. Hormat Kepada Guru', desc: 'Sikap tawadhu, takzim, dan sopan kepada Asatidzah & Pengurus' },
    { id: 'BERTUTUR_KATA_BAIK', title: '4. Bertutur Kata Baik', desc: 'Menjaga lisan dari perkataan kotor, gibah, atau bentakan' },
    { id: 'PRIYANTUN', title: '5. Priyantun (Tata Krama / Adab)', desc: 'Kesantunan perilaku, adab makan/minum, dan etika berbusana' },
    { id: 'PEDULI_SOSIAL', title: '6. Peduli Sosial', desc: 'Kepedulian membantu sesama santri dan kepekaan lingkungan' },
    { id: 'BERTEMAN', title: '7. Berteman (Ukhuwah Islamiyah)', desc: 'Menjaga keharmonisan sesama santri tanpa perundungan (bullying)' },
    { id: 'MENJAGA_FASILITAS', title: '8. Menjaga Fasilitas Pesantren', desc: 'Kebersihan dan keutuhan sarana asrama, kelas & inventaris' },
  ]

  // Recent Log History
  const [logHistory, setLogHistory] = useState([
    {
      id: 'l1',
      date: '2026-07-20',
      santriName: 'Aisyah Az-Zahra',
      room: 'An Nur 02',
      musyrifah: 'Ustadzah Afi Basyiroh, S.Pd.',
      categoryTitle: '4. Bertutur Kata Baik',
      points: -5,
      notes: 'Pembinaan agar bertutur kata lebih santun saat piket',
    },
    {
      id: 'l2',
      date: '2026-07-19',
      santriName: 'Fatimah Nur Nabila',
      room: 'An Nur 02',
      musyrifah: 'Ustadzah Afi Basyiroh, S.Pd.',
      categoryTitle: '2. Amalan Sunnah',
      points: +5,
      notes: 'Apresiasi istiqamah shalat Dhuha & Dzikir Pagi',
    },
  ])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSantriId) {
      alert('Silakan pilih nama santri terlebih dahulu.')
      return
    }

    const santriObj = santriListMock.find((s) => s.id === selectedSantriId)
    const categoryObj = akhlakIndicators.find((c) => c.id === selectedCategory)

    const newLog = {
      id: String(Date.now()),
      date: dateInput,
      santriName: santriObj?.name || 'Santri',
      room: selectedRoom,
      musyrifah: currentRoomInfo?.musyrifah || 'Musyrif/ah',
      categoryTitle: categoryObj?.title || 'Akhlak',
      points: pointValue,
      notes: noteInput || 'Catatan perkembangan akhlak',
    }

    setLogHistory([newLog, ...logHistory])
    setShowSuccessAlert(true)
    setNoteInput('')
    setTimeout(() => setShowSuccessAlert(false), 4000)
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Building size={28} color="#fde68a" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', background: 'rgba(251,191,36,0.2)', padding: '4px 10px', borderRadius: '6px', color: '#fef3c7' }}>
            DASHBOARD KEMUSYRIFAN ASRAMA BANIN & BANAT
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>
          Pencatatan & Evaluasi Point Akhlak Santri (8 Indikator)
        </h1>
        <p style={{ fontSize: '14px', color: '#d1fae5', margin: 0 }}>
          Pondok Pesantren Tahfizh Al-Kaukab Bojong Nangka — TA 2026/2027
        </p>
      </div>

      {/* Room Selector Dropdown */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #064e3b',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 4px 12px rgba(6,78,59,0.06)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              🏢 Pilih Asrama / Kamar Musyrif/ah:
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 700,
                color: '#064e3b',
                background: '#f8fafc',
                outline: 'none',
              }}
            >
              {roomList.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 18px', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', marginBottom: '2px' }}>
              Musyrif / Musyrifah Penanggung Jawab:
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#047857' }}>
              👤 {currentRoomInfo?.musyrifah}
            </div>
          </div>
        </div>
      </div>

      {showSuccessAlert && (
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          color: '#065f46',
          padding: '14px 18px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <CheckCircle size={20} color="#059669" /> Data perolehan / pengurangan point akhlak santri berhasil dicatat ke dalam database!
        </div>
      )}

      {/* Main Grid: Form & 8 Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Form Entry */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#064e3b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#064e3b" /> Form Input Point Akhlak Santri
          </h3>

          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Hari / Tanggal / Tahun
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Pilih Nama Santri ({selectedRoom})
              </label>
              <select
                value={selectedSantriId}
                onChange={(e) => setSelectedSantriId(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="">-- Pilih Santri --</option>
                {roomSantriList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nis} - {s.name} (Poin Saat Ini: {s.currentPoints})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Kategori 8 Indikator Akhlak
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
              >
                {akhlakIndicators.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Nilai Poin (Bonus / Pengurangan Pelanggaran)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPointValue(-5)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: pointValue < 0 ? '#fef2f2' : '#f1f5f9',
                    color: pointValue < 0 ? '#dc2626' : '#64748b',
                    outline: pointValue < 0 ? '2px solid #ef4444' : 'none',
                  }}
                >
                  🔻 Pengurangan (-5 Poin)
                </button>

                <button
                  type="button"
                  onClick={() => setPointValue(+5)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: pointValue > 0 ? '#ecfdf5' : '#f1f5f9',
                    color: pointValue > 0 ? '#059669' : '#64748b',
                    outline: pointValue > 0 ? '2px solid #10b981' : 'none',
                  }}
                >
                  🟢 Apresiasi (+5 Poin)
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Catatan Pembinaan / Deskripsi Kejadian
              </label>
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Tuliskan detail pembinaan atau alasan pemberian poin..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#064e3b',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(6,78,59,0.2)',
              }}
            >
              Simpan Pencatatan Akhlak
            </button>
          </form>
        </div>

        {/* 8 Indicators Display Card */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#d97706" /> 8 Indikator Penilaian Akhlak Santri
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {akhlakIndicators.map((ind) => (
              <div key={ind.id} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#064e3b', marginBottom: '2px' }}>
                  {ind.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>
                  {ind.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log History Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            📋 Riwayat Catatan Point Akhlak Santri Asrama
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px' }}>Tanggal</th>
                <th style={{ padding: '12px 16px' }}>Nama Santri</th>
                <th style={{ padding: '12px 16px' }}>Asrama</th>
                <th style={{ padding: '12px 16px' }}>Musyrif / Musyrifah</th>
                <th style={{ padding: '12px 16px' }}>Indikator Akhlak</th>
                <th style={{ padding: '12px 16px' }}>Poin</th>
                <th style={{ padding: '12px 16px' }}>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {logHistory.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{item.date}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{item.santriName}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.room}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{item.musyrifah}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#064e3b' }}>{item.categoryTitle}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 800,
                      background: item.points < 0 ? '#fef2f2' : '#ecfdf5',
                      color: item.points < 0 ? '#dc2626' : '#059669',
                    }}>
                      {item.points > 0 ? `+${item.points}` : item.points}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
