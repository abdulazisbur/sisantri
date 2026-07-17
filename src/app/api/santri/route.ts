import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const search = request.nextUrl.searchParams.get('search') || ''
  const status = request.nextUrl.searchParams.get('status') || ''

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { nis: { contains: search } },
    ]
  }
  if (status) where.status = status

  // If musyrif, only show their santri
  if (session.role === 'MUSYRIF') {
    const musyrif = await prisma.musyrif.findUnique({ where: { userId: session.id } })
    if (musyrif) where.musyrifId = musyrif.id
  }

  const santri = await prisma.santri.findMany({
    where,
    include: { musyrif: true },
    orderBy: { name: 'asc' },
  })

  return Response.json(santri)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const santri = await prisma.santri.create({ data })
  return Response.json(santri, { status: 201 })
}
