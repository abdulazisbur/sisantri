import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.raport.deleteMany()
  await prisma.pelanggaran.deleteMany()
  await prisma.sKIA.deleteMany()
  await prisma.perizinanPulang.deleteMany()
  await prisma.perizinanSakit.deleteMany()
  await prisma.absensi.deleteMany()
  await prisma.divisiAnggota.deleteMany()
  await prisma.divisi.deleteMany()
  await prisma.struktur.deleteMany()
  await prisma.santri.deleteMany()
  await prisma.musyrif.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pesantren.com',
      name: 'Admin Pesantren',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create Musyrif Users
  const musyrifUser1 = await prisma.user.create({
    data: {
      email: 'musyrif1@pesantren.com',
      name: 'Ustadz Ahmad',
      password: hashedPassword,
      role: 'MUSYRIF',
    },
  })

  const musyrifUser2 = await prisma.user.create({
    data: {
      email: 'musyrif2@pesantren.com',
      name: 'Ustadzah Fatimah',
      password: hashedPassword,
      role: 'MUSYRIF',
    },
  })

  // Create Musyrif
  const musyrif1 = await prisma.musyrif.create({
    data: {
      name: 'Ustadz Ahmad Fauzi',
      gender: 'L',
      phone: '081234567890',
      division: 'Tarbiyah',
      userId: musyrifUser1.id,
    },
  })

  const musyrif2 = await prisma.musyrif.create({
    data: {
      name: 'Ustadzah Fatimah Az-Zahra',
      gender: 'P',
      phone: '081234567891',
      division: 'Keamanan',
      userId: musyrifUser2.id,
    },
  })

  // Create Santri
  const santriNames = [
    { nis: 'S001', name: 'Muhammad Rafi', gender: 'L', room: 'Kamar 1A', class: 'VII A', parentName: 'Bapak Rafi', parentPhone: '0812345001' },
    { nis: 'S002', name: 'Abdullah Azzam', gender: 'L', room: 'Kamar 1A', class: 'VII A', parentName: 'Bapak Azzam', parentPhone: '0812345002' },
    { nis: 'S003', name: 'Umar Faruq', gender: 'L', room: 'Kamar 1B', class: 'VII B', parentName: 'Bapak Faruq', parentPhone: '0812345003' },
    { nis: 'S004', name: 'Bilal Ibrahim', gender: 'L', room: 'Kamar 1B', class: 'VIII A', parentName: 'Bapak Ibrahim', parentPhone: '0812345004' },
    { nis: 'S005', name: 'Aisyah Putri', gender: 'P', room: 'Kamar 2A', class: 'VII A', parentName: 'Bapak Aisyah', parentPhone: '0812345005' },
    { nis: 'S006', name: 'Khadijah Nur', gender: 'P', room: 'Kamar 2A', class: 'VIII A', parentName: 'Bapak Khadijah', parentPhone: '0812345006' },
    { nis: 'S007', name: 'Zainab Hafsah', gender: 'P', room: 'Kamar 2B', class: 'VII B', parentName: 'Bapak Zainab', parentPhone: '0812345007' },
    { nis: 'S008', name: 'Salman Al-Farisi', gender: 'L', room: 'Kamar 1A', class: 'VIII B', parentName: 'Bapak Salman', parentPhone: '0812345008' },
  ]

  const santriRecords = []
  for (const data of santriNames) {
    const santri = await prisma.santri.create({
      data: {
        ...data,
        entryYear: '2024',
        status: 'AKTIF',
        musyrifId: data.gender === 'L' ? musyrif1.id : musyrif2.id,
      },
    })
    santriRecords.push(santri)
  }

  // Create Santri User (for demo)
  await prisma.user.create({
    data: {
      email: 'santri@pesantren.com',
      name: 'Muhammad Rafi',
      password: hashedPassword,
      role: 'SANTRI',
    },
  })

  // Create Struktur
  const strukturData = [
    { name: 'KH. Abdul Karim', position: 'Pengasuh', period: '2024/2025', order: 0 },
    { name: 'Ust. Mahmud', position: 'Ketua Pengurus', period: '2024/2025', order: 1 },
    { name: 'Ust. Hasan', position: 'Sekretaris', period: '2024/2025', order: 1 },
    { name: 'Ust. Ali', position: 'Bendahara', period: '2024/2025', order: 1 },
    { name: 'Ust. Ahmad Fauzi', position: 'Ketua Tarbiyah', period: '2024/2025', order: 2 },
    { name: 'Ustz. Fatimah', position: 'Ketua Keamanan', period: '2024/2025', order: 2 },
    { name: 'Ust. Yusuf', position: 'Ketua Kebersihan', period: '2024/2025', order: 2 },
  ]

  for (const data of strukturData) {
    await prisma.struktur.create({ data })
  }

  // Create Divisi
  const divTarbiyah = await prisma.divisi.create({
    data: { name: 'Tarbiyah', description: 'Divisi pendidikan dan pengajaran' },
  })

  const divKeamanan = await prisma.divisi.create({
    data: { name: 'Keamanan', description: 'Divisi keamanan dan ketertiban' },
  })

  await prisma.divisi.create({
    data: { name: 'Kebersihan', description: 'Divisi kebersihan dan lingkungan' },
  })

  // Assign musyrif to divisi
  await prisma.divisiAnggota.create({
    data: { divisiId: divTarbiyah.id, musyrifId: musyrif1.id, role: 'KETUA' },
  })

  await prisma.divisiAnggota.create({
    data: { divisiId: divKeamanan.id, musyrifId: musyrif2.id, role: 'KETUA' },
  })

  // Create Absensi
  const today = new Date()
  for (let i = 0; i < 10; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const statuses = ['HADIR', 'HADIR', 'HADIR', 'IZIN', 'HADIR']

    await prisma.absensi.create({
      data: {
        date,
        status: statuses[i % statuses.length],
        musyrifId: musyrif1.id,
        note: statuses[i % statuses.length] === 'IZIN' ? 'Keperluan keluarga' : null,
      },
    })

    await prisma.absensi.create({
      data: {
        date,
        status: statuses[(i + 1) % statuses.length],
        musyrifId: musyrif2.id,
      },
    })
  }

  // Create Pelanggaran
  const pelanggaranData = [
    { santriIdx: 0, category: 'KETERTIBAN', level: 'RINGAN', description: 'Terlambat sholat Subuh berjamaah', points: 5 },
    { santriIdx: 1, category: 'KEBERSIHAN', level: 'RINGAN', description: 'Tidak merapikan tempat tidur', points: 5 },
    { santriIdx: 2, category: 'AKHLAK', level: 'SEDANG', description: 'Berbicara kasar kepada teman', points: 15 },
    { santriIdx: 0, category: 'KETERTIBAN', level: 'SEDANG', description: 'Tidak mengikuti kajian malam', points: 15 },
    { santriIdx: 3, category: 'KETERTIBAN', level: 'BERAT', description: 'Keluar pondok tanpa izin', points: 30 },
    { santriIdx: 4, category: 'IBADAH', level: 'RINGAN', description: 'Terlambat sholat Dzuhur berjamaah', points: 5 },
    { santriIdx: 5, category: 'AKADEMIK', level: 'RINGAN', description: 'Tidak mengerjakan tugas hafalan', points: 5 },
  ]

  for (const data of pelanggaranData) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    await prisma.pelanggaran.create({
      data: {
        date,
        category: data.category,
        level: data.level,
        description: data.description,
        points: data.points,
        santriId: santriRecords[data.santriIdx].id,
        musyrifId: data.santriIdx < 4 ? musyrif1.id : musyrif2.id,
      },
    })
  }

  // Create Perizinan Sakit
  await prisma.perizinanSakit.create({
    data: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 86400000),
      reason: 'Demam tinggi dan flu',
      status: 'PENDING',
      santriId: santriRecords[0].id,
      musyrifId: musyrif1.id,
    },
  })

  await prisma.perizinanSakit.create({
    data: {
      startDate: new Date(Date.now() - 7 * 86400000),
      endDate: new Date(Date.now() - 4 * 86400000),
      reason: 'Sakit perut',
      status: 'DISETUJUI',
      santriId: santriRecords[4].id,
      musyrifId: musyrif2.id,
    },
  })

  // Create Perizinan Pulang
  await prisma.perizinanPulang.create({
    data: {
      departDate: new Date(Date.now() + 86400000),
      returnDate: new Date(Date.now() + 4 * 86400000),
      reason: 'Acara pernikahan saudara',
      status: 'PENDING',
      parentConfirm: true,
      santriId: santriRecords[1].id,
      musyrifId: musyrif1.id,
    },
  })

  // Create SKIA
  await prisma.sKIA.create({
    data: {
      type: 'KETERANGAN_SANTRI',
      description: 'Surat keterangan aktif belajar di pesantren',
      status: 'DITERBITKAN',
      santriId: santriRecords[0].id,
    },
  })

  await prisma.sKIA.create({
    data: {
      type: 'IZIN_AKTIF',
      description: 'Surat izin aktif untuk keperluan administrasi sekolah',
      status: 'DRAFT',
      santriId: santriRecords[2].id,
    },
  })

  console.log('✅ Seed completed!')
  console.log('')
  console.log('📧 Login credentials:')
  console.log('   Admin:   admin@pesantren.com / admin123')
  console.log('   Musyrif: musyrif1@pesantren.com / admin123')
  console.log('   Santri:  santri@pesantren.com / admin123')
  console.log('')
  console.log(`   Admin User ID: ${adminUser.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
