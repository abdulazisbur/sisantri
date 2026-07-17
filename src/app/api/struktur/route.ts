import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const struktur = await prisma.struktur.findMany({ orderBy: { order: 'asc' } })
  return Response.json(struktur)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const struktur = await prisma.struktur.create({ data })
  return Response.json(struktur, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const { id, ...rest } = data
  const struktur = await prisma.struktur.update({ where: { id }, data: rest })
  return Response.json(struktur)
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await request.json()
  await prisma.struktur.delete({ where: { id } })
  return Response.json({ success: true })
}
