import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

/**
 * REST API Webhook Endpoint for Fingerprint Hardware Machines
 * Accepts POST JSON / Form Data from Solution / ZKTeco / ADMS Push Fingerprint
 *
 * Example Payload:
 * {
 *   "secretKey": "alkaukab-biometric-key-2026",
 *   "pin": "1001",
 *   "timestamp": "2026-07-20 05:15:00",
 *   "session": "SESI_1",
 *   "status": "HADIR",
 *   "biometricSource": "FINGERPRINT"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secretKey, pin, timestamp, session, status, note } = body

    // Simple Secret Key verification for machine authorization
    const expectedKey = process.env.BIOMETRIC_SECRET_KEY || 'alkaukab-biometric-key-2026'
    if (secretKey && secretKey !== expectedKey) {
      return Response.json({ error: 'Invalid biometric secret key' }, { status: 403 })
    }

    if (!pin) {
      return Response.json({ error: 'PIN / NIP Musyrif/Santri wajib diisi' }, { status: 400 })
    }

    // Find musyrif by ID or name/phone match
    const musyrif = await prisma.musyrif.findFirst({
      where: {
        OR: [
          { id: pin },
          { phone: { contains: pin } },
          { name: { contains: pin } },
        ],
      },
    })

    if (!musyrif) {
      return Response.json({
        success: false,
        message: `ID/PIN Biometrik ${pin} tidak terdaftar di sistem Musyrif Pesantren Al-Kaukab`,
      }, { status: 444 })
    }

    const logDate = timestamp ? new Date(timestamp) : new Date()

    const log = await prisma.absensiMusyrif.create({
      data: {
        date: logDate,
        session: session || 'SESI_1',
        status: status || 'HADIR',
        biometricSource: 'FINGERPRINT',
        note: note || `Disinkronkan otomatis dari Mesin Fingerprint (PIN: ${pin})`,
        musyrifId: musyrif.id,
      },
    })

    return Response.json({
      success: true,
      message: `Presensi Fingerprint berhasil dicatat untuk ${musyrif.name}`,
      logId: log.id,
      musyrif: musyrif.name,
      timestamp: logDate,
    }, { status: 201 })
  } catch (error) {
    console.error('Biometric Push Error:', error)
    return Response.json({ error: 'Gagal mencatat log biometrik' }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({
    status: 'ACTIVE',
    service: 'Al-Kaukab Biometric Fingerprint Push Listener API',
    version: '1.0.0',
    documentation: 'Send POST request with PIN, timestamp, and optional secretKey to log biometric attendance.',
  })
}
