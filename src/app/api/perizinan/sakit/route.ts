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

  const perizinan = await prisma.perizinanSakit.findMany({
    where,
    include: { santri: true, musyrif: true },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(perizinan)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const perizinan = await prisma.perizinanSakit.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  })
  return Response.json(perizinan, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const { id, ...rest } = data
  const perizinan = await prisma.perizinanSakit.update({ where: { id }, data: rest })
  return Response.json(perizinan)
}
