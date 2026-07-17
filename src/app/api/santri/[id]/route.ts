import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const santri = await prisma.santri.findUnique({
    where: { id },
    include: {
      musyrif: true,
      pelanggaran: { orderBy: { date: 'desc' }, take: 10 },
      perizinanSakit: { orderBy: { createdAt: 'desc' }, take: 5 },
      perizinanPulang: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })

  if (!santri) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(santri)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  const data = await request.json()
  const santri = await prisma.santri.update({ where: { id }, data })
  return Response.json(santri)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  await prisma.santri.delete({ where: { id } })
  return Response.json({ success: true })
}
