import * as XLSX from 'xlsx'

export interface SantriExcelRow {
  NIS?: string | number
  Nama?: string
  'Jenis Kelamin (L/P)'?: string
  Kamar?: string
  Kelas?: string
  'Nama Orang Tua'?: string
  'HP Orang Tua'?: string | number
  Alamat?: string
  'Tahun Masuk'?: string | number
}

export interface MusyrifExcelRow {
  Nama?: string
  'Jenis Kelamin (L/P)'?: string
  Telepon?: string | number
  Divisi?: string
  Kamar?: string
}

/**
 * Generate Excel Template for Santri Data Entry
 */
export function generateSantriTemplate(): Buffer {
  const sampleData: SantriExcelRow[] = [
    {
      NIS: 'S2026001',
      Nama: 'Ahmad Raihan',
      'Jenis Kelamin (L/P)': 'L',
      Kamar: 'Al Fajr 1',
      Kelas: '7A',
      'Nama Orang Tua': 'H. Abdullah',
      'HP Orang Tua': '081234567890',
      Alamat: 'Bojong Nangka, Gunung Putri, Bogor',
      'Tahun Masuk': '2026',
    },
    {
      NIS: 'S2026002',
      Nama: 'Aisyah Az-Zahra',
      'Jenis Kelamin (L/P)': 'P',
      Kamar: 'An Nur 02',
      Kelas: '8B',
      'Nama Orang Tua': 'Drs. Ridwan',
      'HP Orang Tua': '081987654321',
      Alamat: 'Cibinong, Bogor',
      'Tahun Masuk': '2025',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(sampleData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Santri')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Generate Excel Export for Existing Santri Data
 */
export function generateSantriExport(santriList: Array<{
  nis: string
  name: string
  gender: string
  room: string
  class: string
  parentName: string
  parentPhone: string
  address?: string | null
  entryYear: string
  status: string
  musyrif?: { name: string } | null
}>): Buffer {
  const rows = santriList.map((s) => ({
    NIS: s.nis,
    Nama: s.name,
    'Jenis Kelamin': s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    Kamar: s.room,
    Kelas: s.class,
    'Musyrif/ah': s.musyrif?.name || '-',
    'Nama Orang Tua': s.parentName,
    'HP Orang Tua': s.parentPhone,
    Alamat: s.address || '-',
    'Tahun Masuk': s.entryYear,
    Status: s.status,
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Santri')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Parse uploaded Excel file buffer into Santri objects
 */
export function parseSantriExcel(buffer: Buffer): SantriExcelRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json<SantriExcelRow>(worksheet)
  return data
}

/**
 * Generate Excel Template for Musyrif Data Entry
 */
export function generateMusyrifTemplate(): Buffer {
  const sampleData: MusyrifExcelRow[] = [
    {
      Nama: 'Ustadz M. Rafli Apriliyan, Al Hafidz',
      'Jenis Kelamin (L/P)': 'L',
      Telepon: '081211112222',
      Divisi: 'Pengasuhan Asrama Al Fajr',
      Kamar: 'Al Fajr 1',
    },
    {
      Nama: 'Ustadzah Afi Basyiroh, Al Hafidzah',
      'Jenis Kelamin (L/P)': 'P',
      Telepon: '081233334444',
      Divisi: 'Pengasuhan Asrama An Nur',
      Kamar: 'An Nur 02',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(sampleData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Musyrif')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Generate Excel Export for Existing Musyrif Data
 */
export function generateMusyrifExport(musyrifList: Array<{
  name: string
  gender: string
  phone?: string | null
  division?: string | null
  room?: string | null
  _count?: { santriList: number }
}>): Buffer {
  const rows = musyrifList.map((m) => ({
    Nama: m.name,
    'Jenis Kelamin': m.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    Telepon: m.phone || '-',
    Divisi: m.division || '-',
    Kamar: m.room || '-',
    'Jumlah Santri Binaan': m._count?.santriList || 0,
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Musyrif')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Parse uploaded Excel file buffer into Musyrif objects
 */
export function parseMusyrifExcel(buffer: Buffer): MusyrifExcelRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json<MusyrifExcelRow>(worksheet)
  return data
}
