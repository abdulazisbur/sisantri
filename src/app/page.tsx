'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Shield, UserCheck, Heart, Search, MapPin, Sparkles, KeyRound, Award } from 'lucide-react'

export default function LandingLoginPage() {
  const router = useRouter()
  const [loginMode, setLoginMode] = useState<'ADMIN' | 'WALI'>('ADMIN')
  const [email, setEmail] = useState('admin@alkaukab.sch.id')
  const [password, setPassword] = useState('admin123')
  const [nisInput, setNisInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login gagal. Periksa email dan password.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan koneksi server.')
    } finally {
      setLoading(false)
    }
  }

  async function handleWaliSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nisInput.trim()) {
      setError('Masukkan NIS (Nomor Induk Santri) atau Nama Santri')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nis: nisInput }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'NIS / Nama Santri tidak ditemukan.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan koneksi server.')
    } finally {
      setLoading(false)
    }
  }

  const selectDemoAccount = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail)
    setPassword('admin123')
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: '520px',
        width: '100%',
        zIndex: 1,
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {/* Logo Al-Kaukab Emblem */}
          <div style={{
            width: '90px',
            height: '90px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(217, 119, 6, 0.4)',
            border: '4px solid rgba(255, 255, 255, 0.9)',
          }}>
            <BookOpen size={44} color="#064e3b" strokeWidth={2.5} />
          </div>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(251, 191, 36, 0.2)',
            color: '#fef3c7',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            marginBottom: '12px',
          }}>
            <Sparkles size={14} color="#fbbf24" /> SISTEM INFORMASI SANTRI & PESANTREN
          </span>

          <h1 style={{
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            margin: '0 0 6px',
            lineHeight: 1.3,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            Pondok Pesantren Tahfizh Al-Kaukab
          </h1>
          <h2 style={{
            color: '#fde68a',
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 10px',
            letterSpacing: '1px',
          }}>
            BOJONG NANGKA GUNUNG PUTRI BOGOR
          </h2>

          <p style={{
            fontFamily: 'var(--font-arabic)',
            fontSize: '22px',
            color: '#d1fae5',
            margin: '0 0 10px',
            direction: 'rtl',
          }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            lineHeight: 1.4,
            maxWidth: '460px',
            margin: '0 auto',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '8px 14px',
            borderRadius: '8px',
          }}>
            <MapPin size={14} style={{ flexShrink: 0 }} color="#fbbf24" />
            Jl. Raya Bojong Nangka RT.21 RW.09 Bojong Nangka, Gunung Putri, Bogor 16963 Jawa Barat
          </p>
        </div>

        {/* Card Form */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          padding: '32px 28px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          {/* Toggle Role Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: '#f1f5f9',
            padding: '6px',
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            <button
              type="button"
              onClick={() => { setLoginMode('ADMIN'); setError('') }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: loginMode === 'ADMIN' ? '#064e3b' : 'transparent',
                color: loginMode === 'ADMIN' ? '#ffffff' : '#64748b',
                boxShadow: loginMode === 'ADMIN' ? '0 2px 8px rgba(6,78,59,0.3)' : 'none',
              }}
            >
              <Shield size={16} /> Admin / Musyrif
            </button>

            <button
              type="button"
              onClick={() => { setLoginMode('WALI'); setError('') }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: loginMode === 'WALI' ? '#d97706' : 'transparent',
                color: loginMode === 'WALI' ? '#ffffff' : '#64748b',
                boxShadow: loginMode === 'WALI' ? '0 2px 8px rgba(217,119,6,0.3)' : 'none',
              }}
            >
              <Heart size={16} /> Wali Santri (NIS)
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* MODE 1: ADMIN & MUSYRIF LOGIN */}
          {loginMode === 'ADMIN' && (
            <form onSubmit={handleAdminSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Email Pengurus / Musyrif
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alkaukab.sch.id"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(6,78,59,0.3)',
                }}
              >
                {loading ? 'Memproses Masuk...' : 'Masuk Portal Admin'}
              </button>

              {/* Demo Account Shortcuts */}
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Pilih Akses Cepat (Demo):
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => selectDemoAccount('admin@alkaukab.sch.id', 'Admin Utama')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#064e3b',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    👑 Admin Utama
                  </button>

                  <button
                    type="button"
                    onClick={() => selectDemoAccount('kepala.banin@alkaukab.sch.id', 'Kepala Banin')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1e40af',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    🕌 Kepala Banin
                  </button>

                  <button
                    type="button"
                    onClick={() => selectDemoAccount('kepala.banat@alkaukab.sch.id', 'Kepala Banat')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#fdf2f8',
                      border: '1px solid #fbcfe8',
                      color: '#9d174d',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    🌸 Kepala Banat
                  </button>

                  <button
                    type="button"
                    onClick={() => selectDemoAccount('musyrifah.annur2@alkaukab.sch.id', 'Musyrifah An-Nur 2')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      color: '#b45309',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    🏢 Musyrifah An Nur 02
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* MODE 2: WALI SANTRI LOGIN VIA NIS */}
          {loginMode === 'WALI' && (
            <form onSubmit={handleWaliSubmit}>
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#92400e',
                marginBottom: '18px',
                lineHeight: 1.5,
              }}>
                ℹ️ <strong>Informasi Wali Santri:</strong> Masukkan <strong>NIS (Nomor Induk Santri)</strong> atau <strong>Nama Santri</strong> untuk langsung memantau Raport, Point Akhlak 8 Indikator, Absensi, dan Perizinan anak Anda.
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Nomor Induk Santri (NIS) / Nama Santri
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={nisInput}
                    onChange={(e) => setNisInput(e.target.value)}
                    placeholder="Contoh: S2026005 atau Aisyah Az-Zahra"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
                }}
              >
                {loading ? 'Mencari Data Santri...' : 'Lihat Data Anak Saya'}
              </button>

              {/* Sample NIS Quick Buttons */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                  Contoh NIS Santri Siap Akses:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['S2026005 (Aisyah Az-Zahra)', 'S2026001 (Ahmad Raihan)', 'S2026006 (Fatimah)'].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setNisInput(sample.split(' ')[0])}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        fontSize: '11px',
                        color: '#334155',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '12px',
          marginTop: '20px',
        }}>
          © 2026 Pondok Pesantren Tahfizh Al-Kaukab Bojong Nangka | All Rights Reserved
        </p>
      </div>
    </div>
  )
}
