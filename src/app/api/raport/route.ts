import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getGradeFromPoints } from '@/lib/utils'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const where: Record<string, unknown> = {}
  if (session.role === 'SANTRI') {
    const santri = await prisma.santri.findUnique({ where: { userId: session.id } })
    if (santri) where.santriId = santri.id
  }

  const raport = await prisma.raport.findMany({
    where,
    include: { santri: true },
    orderBy: { generatedAt: 'desc' },
  })
  return Response.json(raport)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role === 'SANTRI')
    return Response.json({ error: 'Unauthorized' }, { status: 403 })

  const { santriId, period } = await request.json()

  // Calculate total points from violations in the period
  const pelanggaran = await prisma.pelanggaran.findMany({
    where: { santriId },
  })

  const totalDeduction = pelanggaran.reduce((sum, p) => sum + p.points, 0)
  const totalPoints = Math.max(0, 100 - totalDeduction)
  const { grade } = getGradeFromPoints(totalPoints)

  // Category breakdown
  const categorySummary = pelanggaran.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.points
      return acc
    },
    {} as Record<string, number>
  )

  const raport = await prisma.raport.create({
    data: {
      santriId,
      period,
      totalPoints,
      grade,
      details: JSON.stringify({
        totalViolations: pelanggaran.length,
        totalDeduction,
        categorySummary,
      }),
    },
  })

  return Response.json(raport, { status: 201 })
}
