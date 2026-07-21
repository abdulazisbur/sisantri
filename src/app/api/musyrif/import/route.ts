import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { parseMusyrifExcel } from '@/lib/excel'
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
    const rows = parseMusyrifExcel(buffer)

    if (!rows || rows.length === 0) {
      return Response.json({ error: 'File Excel kosong atau format tidak sesuai' }, { status: 400 })
    }

    let successCount = 0
    let skipCount = 0

    for (const row of rows) {
      const name = String(row.Nama || '').trim()

      if (!name) {
        skipCount++
        continue
      }

      const gender = (row['Jenis Kelamin (L/P)'] || 'L').toString().toUpperCase().includes('P') ? 'P' : 'L'
      const phone = row.Telepon ? String(row.Telepon).trim() : null
      const division = row.Divisi ? String(row.Divisi).trim() : null
      const room = row.Kamar ? String(row.Kamar).trim() : null

      const existing = await prisma.musyrif.findFirst({ where: { name } })

      if (existing) {
        await prisma.musyrif.update({
          where: { id: existing.id },
          data: { gender, phone, division, room },
        })
      } else {
        await prisma.musyrif.create({
          data: { name, gender, phone, division, room },
        })
      }
      successCount++
    }

    return Response.json({
      success: true,
      message: `Berhasil memproses ${successCount} data musyrif/ah (${skipCount} dilewati).`,
      count: successCount,
    })
  } catch (error) {
    console.error('Import Musyrif Error:', error)
    return Response.json({ error: 'Gagal mengimpor file Excel' }, { status: 500 })
  }
}
