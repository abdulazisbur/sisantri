import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateMusyrifExport, generateMusyrifTemplate } from '@/lib/excel'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const type = request.nextUrl.searchParams.get('type')

  if (type === 'template') {
    const buffer = generateMusyrifTemplate()
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Template_Import_Musyrif_AlKaukab.xlsx"',
      },
    })
  }

  const musyrifList = await prisma.musyrif.findMany({
    include: { _count: { select: { santriList: true } } },
    orderBy: { name: 'asc' },
  })

  const buffer = generateMusyrifExport(musyrifList)
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Export_Data_Musyrif_AlKaukab.xlsx"',
    },
  })
}
