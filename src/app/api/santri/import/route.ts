import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { parseSantriExcel } from '@/lib/excel'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'File Excel tidak ditemukan' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const rows = parseSantriExcel(buffer)

    if (!rows || rows.length === 0) {
      return Response.json({ error: 'File Excel kosong atau format tidak sesuai' }, { status: 400 })
    }

    let successCount = 0
    let skipCount = 0

    for (const row of rows) {
      const nis = String(row.NIS || '').trim()
      const name = String(row.Nama || '').trim()

      if (!nis || !name) {
        skipCount++
        continue
      }

      const gender = (row['Jenis Kelamin (L/P)'] || 'L').toString().toUpperCase().includes('P') ? 'P' : 'L'
      const room = String(row.Kamar || 'Belum Ditentukan').trim()
      const className = String(row.Kelas || '7').trim()
      const parentName = String(row['Nama Orang Tua'] || '-').trim()
      const parentPhone = String(row['HP Orang Tua'] || '-').trim()
      const address = row.Alamat ? String(row.Alamat).trim() : null
      const entryYear = String(row['Tahun Masuk'] || new Date().getFullYear()).trim()

      await prisma.santri.upsert({
        where: { nis },
        update: {
          name,
          gender,
          room,
          class: className,
          parentName,
          parentPhone,
          address,
          entryYear,
        },
        create: {
          nis,
          name,
          gender,
          room,
          class: className,
          parentName,
          parentPhone,
          address,
          entryYear,
          status: 'AKTIF',
        },
      })
      successCount++
    }

    return Response.json({
      success: true,
      message: `Berhasil memproses ${successCount} data santri (${skipCount} dilewati).`,
      count: successCount,
    })
  } catch (error) {
    console.error('Import Santri Error:', error)
    return Response.json({ error: 'Gagal mengimpor file Excel' }, { status: 500 })
  }
}
