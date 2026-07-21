import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateSantriExport, generateSantriTemplate } from '@/lib/excel'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const type = request.nextUrl.searchParams.get('type')

  if (type === 'template') {
    const buffer = generateSantriTemplate()
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Template_Import_Santri_AlKaukab.xlsx"',
      },
    })
  }

  const santriList = await prisma.santri.findMany({
    include: { musyrif: true },
    orderBy: { name: 'asc' },
  })

  const buffer = generateSantriExport(santriList)
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Export_Data_Santri_AlKaukab.xlsx"',
    },
  })
}
