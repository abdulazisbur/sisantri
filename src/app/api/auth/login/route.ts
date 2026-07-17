import { prisma } from '@/lib/prisma'
import { setSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

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
