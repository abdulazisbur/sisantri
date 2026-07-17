// Utility functions

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getGradeFromPoints(points: number): {
  grade: string
  label: string
  color: string
} {
  if (points >= 90)
    return { grade: 'MUMTAZ', label: 'Mumtaz (Istimewa)', color: '#10b981' }
  if (points >= 75)
    return {
      grade: 'JAYYID_JIDDAN',
      label: 'Jayyid Jiddan (Sangat Baik)',
      color: '#3b82f6',
    }
  if (points >= 60)
    return { grade: 'JAYYID', label: 'Jayyid (Baik)', color: '#eab308' }
  if (points >= 40)
    return { grade: 'MAQBUL', label: 'Maqbul (Cukup)', color: '#f97316' }
  return { grade: 'RASIB', label: 'Rasib (Kurang)', color: '#ef4444' }
}

export function getPointsByLevel(level: string): number {
  switch (level) {
    case 'RINGAN':
      return 5
    case 'SEDANG':
      return 15
    case 'BERAT':
      return 30
    case 'SANGAT_BERAT':
      return 50
    default:
      return 0
  }
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'RINGAN':
      return 'Ringan'
    case 'SEDANG':
      return 'Sedang'
    case 'BERAT':
      return 'Berat'
    case 'SANGAT_BERAT':
      return 'Sangat Berat'
    default:
      return level
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'IBADAH':
      return 'Ibadah'
    case 'AKHLAK':
      return 'Akhlak'
    case 'KETERTIBAN':
      return 'Ketertiban'
    case 'KEBERSIHAN':
      return 'Kebersihan'
    case 'AKADEMIK':
      return 'Akademik'
    default:
      return category
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Menunggu'
    case 'DISETUJUI':
      return 'Disetujui'
    case 'DITOLAK':
      return 'Ditolak'
    case 'HADIR':
      return 'Hadir'
    case 'IZIN':
      return 'Izin'
    case 'SAKIT':
      return 'Sakit'
    case 'ALPHA':
      return 'Alpha'
    default:
      return status
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'var(--status-warning)'
    case 'DISETUJUI':
    case 'HADIR':
      return 'var(--status-success)'
    case 'DITOLAK':
    case 'ALPHA':
      return 'var(--status-danger)'
    case 'IZIN':
    case 'SAKIT':
      return 'var(--status-info)'
    default:
      return 'var(--text-secondary)'
  }
}
