import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const musyrif = await prisma.musyrif.findUnique({
    where: { id },
    include: { santriList: true, absensi: { orderBy: { date: 'desc' }, take: 30 } },
  })

  if (!musyrif) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(musyrif)
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
  const musyrif = await prisma.musyrif.update({ where: { id }, data })
  return Response.json(musyrif)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await params
  await prisma.musyrif.delete({ where: { id } })
  return Response.json({ success: true })
}
