import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const divisi = await prisma.divisi.findMany({
    include: { anggota: { include: { musyrif: true } } },
    orderBy: { name: 'asc' },
  })
  return Response.json(divisi)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const divisi = await prisma.divisi.create({ data })
  return Response.json(divisi, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const data = await request.json()
  const { id, ...rest } = data
  const divisi = await prisma.divisi.update({ where: { id }, data: rest })
  return Response.json(divisi)
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { id } = await request.json()
  await prisma.divisi.delete({ where: { id } })
  return Response.json({ success: true })
}
