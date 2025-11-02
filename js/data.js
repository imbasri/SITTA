// =====================================================
// DATA BUKU DARI PUSTAKA UT
// Data buku lengkap untuk semester 1-8
// ===================================================== 
const UTBooks = [
    // ========== SISTEM INFORMASI ==========
    // Semester 1
    
    
    // Semester 2
   
    
    // Semester 3
    {
        code: "ADBI4201",
        title: "Manajemen Risiko dan Asuransi",
        author: "Dr. Herman Ruslim, M.M.",
        prodi: "Sistem Informasi",
        semester: 3,
        price: 76000,
        stock: 21,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4201.jpg",
        description: "Membahas konsep risiko, identifikasi risiko, analisis risiko, manajemen risiko, dan asuransi dalam bisnis dan organisasi."
    },
    
    // Semester 4
    {
        code: "EKMA4116",
        title: "Manajemen",
        author: "Prof. Dr. H. Buchari Alma, M.M.",
        prodi: "Sistem Informasi",
        semester: 4,
        price: 74000,
        stock: 23,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4116.jpg",
        description: "Membahas fungsi manajemen: perencanaan, pengorganisasian, pengarahan, pengendalian, serta manajemen strategis dan operasional."
    },
    
    // Semester 5
    {
        code: "ADPU4334",
        title: "Kepemimpinan",
        author: "Prof. Dr. Inu Kencana Syafiie, M.Si.",
        prodi: "Sistem Informasi",
        semester: 5,
        price: 71000,
        stock: 25,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADPU4334.jpg",
        description: "Membahas teori kepemimpinan, gaya kepemimpinan, kepemimpinan transformasional, motivasi, dan pengembangan kepemimpinan."
    },
    
    // Semester 6
    {
        code: "EKMA4312",
        title: "Ekonomi Manajerial",
        author: "Dr. Edy Sukarno, S.E., M.Si.",
        prodi: "Sistem Informasi",
        semester: 6,
        price: 77000,
        stock: 21,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4312.jpg",
        description: "Membahas penerapan teori ekonomi dalam pengambilan keputusan manajerial, analisis permintaan, produksi, biaya, dan pricing."
    },
    
    // Semester 7
    
    // Semester 8

    // ========== MANAJEMEN ==========
    // Semester 1
    {
        code: "EKMA4111",
        title: "Pengantar Bisnis",
        author: "Prof. Dr. Hj. Sri Langgeng Ratnasari, M.M.",
        prodi: "Manajemen",
        semester: 1,
        price: 70000,
        stock: 26,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4111.jpg",
        description: "Membahas konsep bisnis, lingkungan bisnis, fungsi manajemen, pemasaran, keuangan, produksi, SDM, dan entrepreneurship."
    },
    {
        code: "EKMA4115",
        title: "Pengantar Akuntansi",
        author: "Dr. Dwi Martani, S.E., M.Si., Ak., CA.",
        prodi: "Manajemen",
        semester: 1,
        price: 73000,
        stock: 24,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4115.jpg",
        description: "Membahas konsep akuntansi, persamaan akuntansi, siklus akuntansi, jurnal, posting, neraca saldo, dan laporan keuangan."
    },
    {
        code: "ESPA4110",
        title: "Pengantar Ekonomi Makro",
        author: "Prof. Dr. Boediono, M.Ec.",
        prodi: "Manajemen",
        semester: 1,
        price: 69000,
        stock: 28,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ESPA4110.jpg",
        description: "Membahas pendapatan nasional, inflasi, pengangguran, kebijakan fiskal, moneter, perdagangan internasional, dan pertumbuhan ekonomi."
    },
    {
        code: "EKMA4158",
        title: "Perilaku Organisasi",
        author: "Dr. H. Imam Salehudin, S.E., M.M.",
        prodi: "Manajemen",
        semester: 1,
        price: 75000,
        stock: 22,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4158.jpg",
        description: "Membahas perilaku individu, kelompok dalam organisasi, motivasi, kepemimpinan, komunikasi, dan budaya organisasi."
    },
    
    // Semester 2
    {
        code: "EKMA4215",
        title: "Manajemen Operasi",
        author: "Dr. H. Imam Salehudin, S.E., M.M.",
        prodi: "Manajemen",
        semester: 2,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4215.jpg",
        description: "Membahas perencanaan produksi, pengendalian kualitas, manajemen persediaan, supply chain, lean manufacturing, dan six sigma."
    },
    {
        code: "EKMA4213",
        title: "Manajemen Keuangan",
        author: "Dr. Ir. Bambang Riyanto, M.M.",
        prodi: "Manajemen",
        semester: 2,
        price: 78000,
        stock: 19,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4213.jpg",
        description: "Membahas analisis laporan keuangan, time value of money, investasi, capital budgeting, struktur modal, dan kebijakan dividen."
    },
    {
        code: "EKMA4214",
        title: "Manajemen Sumber Daya Manusia",
        author: "Prof. Dr. Hj. Veithzal Rivai, M.B.A.",
        prodi: "Manajemen",
        semester: 2,
        price: 76000,
        stock: 21,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKMA4214.jpg",
        description: "Membahas rekrutmen, seleksi, pelatihan, pengembangan, kompensasi, penilaian kinerja, dan hubungan industrial."
    },
    {
        code: "ESPA4111",
        title: "Pengantar Ekonomi Mikro",
        author: "Prof. Dr. Sadono Sukirno, M.A.",
        prodi: "Manajemen",
        semester: 2,
        price: 68000,
        stock: 27,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ESPA4111.jpg",
        description: "Membahas permintaan dan penawaran, teori konsumen, teori produksi, struktur pasar, dan kegagalan pasar."
    },

    // ========== AKUNTANSI ==========
    // Semester 1
    {
        code: "EKSI4101",
        title: "Pengantar Akuntansi",
        author: "Dr. Dwi Martani, S.E., M.Si., Ak., CA.",
        prodi: "Akuntansi",
        semester: 1,
        price: 85000,
        stock: 18,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKSI4101.jpg",
        description: "Membahas konsep akuntansi, persamaan akuntansi, siklus akuntansi, jurnal, posting, neraca saldo, worksheet, dan laporan keuangan."
    },
    {
        code: "EKSI4205",
        title: "Bank dan Lembaga Keuangan Non Bank",
        author: "Dr. Kasmir, S.E., M.M.",
        prodi: "Akuntansi",
        semester: 1,
        price: 74000,
        stock: 23,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKSI4205.jpg",
        description: "Membahas sistem perbankan, operasional bank, lembaga keuangan non bank, pasar modal, dan regulasi keuangan."
    },
    {
        code: "EKSI4203",
        title: "Teori Portofolio dan Analisis Investasi",
        author: "Dr. Ir. Jogiyanto Hartono, M.B.A., Ak., CA.",
        prodi: "Akuntansi",
        semester: 1,
        price: 82000,
        stock: 17,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKSI4203.jpg",
        description: "Membahas analisis sekuritas, teori portofolio, CAPM, APT, analisis fundamental, teknikal, dan manajemen portofolio."
    },
    
    // Semester 3
    {
        code: "EKSI4207",
        title: "Akuntansi Keuangan Menengah",
        author: "Dr. Ratna Wardhani, S.E., M.Si., Ak., CA.",
        prodi: "Akuntansi",
        semester: 3,
        price: 95000,
        stock: 14,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKSI4207.jpg",
        description: "Membahas penyusunan laporan keuangan sesuai PSAK, pengakuan pendapatan, aset tetap, investasi, dan instrumen keuangan."
    },
    {
        code: "EKSI4309",
        title: "Akuntansi Biaya",
        author: "Dr. Hansen & Mowen",
        prodi: "Akuntansi",
        semester: 3,
        price: 88000,
        stock: 16,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/EKSI4309.jpg",
        description: "Membahas konsep biaya, cost behavior, job order costing, process costing, activity based costing, dan cost management."
    },

    // ========== ADMINISTRASI NEGARA ==========
    {
        code: "ADPU4130",
        title: "Pengantar Ilmu Administrasi Negara",
        author: "Prof. Dr. Inu Kencana Syafiie, M.Si.",
        prodi: "Administrasi Negara",
        semester: 1,
        price: 72000,
        stock: 25,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADPU4130.jpg",
        description: "Membahas konsep administrasi negara, birokrasi, kebijakan publik, manajemen pemerintahan, reformasi birokrasi, dan pelayanan publik."
    },
    {
        code: "ADPU4337",
        title: "Kepemimpinan",
        author: "Prof. Dr. Kartini Kartono",
        prodi: "Administrasi Negara",
        semester: 5,
        price: 71000,
        stock: 24,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADPU4337.jpg",
        description: "Membahas teori kepemimpinan, gaya kepemimpinan, kepemimpinan transformasional, situasional, motivasi, dan pengembangan pemimpin."
    },
    {
        code: "ADPU4332",
        title: "Hukum Administrasi Negara",
        author: "Prof. Dr. Ridwan HR, S.H., M.Hum.",
        prodi: "Administrasi Negara",
        semester: 3,
        price: 73000,
        stock: 22,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADPU4332.jpg",
        description: "Membahas konsep hukum administrasi negara, asas-asas umum pemerintahan yang baik, kewenangan pemerintah, dan peradilan tata usaha negara."
    },

    // ========== ILMU KOMUNIKASI ==========
    {
        code: "SKOM4101",
        title: "Pengantar Ilmu Komunikasi",
        author: "Prof. Drs. Deddy Mulyana, M.A., Ph.D.",
        prodi: "Ilmu Komunikasi",
        semester: 1,
        price: 78000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/SKOM4101.jpg",
        description: "Membahas konsep komunikasi, proses komunikasi, komunikasi massa, interpersonal, organisasi, dan teori-teori komunikasi."
    },
    {
        code: "SKOM4314",
        title: "Komunikasi Massa",
        author: "Prof. Dr. Idi Subandy Ibrahim",
        prodi: "Ilmu Komunikasi",
        semester: 3,
        price: 79000,
        stock: 19,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/SKOM4314.jpg",
        description: "Membahas media massa, efek media, agenda setting, kultivasi, uses and gratification, dan new media."
    },

    // ========== ILMU SOSIAL ==========
    {
        code: "ISIP4110",
        title: "Pengantar Sosiologi",
        author: "Prof. Dr. Soerjono Soekanto, S.H., M.A.",
        prodi: "Ilmu Sosial",
        semester: 1,
        price: 68000,
        stock: 29,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ISIP4110.jpg",
        description: "Membahas konsep sosiologi, struktur sosial, stratifikasi, mobilitas sosial, lembaga sosial, perubahan sosial, dan masalah sosial."
    },
    {
        code: "ISIP4130",
        title: "Pengantar Ilmu Hukum",
        author: "Prof. Dr. C.S.T. Kansil, S.H.",
        prodi: "Ilmu Sosial",
        semester: 1,
        price: 70000,
        stock: 27,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ISIP4130.jpg",
        description: "Membahas konsep hukum, sistem hukum Indonesia, sumber hukum, subjek dan objek hukum, peristiwa hukum, dan sanksi hukum."
    },
    
    // ========== ADMINISTRASI BISNIS (New from Scraping) ==========
    {
        code: "ADBI4211",
        title: "Manajemen Risiko dan Asuransi",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4211.jpg",
        description: "Manajemen Risiko dan Asuransi"
    },
    {
        code: "ADBI4235",
        title: "Kepabeanan dan Cukai",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4235.jpg",
        description: "Kepabeanan dan Cukai"
    },
    {
        code: "ADBI4330",
        title: "Administrasi Perpajakan",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4330.jpg",
        description: "Administrasi Perpajakan"
    },
    {
        code: "ADBI4336",
        title: "Hukum Ketenagakerjaan",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4336.jpg",
        description: "Hukum Ketenagakerjaan"
    },
    {
        code: "ADBI4410",
        title: "Psikologi Industri dan Organisasi",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4410.jpg",
        description: "Psikologi Industri dan Organisasi"
    },
    {
        code: "ADBI4433",
        title: "Kebijakan dan Strategi Pemasaran",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4433.jpg",
        description: "Kebijakan dan Strategi Pemasaran"
    },
    {
        code: "ADBI4441",
        title: "Praktik Bisnis di Indonesia",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4441.jpg",
        description: "Praktik Bisnis di Indonesia"
    },
    {
        code: "ADBI4443",
        title: "Perencanaan dan Pengembangan Bisnis",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4443.jpg",
        description: "Perencanaan dan Pengembangan Bisnis"
    },
    {
        code: "ADBI4449",
        title: "Filsafat Bisnis",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4449.jpg",
        description: "Filsafat Bisnis"
    },
    {
        code: "ADBI4531",
        title: "Teori Pengambilan Keputusan",
        author: "Tim Penulis UT",
        prodi: "Administrasi Bisnis",
        semester: 4,
        price: 75000,
        stock: 20,
        image: "https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4531.jpg",
        description: "Teori Pengambilan Keputusan"
    }
];

// =====================================================
// INITIAL USERS DATA
// Data user awal untuk testing
// =====================================================
const initialUsers = [
    {
        nama: 'Budi Santoso',
        nim: '123456789',
        email: 'budi@student.ut.ac.id',
        telepon: '081234567890',
        password: '123456',
        role: 'user'
    },
    {
        nama: 'Siti Aminah',
        nim: '987654321',
        email: 'siti@student.ut.ac.id',
        telepon: '082345678901',
        password: '123456',
        role: 'user'
    }
];
