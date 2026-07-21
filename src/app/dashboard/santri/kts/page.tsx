'use client'

import { useState, useEffect, useCallback } from 'react'
import { CreditCard, Printer, Search, ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Santri {
  id: string
  nis: string
  name: string
  gender: string
  room: string
  class: string
  parentName: string
  parentPhone: string
  entryYear: string
}

export default function KTSDigitalPage() {
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/santri?search=${search}`)
      if (res.ok) {
        const data = await res.json()
        setSantriList(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching santri for KTS:', err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function handlePrint() {
    window.print()
  }

  return (
    <div>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #kts-printable-area, #kts-printable-area * {
            visibility: visible;
          }
          #kts-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 10px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <Link href="/dashboard/santri" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none', marginBottom: '8px' }}>
            <ArrowLeft size={16} /> Kembali ke Data Santri
          </Link>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CreditCard size={24} /> Generator KTS Digital (Kartu Tanda Santri)
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} /> Cetak / Download KTS Digital
          </button>
        </div>
      </div>

      <div className="no-print toolbar" style={{ marginBottom: '24px' }}>
        <div className="toolbar-left">
          <div className="search-input">
            <Search className="search-icon" />
            <input
              placeholder="Cari nama atau NIS santri untuk kartu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="loading-spinner" /></div>
      ) : santriList.length === 0 ? (
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <h3>Belum ada data santri untuk cetak KTS</h3>
        </div>
      ) : (
        <div id="kts-printable-area" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {santriList.map((s) => (
            <div
              key={s.id}
              style={{
                width: '100%',
                maxWidth: '360px',
                height: '220px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #0f766e 100%)',
                color: '#ffffff',
                padding: '16px',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(6,78,59,0.3)',
                border: '2px solid #fbbf24',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pageBreakInside: 'avoid',
              }}
            >
              {/* Card Watermark Background */}
              <div style={{
                position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08, pointerEvents: 'none',
              }}>
                <Image src="/logo-alkaukab.jpg" alt="Watermark" width={180} height={180} />
              </div>

              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(251,191,36,0.3)', paddingBottom: '8px' }}>
                <Image src="/logo-alkaukab.jpg" alt="Logo" width={38} height={38} style={{ borderRadius: '6px' }} />
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, margin: 0, letterSpacing: '0.5px', color: '#fbbf24' }}>
                    PESANTREN TAHFIZH AL-KAUKAB
                  </h4>
                  <p style={{ fontSize: '9px', margin: 0, opacity: 0.9, color: '#fef3c7' }}>
                    KARTU TANDA SANTRI (KTS) DIGITAL
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', margin: '10px 0' }}>
                {/* Photo Placeholder */}
                <div style={{
                  width: '64px',
                  height: '78px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '2px solid #fbbf24',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#064e3b',
                  fontSize: '9px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  <ShieldCheck size={28} color="#064e3b" />
                  <span style={{ marginTop: '2px' }}>PASS FOTO</span>
                </div>

                {/* Details */}
                <div style={{ fontSize: '11px', lineHeight: 1.4, flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                    {s.name}
                  </div>
                  <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>NIS:</span> {s.nis}</div>
                  <div><span style={{ color: '#d1fae5' }}>Kelas/Kamar:</span> {s.class} / {s.room}</div>
                  <div><span style={{ color: '#d1fae5' }}>Orang Tua:</span> {s.parentName}</div>
                  <div><span style={{ color: '#d1fae5' }}>Masuk:</span> {s.entryYear}</div>
                </div>
              </div>

              {/* Card Footer & Fake QR Barcode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '6px' }}>
                <div style={{ fontSize: '8px', color: '#fde68a', fontWeight: 600 }}>
                  Bojong Nangka, Gunung Putri, Bogor
                </div>
                {/* Simulated QR Code Box */}
                <div style={{
                  background: 'white',
                  padding: '3px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}>
                  <div style={{ width: '22px', height: '22px', background: '#000', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '6px', fontWeight: 900 }}>
                    QR
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
