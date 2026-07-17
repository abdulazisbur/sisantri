import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getPointsByLevel } from '@/lib/utils'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const where: Record<string, unknown> = {}

  if (session.role === 'SANTRI') {
    const santri = await prisma.santri.findUnique({ where: { userId: session.id } })
    if (santri) where.santriId = santri.id
  }

  const pelanggaran = await prisma.pelanggaran.findMany({
    where,
    include: { santri: true, musyrif: true },
    orderBy: { date: 'desc' },
  })
  return Response.json(pelanggaran)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const points = getPointsByLevel(data.level)

  let musyrifId = data.musyrifId
  if (session.role === 'MUSYRIF' && !musyrifId) {
    const musyrif = await prisma.musyrif.findUnique({ where: { userId: session.id } })
    if (musyrif) musyrifId = musyrif.id
  }

  const pelanggaran = await prisma.pelanggaran.create({
    data: {
      ...data,
      musyrifId,
      points,
      date: new Date(data.date),
    },
  })
  return Response.json(pelanggaran, { status: 201 })
}
