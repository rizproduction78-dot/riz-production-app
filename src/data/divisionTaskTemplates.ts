/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * REFERENSI STANDAR DAILY TASK & QC 5R RESMI PER DIVISI
 * PT. RIZ PRODUCTION MULTI KREASI
 * Berdasarkan Lembar Logbook Checklist QC & Standar 5R Workshop Resmi
 */

import { Division } from '../types';

export interface DivisionTaskTemplate {
  title: string;
  description: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  category: 'Standar 5R & Kebersihan' | 'Pemeriksaan Rutin QC' | 'Operasional & Show' | 'Preventive Maintenance';
}

export const DIVISION_DAILY_TASK_REFERENCES: Record<Division, DivisionTaskTemplate[]> = {
  // ─────────────────────────────────────────────────────────────
  // 1. DIVISI AUDIO (12 Item Standar Resmi)
  // ─────────────────────────────────────────────────────────────
  Audio: [
    {
      title: 'Kebersihan Area Workshop / Gudang Maintenance & Rak Penyimpanan Audio (5R)',
      description: 'Pembersihan debu, penataan flightcase rak audio, dan sterilisasi area staging workshop audio.',
      priority: 'Rendah',
      category: 'Standar 5R & Kebersihan'
    },
    {
      title: 'Pembersihan & Pengecekan Fader Bermotor, Knob, Port & Showfile Mixer Digital (Midas)',
      description: 'Kalibrasi motorized fader, tes fungsi knob rotary, cek kebersihan port XLR/EtherCON, dan backup showfile.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Inspeksi Fisik, Port Neutrik XLR/EtherCON & Phantom 48V Stage Box / Digital Snake',
      description: 'Cek lampu indikator sinkronisasi AES50/Dante, uji tegangan phantom 48V, dan pastikan pengunci latch port berfungsi.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Fisik, Pin Lock Rigging & Uji Suara Modul Speaker Line Array di Meja Tes Gudang',
      description: 'Inspeksi quick-release pin rigging speaker, cek integritas sasis gantung, dan sweep frequency tes distorsi driver.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Fisik Box Subwoofer, Grill, Konektor Speakon/PowerCON & Uji Fungsi di Area Maintenance',
      description: 'Periksa kekencangan baut grill pelindung, periksa kerapatan box subwoofer dari kebocoran angin, dan tes konektor.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pemeriksaan Modul Power Amp Internal Speaker Aktif, Suhu Heatsink & Proteksi Limiter',
      description: 'Ukur suhu heatsink pendingin, cek kelancaran kipas fan modul amplifier, dan verifikasi proteksi limiter tidak clip.',
      priority: 'Tinggi',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Verifikasi Preset DSP Internal Speaker Aktif / Modul DLMS ke Standar Siap Event',
      description: 'Load preset pabrikan/custom, cek delay alignment, setting crossover frekuensi, dan kunci parameter DSP.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    },
    {
      title: 'Pengecekan Fisik Receiver Wireless Mic, Kelayakan Antena, Sinyal RF & Kompartemen Baterai',
      description: 'Scanning intervensi frekuensi RF, cek koneksi BNC antena paddle, dan bersihkan terminal kontak baterai mic.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Fisik, Spool & Kerapihan Dynamic/Condenser Mic Kabel & Stand Mic di Rak',
      description: 'Tes spool membran mic menggunakan mic tester, ganti busa peredam angin (windscreen), dan kencangkan clutch stand mic.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pengujian Port Jack, Saklar Ground Lift & Baterai/Phantom DI Box Aktif/Pasif',
      description: 'Uji fungsi attenuator pad -20dB, cek saklar ground lift pencegah dengung/humming, dan tes suplai phantom 48V.',
      priority: 'Sedang',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengujian Kontinuitas, Isolasi & Kerapihan Gulungan Kabel Audio (XLR, Speakon, PowerCON)',
      description: 'Uji pin 1-2-3 kabel dengan multimeter, periksa robekan isolasi luar kabel, dan ikat rapi menggunakan strap velcro.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pengecekan Fisik & Kelistrikan Panel Distribusi Daya Audio Gudang',
      description: 'Ukur kestabilan tegangan 220V/380V, pastikan proteksi MCB tidak panas berlebih, dan periksa grounding ground rod.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // 2. DIVISI GUDANG (11 Item Standar Resmi)
  // ─────────────────────────────────────────────────────────────
  Gudang: [
    {
      title: 'Kebersihan Seluruh Lorong Gudang, Rak Penyimpanan, Area Workshop Maintenance & Loading Dock (5R)',
      description: 'Sapu dan pel lantai gudang, pastikan jalur forklift dan hand pallet bebas dari rintangan kabel atau kardus.',
      priority: 'Rendah',
      category: 'Standar 5R & Kebersihan'
    },
    {
      title: 'Verifikasi Fisik Unit Masuk/Keluar Sesuai Surat Jalan (Loading & Unloading Manifest)',
      description: 'Pencocokan kuantitas nomor barcode aset terhadap manifest surat jalan resmi saat barang berangkat dan pulang.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    },
    {
      title: 'Pemeriksaan Fisik Flightcase (Roda Caster, Handle, Kunci Kupu-kupu & Label Barcode Aset)',
      description: 'Beri pelumas roda caster, cek kuncian kupu-kupu hardcase, pastikan handle kokoh, dan barcode terbaca jelas.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Penggulungan Kabel Rapi (Over-Under Method), Inspeksi Isolasi & Pengikatan Velcro di Rak',
      description: 'Gulung seluruh kabel menggunakan teknik Over-Under agar tidak terpelintir, periksa isolasi sobek, dan kelompokkan per rak.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Inspeksi Keselamatan Rigging Truss, Safety Pin Spigot, Shackle & Webbing Spanset di Rak Rigging',
      description: 'Periksa keretakan las aluminium truss, cek kelayakan ulir shackle omega, dan periksa masa pakai spanset sling.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Panel Distribusi Utama 3-Phase (MDP/SDP), Konektor Camlock & ELCB Gudang',
      description: 'Uji fungsi saklar trip ELCB/RCD, periksa kekencangan baut terminal busbar tembaga, dan cek grounding < 2 Ohm.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Fisik & Kuncian Pengaman Barrier Mojo / Barikade di Rak Penyimpanan',
      description: 'Cek pin engsel barikade, pastikan pelat injakan kokoh tidak bengkok, dan susun rapi di pallet rak penyimpanan.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Segregasi & Penempatan Unit Rusak di Area Karantina Khusus Bertag Merah (Red Tag)',
      description: 'Pisahkan unit yang rusak atau NG dari inventory siap show, pasang label Red Tag, dan serahkan ke tim Service.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Kelayakan Alat Bantu Angkut (Hand Pallet Hidrolik, Trolley Barang, Lashing Truk)',
      description: 'Periksa oli hidrolik hand pallet pompa, cek kelancaran roda trolley, dan periksa ratchet tie-down strap lashing.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Keamanan Lingkungan Area Kerja Terutama yang Piket / Absen Malam (Jam: 23.00, 03.00, 04.30 WIB)',
      description: 'Patroli keliling perimeter gudang, periksa pintu gembok rolling door, lampu penerangan luar, dan catatan log piket.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    },
    {
      title: 'Koordinasi dengan Pihak Keamanan Terkait Shift Malam (SATPAM > POLISI dst)',
      description: 'Briefing serah terima situasi keamanan pergudangan dengan pos satpam dan kontak darurat kepolisian sektor setempat.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // 3. DIVISI LIGHTING (10 Item Standar Resmi)
  // ─────────────────────────────────────────────────────────────
  Lighting: [
    {
      title: 'Kebersihan Area Workshop / Gudang Maintenance Lighting, Fixture & Flightcase (5R)',
      description: 'Pembersihan debu fixture lampu panggung, penyusunan flightcase rapi, dan perawatan kebersihan meja tes DMX.',
      priority: 'Rendah',
      category: 'Standar 5R & Kebersihan'
    },
    {
      title: 'Pengecekan Konsol Lighting (GrandMA/Avolites), Touchscreen, Fader & Port DMX di Meja Uji',
      description: 'Kalibrasi layar sentuh, periksa fader playback, periksa output universe DMX 1-8, dan backup show file ke USB drive.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Uji Kalibrasi Homing Pan/Tilt, Optik Lensa, Lampu/LED, Gobo & Prism Moving Head di Staging Area Gudang',
      description: 'Running test homing motor sensor optocoupler, cek fokus lensa, putaran prisma ganda, dan kebersihan gobo wheel.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Nyala LED RGBW, Dimmer, Barndoor & Kuncian Bracket PAR LED / Fresnel di Rak',
      description: 'Uji warna R-G-B-W pada nilai 255, periksa kelancaran dimmer kurva linier, dan kencangkan baut handle bracket.',
      priority: 'Sedang',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Kelancaran Mekanik Pan/Tilt, Iris, Shutter & Filter Warna Follow Spot di Gudang',
      description: 'Lumasi mekanisme putar stand follow spot, bersihkan cermin iris shutter, dan ganti filter gel warna yang kusam.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pengecekan DMX Splitter/Booster, Node Art-Net & Terminator DMX di Rak Aksesoris',
      description: 'Periksa lampu sinyal DMX In/Thru/Isolated Out, tes konverter Art-Net to DMX, dan pastikan resistor terminator 120 Ohm siap.',
      priority: 'Sedang',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengujian Kontinuitas Shielding Kabel DMX 3-Pin/5-Pin, PowerCON & Jumper di Keranjang Kabel',
      description: 'Tes resistansi ground shielding kabel DMX untuk mencegah flicker data panggung, dan isolasi konektor yang longgar.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Inspeksi Fisik Aksesoris Rigging Lighting (Clamp C-Hook, Omega Bracket & Safety Wire Baja)',
      description: 'Periksa ulir baut clamp tidak slek, cek pin pengunci omega bracket, dan kelayakan sling kawat baja safety wire.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Panel Distribusi Daya Listrik Lighting & Kabel 3-Phase Gudang',
      description: 'Ukur keseimbangan beban per fasa (R-S-T), pastikan voltase 220V per phase, dan cek grounding box panel utama.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Mesin Efek (Hazer / Smoke Machine), Kebersihan Tabung, Nozzle & Stok Liquid',
      description: 'Pembersihan kerak nozzle pemanas menggunakan distilled water/vinegar, cek pompa cairan, dan cek sisa stok liquid.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // 4. DIVISI MULTIMEDIA (9 Item Standar Resmi)
  // ─────────────────────────────────────────────────────────────
  Multimedia: [
    {
      title: 'Kebersihan Area Workshop / Gudang Maintenance Multimedia, Rak Perangkat & Lensa Kamera (5R)',
      description: 'Pembersihan meja operator multimedia, pengaturan kabel meja uji, dan sterilisasi kabinet dry cabinet optik lensa.',
      priority: 'Rendah',
      category: 'Standar 5R & Kebersihan'
    },
    {
      title: 'Pengecekan Laptop / PC Streaming (Performa Sistem, Kebersihan Kipas & Storage Bebas Sampah)',
      description: 'Update OS/driver GPU Nvidia, bersihkan debu heatsink fan laptop, dan pastikan SSD drive memiliki free space > 100GB.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Uji Kesiapan Software Playback & Streaming (vMix, OBS, Resolume Arena) di Komputer Gudang',
      description: 'Tes load project template vMix/Resolume, verifikasi lisensi aktif, setting audio routing ASIO, dan cek output NDI.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengujian Video Switcher (Blackmagic ATEM / DataVideo), Port SDI/HDMI & Adaptor Daya',
      description: 'Tes input SDI 1-8, cek multiview output, pengujian transition fader bar (T-Bar), dan pastikan adaptor power terkunci.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Fisik Camcorder, Kebersihan Lensa Optik, Baterai V-Mount & Charger di Dry Cabinet',
      description: 'Inspeksi elemen kaca lensa dari jamur/debu, bersihkan kontak baterai V-Mount, dan ukur level charge baterai 100%.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Tripod Kamera (Fluid Head Pan/Tilt, Kunci Kaki & Quick Release Plate) di Rak',
      description: 'Cek kekenyalan fluid head pan-tilt, kencangkan twist lock kaki aluminium/carbon, dan pastikan plate tripod terpasang.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pengujian Capture Card (DeckLink/Magewell), Converter Signal & HyperDeck Recorder di Meja Uji',
      description: 'Uji input SDI ke capture card USB 3.0/PCIe, periksa converter HDMI to SDI Micro, dan format SSD di Blackmagic HyperDeck.',
      priority: 'Sedang',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan Sistem Wireless Video Transmitter/Receiver & Wireless Intercom Clearcom kru',
      description: 'Pairing wireless video Hollyland/Teradek, cek delay latency, uji kejelasan mic headset beltpack intercom wireless.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengecekan TV Monitor Preview / Display 50" & Stand Bracket Roda di Flightcase',
      description: 'Tes panel display monitor dari dead pixel, periksa kelengkapan baut bracket VESA, dan cek rem roda stand dorong.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // 5. DIVISI VIDEOTRON (9 Item Standar Resmi)
  // ─────────────────────────────────────────────────────────────
  Videotron: [
    {
      title: 'Kebersihan Area Workshop / Gudang Maintenance Videotron, Modul LED & Panel Processor (5R)',
      description: 'Pembersihan meja kerja servis modul LED, pemilahan sparepart baut magnet, dan penataan flightcase kabinet rapi.',
      priority: 'Rendah',
      category: 'Standar 5R & Kebersihan'
    },
    {
      title: 'Uji Nyala Modul LED di Meja Tes Gudang (Pola RGBWB, Deteksi Dead Pixel & Masker Modul)',
      description: 'Jalankan pattern tes warna Solid Red, Green, Blue, White, Black untuk identifikasi pixel mati, dan periksa masker modul.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pemeriksaan Kuncian Kabinet Die-Cast (Fast Lock), Pin Alignment & Busa Flightcase',
      description: 'Pastikan mekanisme fast-lock mengunci presisi, cek pin lurus alignment kabinet, dan rapikan busa peredam hardcase.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pengecekan Status Indikator Receiving Card & Flat Ribbon Data Cable Tiap Kabinet',
      description: 'Periksa kedipan normal LED hijau run receiving card NovaStar, dan pastikan kabel data ribbon 16-pin tidak longgar.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Inspeksi Video Processor / Sending Controller (NovaStar VX600/VX1000) & Port Input/Output',
      description: 'Tes port HDMI/DVI/3G-SDI input, periksa output port Gigabit LAN 1-6, dan verifikasi firmware processor versi stabil.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pengujian & Perapihan Gulungan Kabel LAN Cat6 EtherCON & Jumper Data Antar Kabinet',
      description: 'Tes kabel Cat6 dengan LAN tester fluke/standar, periksa barrel housing EtherCON Neutrik, dan gulung rapi per set kabinet.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Pemeriksaan Modul Power Supply 5V DC Internal Kabinet & Kabel Power Jumper',
      description: 'Ukur output tegangan power supply (stabil 4.8V - 5.0V DC), cek terminal baut tidak kendor, dan cek kabel powercon jumper.',
      priority: 'Tinggi',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Backup & Verifikasi File Konfigurasi Mapping / RCFG di Komputer Workshop',
      description: 'Simpan file konfigurasi cabinet (.rcfgx) dan screen mapping (.map) di flashdisk cadangan untuk kebutuhan darurat event.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    },
    {
      title: 'Pengecekan Rigging Hanging Bar / Ground Base Videotron & Baut Pengunci di Rak Penyimpanan',
      description: 'Periksa kelurusan hanging bar beam aluminium, cek pin shackle rigging gantung, dan kelengkapan baut leveling base.',
      priority: 'Tinggi',
      category: 'Pemeriksaan Rutin QC'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // 6. DIVISI ADMIN
  // ─────────────────────────────────────────────────────────────
  Admin: [
    {
      title: 'Verifikasi Surat Jalan Resmi & Manifest Pengeluaran Barang Event',
      description: 'Terbitkan dokumen surat jalan resmi berdasarkan loading list, tanda tangan supervisor & driver armada.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    },
    {
      title: 'Rekonsiliasi Lembar Checklist Kembali Pasca Bongkaran Event',
      description: 'Cocokkan lembar checklist keberangkatan vs kepulangan barang untuk mendeteksi potensi barang hilang/tertinggal.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    },
    {
      title: 'Monitoring & Verifikasi Pengisian Absensi Serta Jam Kerja Crew',
      description: 'Audit presensi harian teknisi gudang dan jadwal shift standby untuk perhitungan payroll dan kompensasi.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    },
    {
      title: 'Audit Kelengkapan Logbook Harian & Pengajuan Approval Supervisor/Manager',
      description: 'Cek kelengkapan pengisian log-book teknisi dan ajukan persetujuan mingguan ke Manajer Operasional.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    },
    {
      title: 'Pengecekan & Pengarsipan Faktur Biaya Operasional Warehouse',
      description: 'Rekap nota pembelian konsumsi event, solar armada truk, sparepart darurat, dan faktur vendor.',
      priority: 'Rendah',
      category: 'Preventive Maintenance'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // 7. DIVISI SERVICE & MAINTENANCE
  // ─────────────────────────────────────────────────────────────
  Service: [
    {
      title: 'Solder Station, Desoldering Blower & Alat Ukur Terkalibrasi (5R)',
      description: 'Bersihkan mata solder, rapikan gulungan timah, cek kondisi spons pembersih, dan rapikan meja kerja servis.',
      priority: 'Rendah',
      category: 'Standar 5R & Kebersihan'
    },
    {
      title: 'Inspeksi & Pengujian Multimeter, Osiloskop Serta DC Power Supply Lab',
      description: 'Kalibrasi probe osiloskop 1X/10X, tes baterai multimeter digital, dan uji proteksi arus power supply variabel.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Diagnosa & Perbaikan Power Supply Unit (PSU) 5V Modul LED',
      description: 'Ganti kapasitor kembung/dioda jebol, tes beban tegangan DC 5V 40A selama 2 jam, dan bersihkan sisa flux PCB.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    },
    {
      title: 'Penyolderan Ulang Konektor Kabel XLR, Speakon, & PowerCON',
      description: 'Kupas ujung kabel, solder ulang pin 1-2-3 Neutrik, pasang heat-shrink tube dan tes dengan cable tester.',
      priority: 'Sedang',
      category: 'Preventive Maintenance'
    },
    {
      title: 'Penggantian SMD LED Lamp Beads P3.9 / P2.6 dengan Hot Air',
      description: 'Lepas mata LED RGB yang mati menggunakan hot-air blower suhu 260°C, pasang LED baru, dan bersihkan sisa flux.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    },
    {
      title: 'Running Test Unit Pasca Servis (Min 2 Jam Uji Beban Kontinu)',
      description: 'Nyalakan unit yang telah diservis dengan beban maksimal selama minimal 2 jam untuk memastikan stabilitas panas dan fungsi.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    },
    {
      title: 'Pencatatan Kartu Servis & Update Tiket Temuan Kerusakan',
      description: 'Input part yang diganti, biaya komponen, nama teknisi yang mengerjakan, dan ubah status work order menjadi Close.',
      priority: 'Sedang',
      category: 'Operasional & Show'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // SEMUA DIVISI (Template umum lintas divisi)
  // ─────────────────────────────────────────────────────────────
  'Semua Divisi': [
    {
      title: 'Pengecekan & Perawatan Rutin Peralatan Umum',
      description: 'Pengecekan kondisi fisik dan fungsional peralatan umum yang digunakan lintas divisi.',
      priority: 'Sedang',
      category: 'Pemeriksaan Rutin QC'
    },
    {
      title: 'Pencatatan Laporan Harian Operasional',
      description: 'Pengisian laporan harian sesuai aktivitas operasional yang dilaksanakan pada hari bersangkutan.',
      priority: 'Tinggi',
      category: 'Operasional & Show'
    }
  ]
};
