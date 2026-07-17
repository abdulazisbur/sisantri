import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const musyrifId = request.nextUrl.searchParams.get('musyrifId') || ''
  const month = request.nextUrl.searchParams.get('month') || ''

  const where: Record<string, unknown> = {}
  if (musyrifId) where.musyrifId = musyrifId
  if (month) {
    const [year, m] = month.split('-').map(Number)
    where.date = {
      gte: new Date(year, m - 1, 1),
      lt: new Date(year, m, 1),
    }
  }

  if (session.role === 'MUSYRIF') {
    const musyrif = await prisma.musyrif.findUnique({ where: { userId: session.id } })
    if (musyrif) where.musyrifId = musyrif.id
  }

  const absensi = await prisma.absensi.findMany({
    where,
    include: { musyrif: true },
    orderBy: { date: 'desc' },
  })

  return Response.json(absensi)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const absensi = await prisma.absensi.create({ data: { ...data, date: new Date(data.date) } })
  return Response.json(absensi, { status: 201 })
}
