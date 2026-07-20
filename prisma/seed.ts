import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database Pondok Pesantren Tahfizh Al-Kaukab Bojong Nangka...')

  // Clean existing data
  await prisma.programKerjaWaka.deleteMany()
  await prisma.pointAkhlak.deleteMany()
  await prisma.kPI.deleteMany()
  await prisma.absensiMusyrif.deleteMany()
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

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@alkaukab.sch.id',
      name: 'Admin Pesantren Utama',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const kepalaBaninUser = await prisma.user.create({
    data: {
      email: 'kepala.banin@alkaukab.sch.id',
      name: 'Ustadz Asrarun Najib, S.Pd.',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const kepalaBanatUser = await prisma.user.create({
    data: {
      email: 'kepala.banat@alkaukab.sch.id',
      name: 'Ustadzah Siti Wahyuni, S. Ag., Al Hafidzah',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const wakaKesantrianBanatUser = await prisma.user.create({
    data: {
      email: 'waka.kesantrian@alkaukab.sch.id',
      name: 'Ustadzah Nidatul Azizah, Al Hafidzah',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const musyrifDemoUser = await prisma.user.create({
    data: {
      email: 'musyrifah.annur2@alkaukab.sch.id',
      name: 'Ustadzah Afi Basyiroh, S.Pd., Al Hafidzah',
      password: hashedPassword,
      role: 'MUSYRIF',
    },
  })

  // 2. Musyrif Banin (9)
  const musyrifBaninList = [
    { name: 'Ustadz M. Rafli Apriliyan, Al Hafidz', room: 'Al Fajr 1', phone: '08121111001' },
    { name: 'Ustadz Maulana Rohman, Al Hafidz', room: 'Al Fajr 2', phone: '08121111002' },
    { name: 'Ustadz Sholahudin, S.E.', room: 'Al Misbah 1', phone: '08121111003' },
    { name: 'Ustadz Haikal Rifai, Lc.', room: 'Al Misbah 2', phone: '08121111004' },
    { name: 'Ustadz Angga Hermawan, S.Ag., Al Hafidz', room: 'Al Qomar 1 & 2', phone: '08121111005' },
    { name: 'Ustadz Muhammad Yusuf Al Hafizh', room: 'Asy Syams 1', phone: '08121111006' },
    { name: 'Ustadz Andika Wildan Gunaeba, S.Pd.', room: 'Asy Syams 2', phone: '08121111007' },
    { name: 'Ustadz Muhammad Fadeil', room: 'Asy Syams 3', phone: '08121111008' },
    { name: 'Ustadz Muh. Iqbal, S.H.', room: 'Al A’la 1 & 2', phone: '08121111009' },
  ]

  const musyrifBaninRecords = []
  for (const m of musyrifBaninList) {
    const rec = await prisma.musyrif.create({
      data: {
        name: m.name,
        gender: 'L',
        room: m.room,
        phone: m.phone,
        division: 'Kemusyrifan Banin',
      },
    })
    musyrifBaninRecords.push(rec)
  }

  // 3. Musyrifah Banat (8)
  const musyrifahBanatList = [
    { name: 'Ustadzah Rif`atuzzulfa, Al Hafidzah', room: 'An Najm 1', phone: '08122222001' },
    { name: 'Ustadzah Zahrotul Fitriyah, Al Hafidzah', room: 'An Najm 2', phone: '08122222002' },
    { name: 'Ustadzah Reri Yullian Putri, S.Pd.', room: 'An Najm 3', phone: '08122222003' },
    { name: 'Ustadzah Afi Basyiroh, S.Pd., Al Hafidzah', room: 'An Nur 2', phone: '08122222004', userId: musyrifDemoUser.id },
    { name: 'Ustadzah Hamida A\'la Zama', room: 'An Nur 3', phone: '08122222005' },
    { name: 'Ustadzah Eldis Pravita Syukrila', room: 'An Nur 4', phone: '08122222006' },
    { name: 'Ustadzah Zahrotul Aini, Al Hafidzah', room: 'An Nur 5', phone: '08122222007' },
    { name: 'Ustadzah Melani Putri, Al Hafidzah', room: 'An Nur 6', phone: '08122222008' },
  ]

  const musyrifahBanatRecords = []
  for (const m of musyrifahBanatList) {
    const rec = await prisma.musyrif.create({
      data: {
        name: m.name,
        gender: 'P',
        room: m.room,
        phone: m.phone,
        division: 'Kemusyrifan Banat',
        userId: m.userId || undefined,
      },
    })
    musyrifahBanatRecords.push(rec)
  }

  // 4. Create Santri Data (Banin & Banat)
  const santriSeedData = [
    { nis: 'S2026001', name: 'Ahmad Raihan', gender: 'L', room: 'Al Fajr 1', class: '7A Tahfizh', parentName: 'Bpk. Hendra', parentPhone: '0813000001', musyrifId: musyrifBaninRecords[0].id },
    { nis: 'S2026002', name: 'Faqih Al-Habsyi', gender: 'L', room: 'Al Fajr 2', class: '7B Tahfizh', parentName: 'Bpk. Mahmud', parentPhone: '0813000002', musyrifId: musyrifBaninRecords[1].id },
    { nis: 'S2026003', name: 'Muhammad Al-Fatih', gender: 'L', room: 'Al Misbah 1', class: '8A Tahfizh', parentName: 'Bpk. Ridwan', parentPhone: '0813000003', musyrifId: musyrifBaninRecords[2].id },
    { nis: 'S2026004', name: 'Zaidan Zikri', gender: 'L', room: 'Asy Syams 1', class: '9A Tahfizh', parentName: 'Bpk. Fahmi', parentPhone: '0813000004', musyrifId: musyrifBaninRecords[5].id },
    { nis: 'S2026005', name: 'Aisyah Az-Zahra', gender: 'P', room: 'An Nur 2', class: '7A Banat', parentName: 'Bpk. Bambang', parentPhone: '0813000005', musyrifId: musyrifahBanatRecords[3].id },
    { nis: 'S2026006', name: 'Fatimah Nur Nabila', gender: 'P', room: 'An Nur 2', class: '7A Banat', parentName: 'Bpk. Syarif', parentPhone: '0813000006', musyrifId: musyrifahBanatRecords[3].id },
    { nis: 'S2026007', name: 'Salma Khairunnisa', gender: 'P', room: 'An Najm 1', class: '8B Banat', parentName: 'Bpk. Usman', parentPhone: '0813000007', musyrifId: musyrifahBanatRecords[0].id },
    { nis: 'S2026008', name: 'Naylah Putri Syafiqah', gender: 'P', room: 'An Nur 3', class: '9B Banat', parentName: 'Bpk. Herman', parentPhone: '0813000008', musyrifId: musyrifahBanatRecords[4].id },
  ]

  const santriRecords = []
  for (const s of santriSeedData) {
    const rec = await prisma.santri.create({
      data: {
        nis: s.nis,
        name: s.name,
        gender: s.gender,
        room: s.room,
        class: s.class,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        address: 'Jl. Raya Bojong Nangka, Gunung Putri, Bogor',
        entryYear: '2026',
        status: 'AKTIF',
        musyrifId: s.musyrifId,
      },
    })
    santriRecords.push(rec)
  }

  // 5. Struktur Organisasi TA 2026/2027
  const strukturItems = [
    { name: 'Ibu Nyai Hj. Endang Riska Yani, S.Pd.I.', position: 'Mudirah', period: '2026/2027', order: 1 },
    // Banin
    { name: 'Ustadz Asrarun Najib, S.Pd.', position: 'Kepala Pesantren Banin', period: '2026/2027', order: 2 },
    { name: 'Ustadz Angga Hermawan, S.Ag., Al Hafidz', position: 'Waka. Kesantrian Banin (Ketertiban & OSAKA)', period: '2026/2027', order: 3 },
    { name: 'Ustadz Haikal Rifai, Lc.', position: 'Waka. Kurikulum Banin (Ubudiyyah, Pendidikan, Bahasa)', period: '2026/2027', order: 3 },
    { name: 'Ustadz Sholahudin, S.E.', position: 'Waka. Kebersihan, Kesehatan, dan Sarpras Banin (K2S)', period: '2026/2027', order: 3 },
    { name: 'Ustadzah Sarah Julianti', position: 'TU Pesantren Banin & Banat', period: '2026/2027', order: 4 },
    // Banat
    { name: 'Ustadzah Siti Wahyuni, S. Ag., Al Hafidzah', position: 'Kepala Pesantren Banat', period: '2026/2027', order: 2 },
    { name: 'Ustadzah Nidatul Azizah, Al Hafidzah', position: 'Waka. Kesantrian Banat (Ketertiban & OSAKA)', period: '2026/2027', order: 3 },
    { name: 'Ustadzah Alda Nur Alfi Lail, S.Ag Al Hafizah', position: 'Waka. Kurikulum Banat (Ubudiyyah, Pendidikan, Bahasa)', period: '2026/2027', order: 3 },
    { name: 'Ustadzah Lutpiana Ulpah', position: 'Waka. Kebersihan, Kesehatan, dan Sarpras Banat (K2S)', period: '2026/2027', order: 3 },
  ]

  for (const item of strukturItems) {
    await prisma.struktur.create({ data: item })
  }

  // 6. Absensi Musyrif / Musyrifah (Fingerprint Log Sesi 1 & Sesi 2)
  const allMusyrif = [...musyrifBaninRecords, ...musyrifahBanatRecords]
  const today = new Date()

  for (const m of allMusyrif) {
    // Session 1 (04.00-07.30)
    await prisma.absensiMusyrif.create({
      data: {
        date: today,
        session: 'SESI_1',
        status: 'HADIR',
        biometricSource: 'FINGERPRINT',
        note: 'Fingerprint ok (04.15 WIB)',
        musyrifId: m.id,
      },
    })
    // Session 2 (16.30-22.00)
    await prisma.absensiMusyrif.create({
      data: {
        date: today,
        session: 'SESI_2',
        status: 'HADIR',
        biometricSource: 'FINGERPRINT',
        note: 'Fingerprint ok (16.35 WIB)',
        musyrifId: m.id,
      },
    })
  }

  // 7. KPI Data
  const kpiItems = [
    { staffName: 'Ustadzah Siti Wahyuni, S. Ag.', position: 'Kepala Pesantren Banat', targetScore: 100, actualScore: 96, grade: 'SANGAT_BAIK', notes: 'Manajemen asrama & kurikulum berjalan sangat rapi.' },
    { staffName: 'Ustadz Asrarun Najib, S.Pd.', position: 'Kepala Pesantren Banin', targetScore: 100, actualScore: 95, grade: 'SANGAT_BAIK', notes: 'Kedisiplinan musyrif dan program tahfizh terlaksana dengan baik.' },
    { staffName: 'Ustadzah Lutpiana Ulpah', position: 'Waka K2S Banat', targetScore: 100, actualScore: 92, grade: 'SANGAT_BAIK', notes: 'Sanitasi dan kesehatan santriwati terpantau optimal.' },
    { staffName: 'Ustadzah Nidatul Azizah, Al Hafidzah', position: 'Waka Kesantrian Banat', targetScore: 100, actualScore: 94, grade: 'SANGAT_BAIK', notes: 'Penanganan izin & ketertiban konsisten.' },
    { staffName: 'Ustadzah Alda Nur Alfi Lail, S.Ag', position: 'Waka Kurikulum Banat', targetScore: 100, actualScore: 93, grade: 'SANGAT_BAIK', notes: 'Target setoran tahfizh & ubudiyyah tercapai.' },
  ]
  for (const k of kpiItems) {
    await prisma.kPI.create({ data: { ...k, period: 'TA 2026/2027' } })
  }

  // 8. Point Akhlak Sample Entries (8 Indicators)
  const akhlakCategories = [
    'SHALAT_BERJAMAAH',
    'AMALAN_SUNNAH',
    'HORMAT_GURU',
    'BERTUTUR_KATA_BAIK',
    'PRIYANTUN',
    'PEDULI_SOSIAL',
    'BERTEMAN',
    'MENJAGA_FASILITAS',
  ]

  for (let i = 0; i < santriRecords.length; i++) {
    const s = santriRecords[i]
    await prisma.pointAkhlak.create({
      data: {
        date: new Date(),
        category: akhlakCategories[i % akhlakCategories.length],
        points: -5,
        notes: 'Catatan kedisiplinan dan pembinaan akhlak santri',
        room: s.room,
        santriId: s.id,
        musyrifId: s.musyrifId,
      },
    })
  }

  // 9. Program Kerja Waka
  const prokerList = [
    { wakaTitle: 'KESANTRIAN', title: 'Peningkatan Ketertiban Shalat Berjamaah & OSAKA', month: 'Juli 2026', targetPercent: 100, actualPercent: 88, status: 'IN_PROGRESS', canvaLink: 'https://canva.link/1wl8s3qhpey9jom' },
    { wakaTitle: 'KURIKULUM', title: 'Evaluasi Setoran Hafalan & Kelas Ubudiyyah', month: 'Juli 2026', targetPercent: 100, actualPercent: 92, status: 'IN_PROGRESS', canvaLink: 'https://canva.link/1wl8s3qhpey9jom' },
    { wakaTitle: 'K2S', title: 'Pemeriksaan Kesehatan Berkala & Kebersihan Kamar', month: 'Juli 2026', targetPercent: 100, actualPercent: 85, status: 'IN_PROGRESS', canvaLink: 'https://canva.link/1wl8s3qhpey9jom' },
  ]
  for (const p of prokerList) {
    await prisma.programKerjaWaka.create({ data: p })
  }

  // 10. Perizinan & Pelanggaran Seed Data
  await prisma.perizinanPulang.create({
    data: {
      departDate: new Date(Date.now() + 86400000),
      returnDate: new Date(Date.now() + 4 * 86400000),
      reason: 'Acara keluarga (Syukuran)',
      status: 'PENDING',
      parentConfirm: true,
      santriId: santriRecords[4].id,
      musyrifId: musyrifahBanatRecords[3].id,
    },
  })

  await prisma.pelanggaran.create({
    data: {
      date: new Date(),
      category: 'KETERTIBAN',
      level: 'RINGAN',
      description: 'Terlambat mengikuti halqah Al-Quran',
      points: 5,
      santriId: santriRecords[4].id,
      musyrifId: musyrifahBanatRecords[3].id,
    },
  })

  // 11. Raport Sample Entry
  await prisma.raport.create({
    data: {
      period: '2026/2027 - Semester 1',
      totalPoints: 95,
      grade: 'MUMTAZ',
      details: JSON.stringify({ shalat: 'Sangat Baik', tahfizh: 'Juz 15 Clear', adab: 'Priyantun' }),
      santriId: santriRecords[4].id,
    },
  })

  console.log('✅ Seeding complete!')
  console.log('📧 Credentials:')
  console.log('   Admin Utama:     admin@alkaukab.sch.id / admin123')
  console.log('   Kepala Banin:    kepala.banin@alkaukab.sch.id / admin123')
  console.log('   Kepala Banat:    kepala.banat@alkaukab.sch.id / admin123')
  console.log('   Waka Kesantrian: waka.kesantrian@alkaukab.sch.id / admin123')
  console.log('   Musyrifah Banat: musyrifah.annur2@alkaukab.sch.id / admin123')
  console.log('   Wali Santri NIS: S2026005 (Aisyah Az-Zahra)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
