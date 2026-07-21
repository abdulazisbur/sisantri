import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const where: Record<string, unknown> = {}

  if (session.role === 'SANTRI') {
    const santri = await prisma.santri.findFirst({
      where: { OR: [{ id: session.id }, { userId: session.id }] },
    })
    if (santri) where.santriId = santri.id
    else where.santriId = session.id
  }

  const perizinan = await prisma.perizinanPulang.findMany({
    where,
    include: { santri: true, musyrif: true },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(perizinan)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()

  // If session is SANTRI, force santriId to session santri
  let santriId = data.santriId
  if (session.role === 'SANTRI') {
    const santri = await prisma.santri.findFirst({
      where: { OR: [{ id: session.id }, { userId: session.id }] },
    })
    if (santri) santriId = santri.id
    else santriId = session.id
  }

  const perizinan = await prisma.perizinanPulang.create({
    data: {
      ...data,
      santriId,
      departDate: new Date(data.departDate),
      returnDate: new Date(data.returnDate),
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
  const perizinan = await prisma.perizinanPulang.update({ where: { id }, data: rest })
  return Response.json(perizinan)
}
