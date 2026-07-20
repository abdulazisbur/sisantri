import { prisma } from '@/lib/prisma'
import { setSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, nis } = body

    // 1. Wali Santri Login by NIS
    if (nis) {
      const santri = await prisma.santri.findFirst({
        where: {
          OR: [
            { nis: { equals: nis.trim(), mode: 'insensitive' } },
            { name: { contains: nis.trim(), mode: 'insensitive' } },
          ],
        },
      })

      if (!santri) {
        return Response.json(
          { error: 'NIS / Nama Santri tidak ditemukan' },
          { status: 404 }
        )
      }

      await setSession({
        id: santri.id,
        email: `${santri.nis.toLowerCase()}@wali.alkaukab.sch.id`,
        name: `Wali dari ${santri.name}`,
        role: 'SANTRI',
      })

      return Response.json({
        user: {
          id: santri.id,
          nis: santri.nis,
          email: `${santri.nis.toLowerCase()}@wali.alkaukab.sch.id`,
          name: `Wali dari ${santri.name}`,
          santriName: santri.name,
          role: 'SANTRI',
        },
      })
    }

    // 2. Admin / Musyrif Login by Email & Password
    if (!email || !password) {
      return Response.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return Response.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return Response.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'MUSYRIF' | 'SANTRI',
    })

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
