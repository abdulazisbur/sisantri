import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const where: Record<string, unknown> = {}
  if (session.role === 'SANTRI') {
    const santri = await prisma.santri.findUnique({ where: { userId: session.id } })
    if (santri) where.santriId = santri.id
  }

  const skia = await prisma.sKIA.findMany({
    where,
    include: { santri: true },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(skia)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const skia = await prisma.sKIA.create({
    data: {
      ...data,
      issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
    },
  })
  return Response.json(skia, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const { id, ...rest } = data
  const skia = await prisma.sKIA.update({ where: { id }, data: rest })
  return Response.json(skia)
}
