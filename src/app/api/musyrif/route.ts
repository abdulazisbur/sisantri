import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const musyrif = await prisma.musyrif.findMany({
    include: { _count: { select: { santriList: true } } },
    orderBy: { name: 'asc' },
  })

  return Response.json(musyrif)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const musyrif = await prisma.musyrif.create({ data })
  return Response.json(musyrif, { status: 201 })
}
