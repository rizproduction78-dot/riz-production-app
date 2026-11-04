/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * DATA MASTER INVENTARIS ALAT & ASET GUDANG RESMI PT. RIZ PRODUCTION MULTI KREASI
 * Sumber Referensi Resmi Google Sheet:
 * https://docs.google.com/spreadsheets/d/1lZ9Ja-GWY7BMn7l9uUM4p5Q97DXeKy0O/edit?usp=sharing
 * Spreadsheet ID: 1lZ9Ja-GWY7BMn7l9uUM4p5Q97DXeKy0O
 *
 * Mencakup 4 Tab Inventaris Resmi (Total 133 Kelompok Aset Gudang):
 * 1. Inventory LIGHTING MAR 2024 (28 Kelompok Aset • Total Nilai: Rp 220.600.000)
 * 2. Inventory SOUND MAR 2024 (70 Kelompok Aset • Total Nilai: Rp 486.950.000)
 * 3. INVENTORY STREEMING MAR 2024 (26 Kelompok Aset • Total Nilai: Rp 339.848.000)
 * 4. INVENTORY LED MAR 2024 (9 Kelompok Aset • LED Hybrid P3.9 60m / 30 Box + VX6s + Rigging/Cabling)
 */

import { Asset } from '../types';

export const INITIAL_INVENTORY_ASSETS: Asset[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. DIVISI LIGHTING — Sheet: Inventory LIGHTING MAR 2024 (24 MAR 2024)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-lgt-001',
    code: 'AST-LGT-001',
    name: 'Moving Beam TRF Clara (2 Unit)',
    brand: 'TRF',
    serialNumber: 'No. 1-2 • QTY: 2 Unit • Nilai: Rp 20.000.000',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-002',
    code: 'AST-LGT-002',
    name: 'Moving Beam TRF Super (4 Unit)',
    brand: 'TRF',
    serialNumber: 'No. 1-4 • QTY: 4 Unit • Nilai: Rp 60.000.000',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-003',
    code: 'AST-LGT-003',
    name: 'Moving Beam TRF Clara S (14 Unit)',
    brand: 'TRF',
    serialNumber: 'No. 1-14 • QTY: 14 Unit • Nilai: Rp 66.000.000',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-004',
    code: 'AST-LGT-004',
    name: 'Fresnel Spark 200W (8 Unit)',
    brand: 'SPARK',
    serialNumber: 'No. 1-8 • QTY: 8 Unit • Nilai: Rp 50.000.000',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-005',
    code: 'AST-LGT-005',
    name: 'Fresnel AMT Light 300W (4 Unit)',
    brand: 'AMT LIGHT',
    serialNumber: 'No. 19-22 • QTY: 4 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-006',
    code: 'AST-LGT-006',
    name: 'Parled 54 RGBW (16 Unit)',
    brand: 'PARLED',
    serialNumber: 'No. 1-16 • QTY: 16 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-007',
    code: 'AST-LGT-007',
    name: 'Par Light TRF A64 (RGB WW) (24 Unit)',
    brand: 'TRF',
    serialNumber: 'No. 1-24 • QTY: 24 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-008',
    code: 'AST-LGT-008',
    name: 'Stormy Strobe Light (12 Unit)',
    brand: 'STORMY',
    serialNumber: 'No. 1-12 • QTY: 12 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-009',
    code: 'AST-LGT-009',
    name: 'Wallwasher LED 24x 10 Watt (8 Unit)',
    brand: 'WALLWASER',
    serialNumber: 'No. 1-8 • QTY: 8 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-010',
    code: 'AST-LGT-010',
    name: 'Follow Spot 7R 230 Spark (2 Unit - 1 Rusak)',
    brand: 'SPARK',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (1 Aktif • Remark: SATU RUSAK)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-lgt-011',
    code: 'AST-LGT-011',
    name: 'Mini Brute 4 Cell (4 Unit)',
    brand: 'MINI BRUTE',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-012',
    code: 'AST-LGT-012',
    name: 'Smoke Machine (4 Unit - 1 Eror)',
    brand: 'SMOKE MACHINE',
    serialNumber: 'No. 89-92 • QTY: 4 Unit (Remark: 1 eror)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-lgt-013',
    code: 'AST-LGT-013',
    name: 'Hazer Machine (3 Unit - 1 Eror)',
    brand: 'HAZER',
    serialNumber: 'No. 93-94 • QTY: 3 Unit (Remark: 1 eror)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-lgt-014',
    code: 'AST-LGT-014',
    name: 'Mixer Lighting Grand MA 2 (1 Unit)',
    brand: 'MA',
    serialNumber: 'No. 95 • QTY: 1 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-015',
    code: 'AST-LGT-015',
    name: 'Mixer Lighting Avolite Quartz (1 Unit)',
    brand: 'AVOLITES',
    serialNumber: 'No. 96 • QTY: 1 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-016',
    code: 'AST-LGT-016',
    name: 'Mixer Lighting Avolites Mini Pearl (1 Unit)',
    brand: 'AVOLITES',
    serialNumber: 'No. 97 • QTY: 1 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-017',
    code: 'AST-LGT-017',
    name: 'Mixer Lighting Avolites Tiger Touch II (1 Unit)',
    brand: 'AVOLITES',
    serialNumber: 'QTY: 1 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-018',
    code: 'AST-LGT-018',
    name: 'Mixer Lighting Avolite Pearl 2010 (1 Unit - Mati Suri)',
    brand: 'AVOLITES',
    serialNumber: 'No. 98 • QTY: 1 Unit (Kondisi: MATI SURI)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Rusak Berat',
    repairHistory: []
  },
  {
    id: 'ast-lgt-019',
    code: 'AST-LGT-019',
    name: 'Splitter DMX Lighting (4 Unit)',
    brand: 'SPLITER DMX',
    serialNumber: 'No. 99-102 • QTY: 4 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-020',
    code: 'AST-LGT-020',
    name: 'Stand Lighting Double Stand (3 Unit)',
    brand: 'DOUBLE STAND',
    serialNumber: 'No. 103-105 • QTY: 3 Unit • Nilai: Rp 300.000',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-021',
    code: 'AST-LGT-021',
    name: 'Stand Lighting Single Stand (1 Unit)',
    brand: 'SINGGLE STAND',
    serialNumber: 'No. 106 • QTY: 1 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-022',
    code: 'AST-LGT-022',
    name: 'Kabel Link Baru DMX / Power (162 Unit)',
    brand: 'CABLE LINK',
    serialNumber: '100M (1), 75M Rolan (1), 50M (2), 25M (8), 10M (20), 5M (30), 2M (100) • Nilai: Rp 24.300.000',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-023',
    code: 'AST-LGT-023',
    name: 'Kabel Link Lama DMX / Power (70 Unit)',
    brand: 'CABLE LINK',
    serialNumber: '10M (20 Unit), 2M (30 Unit), 1M (20 Unit) • Total: 70 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-024',
    code: 'AST-LGT-024',
    name: 'XLR Link Pendek Lighting (1 Lot)',
    brand: 'CABLE LINK',
    serialNumber: 'No. 119 • XLR Link Pendek',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-025',
    code: 'AST-LGT-025',
    name: 'Kabel Extension Lighting (36 Unit)',
    brand: 'TAMBAHAN',
    serialNumber: '25M (4 Unit), 10M (4 Unit), 5M (28 Unit) • Total: 36 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-026',
    code: 'AST-LGT-026',
    name: 'Kabel Power 4 X 2.5 (3 Unit)',
    brand: 'TAMBAHAN',
    serialNumber: '50M (1 Unit), 25M (2 Unit) • Total: 3 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-027',
    code: 'AST-LGT-027',
    name: 'Minyak Hazer (2 Botol) & Minyak Smoke (2 Derigen)',
    brand: 'TAMBAHAN',
    serialNumber: 'No. 125-126 • Minyak Hazer 2 Botol & Minyak Smoke 2 Derigen',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-028',
    code: 'AST-LGT-028',
    name: 'Cover Beam (12 Unit) & Cover Parled (12 Unit)',
    brand: 'TAMBAHAN',
    serialNumber: 'No. 127-128 • Cover Beam 12 Unit & Cover Parled 12 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. DIVISI SOUND (AUDIO) — Sheet: Inventory SOUND MAR 2024 (18 MAR 2024)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-aud-001',
    code: 'AST-AUD-001',
    name: 'PA Speaker RCF 4Pro 6001-A (4 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-4 • QTY: 4 Unit • Nilai: Rp 80.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-002',
    code: 'AST-AUD-002',
    name: 'PA Speaker Line Array RCF HDL 20-A (8 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-8 • QTY: 8 Unit • Nilai: Rp 176.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-003',
    code: 'AST-AUD-003',
    name: 'Sub Double RCF P300 (1 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 13 • QTY: 1 Unit • Nilai: Rp 3.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-004',
    code: 'AST-AUD-004',
    name: 'Sub Double OMR MP-4600 5 (3 Unit)',
    brand: 'OMR',
    serialNumber: 'No. 14 • QTY: 3 Unit • Nilai: Rp 3.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-005',
    code: 'AST-AUD-005',
    name: 'Sub Double RDW LS-2000 (8 Unit)',
    brand: 'RDW',
    serialNumber: 'No. 15 • QTY: 8 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-006',
    code: 'AST-AUD-006',
    name: 'Sub Single RCF 4PRO 8003-A (4 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-007',
    code: 'AST-AUD-007',
    name: 'Sub Single RCF 4 PRO 7001 (2 Unit - NEW)',
    brand: 'RCF',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (Kondisi: NEW)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-008',
    code: 'AST-AUD-008',
    name: 'Sub Single RCF 4 PRO 8001 (2 Unit - NEW)',
    brand: 'RCF',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (Kondisi: NEW)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-009',
    code: 'AST-AUD-009',
    name: 'Sub Single RCF 4 PRO 8002 (2 Unit - NEW)',
    brand: 'RCF',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (Kondisi: NEW)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-010',
    code: 'AST-AUD-010',
    name: 'Fullrange K-Array KR100K (2 Unit)',
    brand: 'K ARRAY',
    serialNumber: 'No. 20-21 • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-011',
    code: 'AST-AUD-011',
    name: 'Monitor Speaker RCF ART-315A (12 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-12 • QTY: 12 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-012',
    code: 'AST-AUD-012',
    name: 'Monitor Speaker dB Technologies Opera 15 (16 Unit)',
    brand: 'DB TECH',
    serialNumber: 'No. 1-16 • QTY: 16 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-013',
    code: 'AST-AUD-013',
    name: 'Monitor Speaker dB Technologies LVX 15 (2 Unit)',
    brand: 'DB TECH',
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-014',
    code: 'AST-AUD-014',
    name: 'Digital Mixer Midas M32 R (1 Unit)',
    brand: 'MIDAS',
    serialNumber: 'No. 46 • QTY: 1 Unit • Nilai: Rp 72.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-015',
    code: 'AST-AUD-015',
    name: 'Digital Mixer Midas M32 LIVE (3 Unit)',
    brand: 'MIDAS',
    serialNumber: 'No. 46b • QTY: 3 Unit • Nilai: Rp 25.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-016',
    code: 'AST-AUD-016',
    name: 'Digital Mixer Yamaha TF 1 (1 Unit)',
    brand: 'YAMAHA',
    serialNumber: 'No. 47 • QTY: 1 Unit • Nilai: Rp 25.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-017',
    code: 'AST-AUD-017',
    name: 'Analog Mixer Yamaha MG 16 (1 Unit)',
    brand: 'YAMAHA',
    serialNumber: 'QTY: 1 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-018',
    code: 'AST-AUD-018',
    name: 'Analog Mixer Mackie 12 Pro (1 Unit)',
    brand: 'MACKIE',
    serialNumber: 'No. 48 • QTY: 1 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-019',
    code: 'AST-AUD-019',
    name: 'IO / Stage Box Midas DL 32 (4 Unit)',
    brand: 'MIDAS',
    serialNumber: 'No. 48-51 • QTY: 4 Unit • Nilai: Rp 2.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-020',
    code: 'AST-AUD-020',
    name: 'Power Amply Soundlab HX 3600S (1 Unit)',
    brand: 'Soundlab',
    serialNumber: 'No. 52 • QTY: 1 Unit • Nilai: Rp 3.500.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-021',
    code: 'AST-AUD-021',
    name: 'Power Amply Lab Gruppen FP 10.000Q (1 Unit)',
    brand: 'LAB GRUPPEN',
    serialNumber: 'No. 53 • QTY: 1 Unit • Nilai: Rp 3.500.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-022',
    code: 'AST-AUD-022',
    name: 'Power Amply STX TX 52 (2 Unit)',
    brand: 'STX',
    serialNumber: 'No. 54 • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-023',
    code: 'AST-AUD-023',
    name: 'Instrument Drum Pearl Vision VBL 926 (1 Set)',
    brand: 'Pearl',
    serialNumber: 'No. 55 • QTY: 1 Set • Nilai: Rp 6.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-024',
    code: 'AST-AUD-024',
    name: 'Instrument Drum Yamaha Stage Custom (1 Set)',
    brand: 'YAMAHA',
    serialNumber: 'No. 53b • QTY: 1 Set',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-025',
    code: 'AST-AUD-025',
    name: 'Instrument Drum Elektrik NUX DM-7 (1 Set)',
    brand: 'NUX',
    serialNumber: 'No. 54b • QTY: 1 Set',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-026',
    code: 'AST-AUD-026',
    name: 'Instrument Amply Roland JC-120 (1 Unit)',
    brand: 'Roland',
    serialNumber: 'No. 55b • QTY: 1 Unit • Nilai: Rp 10.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-027',
    code: 'AST-AUD-027',
    name: 'Instrument Amply Gallien Krueger GK 1100RB (2 Unit)',
    brand: 'Galien Kruger',
    serialNumber: 'No. 56 • QTY: 2 Unit • Nilai: Rp 12.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-028',
    code: 'AST-AUD-028',
    name: 'Instrument Amply Roland KC-550 (1 Unit)',
    brand: 'Roland',
    serialNumber: 'No. 57 • QTY: 1 Unit • Nilai: Rp 5.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-029',
    code: 'AST-AUD-029',
    name: 'Instrument Amply Marshall JCM 900 (2 Unit)',
    brand: 'Marshall',
    serialNumber: 'No. 58 • QTY: 2 Unit • Nilai: Rp 14.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-030',
    code: 'AST-AUD-030',
    name: 'Instrument Keyboard Roland RD 700 NX (1 Unit)',
    brand: 'Roland',
    serialNumber: 'No. 59 • QTY: 1 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-031',
    code: 'AST-AUD-031',
    name: 'Instrument Keyboard Roland RD 700 GX (1 Unit)',
    brand: 'Roland',
    serialNumber: 'No. 60 • QTY: 1 Unit • Nilai: Rp 15.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-032',
    code: 'AST-AUD-032',
    name: 'Microphone Wireless MIPRO ACT 312B / ACT-32H (13 Unit - 1 Mati)',
    brand: 'MIPRO',
    serialNumber: 'No. 1-12 • QTY: 13 Unit (12 Aktif • Remark: SATU MATI)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-033',
    code: 'AST-AUD-033',
    name: 'Microphone Wireless MIPRO Clipon (4 Unit)',
    brand: 'MIPRO',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-034',
    code: 'AST-AUD-034',
    name: 'Microphone Wireless QA HMD46PRO (13 Set - Adaptor Mati 1 & 1 Mic Error)',
    brand: 'QA',
    serialNumber: 'No. 1-13 (5 Set + 8 NEW) • Remark: ADAPTOR MATI SATU DAN 1 MIC ERROR',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-035',
    code: 'AST-AUD-035',
    name: 'Microphone Wireless QA Clipon / HMD45PRO (8 Unit)',
    brand: 'QA',
    serialNumber: 'No. 1-7 (6 Unit + 2 NEW) • QTY: 8 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-036',
    code: 'AST-AUD-036',
    name: 'Microphone Wireless Sennheiser EW100 G4 835S (4 Unit)',
    brand: 'SENNHEISER',
    serialNumber: 'No. 1-4 • QTY: 4 Unit • Nilai: Rp 1.500.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-037',
    code: 'AST-AUD-037',
    name: 'Microphone Wireless Shure (2 Unit)',
    brand: 'SHURE',
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-038',
    code: 'AST-AUD-038',
    name: 'Microphone Cable Shure SM57 (10 Unit - 2 Tengek)',
    brand: 'SHURE',
    serialNumber: 'No. 1-10 • QTY: 10 Unit (8 Aktif • Remark: 2 TENGEK)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-039',
    code: 'AST-AUD-039',
    name: 'Microphone Cable Shure SM58 (18 Unit)',
    brand: 'SHURE',
    serialNumber: 'No. 1-18 (17 Unit + 1 NEW) • QTY: 18 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-040',
    code: 'AST-AUD-040',
    name: 'Microphone Cable VXT-TX300 / VXT-TX301 (13 Unit - 1 Mati)',
    brand: 'VXT',
    serialNumber: 'No. 1-13 • QTY: 13 Unit (12 Aktif • Remark: SATU MATI)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-041',
    code: 'AST-AUD-041',
    name: 'Microphone Cable Samson R21 (3 Unit)',
    brand: 'SAMSON',
    serialNumber: 'No. 1-3 • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-042',
    code: 'AST-AUD-042',
    name: 'Microphone Gooseneck Hardwell (6 Unit - 2 Rusak)',
    brand: 'HARDWELL',
    serialNumber: 'No. 1-6 (5 Unit + 1 NEW, 4 Aktif • Remark: 2 RUSAK)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-043',
    code: 'AST-AUD-043',
    name: 'Microphone Gooseneck Shure (2 Unit)',
    brand: 'SHURE',
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-044',
    code: 'AST-AUD-044',
    name: 'Microphone Drum Set A (Shure Beta 91, Audix D6, SM57, 4x E604)',
    brand: 'SHURE / AUDIX / SENNHEISER',
    serialNumber: 'No. 140-146 • Beta 91 (1), Audix D6 (1), SM57 (1), E604 (4) • Nilai: Rp 1.500.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-045',
    code: 'AST-AUD-045',
    name: 'Microphone Drum Set B (AKG D112, SM57, 3x E604)',
    brand: 'AKG / SHURE / SENNHEISER',
    serialNumber: 'No. 147-151 • AKG D112 (1), SM57 (1), E604 (3)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-046',
    code: 'AST-AUD-046',
    name: 'Microphone Drum Set Takstar (2 Set)',
    brand: 'TAKSTAR',
    serialNumber: 'No. 152-153 • QTY: 2 Set',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-047',
    code: 'AST-AUD-047',
    name: 'DI-Box Behringer Ultra-DI D100 / D101 (10 Unit - 2 Rusak)',
    brand: 'Behringer',
    serialNumber: 'No. 1-10 • QTY: 10 Unit (8 Aktif • Remark: RUSAK 2)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-048',
    code: 'AST-AUD-048',
    name: 'DI-Box Samson MDA1 Mono Active (15 Unit - 1 Rusak)',
    brand: 'SAMSON',
    serialNumber: 'No. 1-15 (10 Unit + 5 NEW • Remark: RUSAK 1)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-049',
    code: 'AST-AUD-049',
    name: 'DI-Box Samson S-Direct (3 Unit)',
    brand: 'SAMSON',
    serialNumber: 'No. 1-3 • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-050',
    code: 'AST-AUD-050',
    name: 'DI-Active Behringer Ultra-DI Pro DI800v2 (3 Unit)',
    brand: 'Behringer',
    serialNumber: 'No. 1-3 • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-051',
    code: 'AST-AUD-051',
    name: 'Microphone Condenser AKG C-1000 (4 Unit)',
    brand: 'AKG',
    serialNumber: 'No. 1-4 • QTY: 4 Unit • Nilai: Rp 4.000.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-052',
    code: 'AST-AUD-052',
    name: 'Microphone Condenser JTS TX-9 (3 Unit) & JTS NX-9 (1 Unit)',
    brand: 'JTS',
    serialNumber: 'No. 180-183 • JTS TX-9 (3 Unit) & JTS NX-9 (1 Unit)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-053',
    code: 'AST-AUD-053',
    name: 'Microphone Condenser Shure 81 (1), Beta 91A (1) & Beta 52 (2)',
    brand: 'SHURE',
    serialNumber: 'No. 184-187 • Shure 81 (1), Beta 91A (1), Beta 52 (2)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-054',
    code: 'AST-AUD-054',
    name: 'Microphone Condenser Behringer ECM8000 (1 Unit) & Superlux (2 Unit)',
    brand: 'Behringer / Superlux',
    serialNumber: 'No. 188-189 • Behringer ECM8000 (1) & Superlux (2)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-055',
    code: 'AST-AUD-055',
    name: 'Microphone Cable Shure Beta 58 (4 Unit)',
    brand: 'SHURE',
    serialNumber: 'No. 1-4 • QTY: 4 Unit • Nilai: Rp 600.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-056',
    code: 'AST-AUD-056',
    name: 'Speaker Management DLMS Xilica XP3060 (1) & Behringer DCX 2496-LE (1)',
    brand: 'XILICA / BEHRINGER',
    serialNumber: 'No. 194-195 • Xilica XP3060 (1 Unit) & Behringer DCX 2496-LE (1 Unit)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-057',
    code: 'AST-AUD-057',
    name: 'Audio Splitter 32CH Switch A+B (2 Unit) & Splitter AUX (1 Unit)',
    brand: 'Custom',
    serialNumber: 'No. 196-198 • Splitter 32CH Switch A+B (2) & Splitter AUX (1)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-058',
    code: 'AST-AUD-058',
    name: 'Snake Cable BTV 32/50M (1 Unit) & Kabel LAN Custom 50/65M (7 Unit)',
    brand: 'BTV / Custom',
    serialNumber: 'No. 199-200 • Snake Cable 32/50M (1) & LAN Custom 50/65M (7)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-059',
    code: 'AST-AUD-059',
    name: 'Cable XLR Canare 10 Meter (280 Unit - 2 Rusak)',
    brand: 'Canare',
    serialNumber: 'No. 201 • QTY: 280 Unit (Awal 242 • Remark: 2 RUSAK)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-060',
    code: 'AST-AUD-060',
    name: 'Cable Jack to Jack Canare (60 Unit)',
    brand: 'Canare',
    serialNumber: 'No. 202 • QTY: 60 Unit (Awal 51)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-061',
    code: 'AST-AUD-061',
    name: 'Cable Rumbai WHM (2), Rumbai Drum (4), Power AC (4) & Junction Box AUX (1)',
    brand: 'Custom',
    serialNumber: 'No. 203-207 • Rumbai WHM (2), Rumbai Drum (4), Power AC (4), Junction Box AUX (1)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-062',
    code: 'AST-AUD-062',
    name: 'Stand Speaker (LB720 23, Baretone 2, NoBrand 2 - Total 27 Unit)',
    brand: 'LB720 / BARETONE',
    serialNumber: 'No. 208 • QTY: 27 Unit • Nilai: Rp 2.300.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-063',
    code: 'AST-AUD-063',
    name: 'Stand Mic Hercules MS33B (26 Unit - 3 Rusak) & MS201B (4 Unit)',
    brand: 'Hercules',
    serialNumber: 'No. 209-210 • MS33B (26 Unit, Remark: RUSAK 3) & MS201B (4 Unit)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-064',
    code: 'AST-AUD-064',
    name: 'Stand Keyboard Double Hercules KS 410B (2 Unit) & Single KS 120B (3 Unit)',
    brand: 'Hercules',
    serialNumber: 'No. 211-212 • KS 410B Double (2 Unit) & KS 120B Single (3 Unit)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-065',
    code: 'AST-AUD-065',
    name: 'Stand Book Superior (8 Unit)',
    brand: 'Superior',
    serialNumber: 'No. 213 • QTY: 8 Unit • Nilai: Rp 800.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-066',
    code: 'AST-AUD-066',
    name: 'Stand Guitar Single Hercules (3 Unit) & Double GS 422B (2 Unit - 1 Aus)',
    brand: 'Hercules',
    serialNumber: 'No. 214-215 • Single (3 Aktif dari 4) & Double GS 422B (2 Unit • Remark: RUSAK UDAH AUS 1)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-067',
    code: 'AST-AUD-067',
    name: 'Panel Box Custom 3Phase (1 Unit - Hilang)',
    brand: 'Custom',
    serialNumber: 'No. 216 • QTY: 1 Unit (Remark: HILANG)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Berat',
    repairHistory: []
  },
  {
    id: 'ast-aud-068',
    code: 'AST-AUD-068',
    name: 'Kabel Listrik Eterna 50M (4), 50M 4x4 (2) & 5M-10-15M (100 Unit)',
    brand: 'Eterna',
    serialNumber: 'No. 217-219 • 50M (4), 50M 4X4 (2), 5M-10-15M (100) • Nilai: Rp 5.700.000',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-069',
    code: 'AST-AUD-069',
    name: 'Stabilizer Stavolt 3000Va (4 Unit) & UPS ICA CP700 (1) / CP1400 (1)',
    brand: 'Stavolt / ICA',
    serialNumber: 'No. 220-222 • Stavolt 3000Va (4), UPS ICA CP700 (1), UPS ICA CP1400 (1)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-070',
    code: 'AST-AUD-070',
    name: 'Takel 2 Ton (2), Takel 1 Ton (8), Strap 2 Ton 3M (12) & Booster Pasline (4)',
    brand: 'Pasline / Rigging',
    serialNumber: 'No. 223-228 • Takel 2T (2), Takel 1T (2+6 NEW), Strap 2T 3M (12 NEW), Booster Pasline (2+2 NEW)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. DIVISI MULTIMEDIA — Sheet: INVENTORY STREEMING MAR 2024 (18 MAR 2024)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-mm-001',
    code: 'AST-MM-001',
    name: 'PC Streaming 1 Workstation (Intel Core i9 10920X, RTX 3070, 64GB RAM, 2x DeckLink Quad HDMI)',
    brand: 'Intel / MSI / Gigabyte',
    serialNumber: 'i9-10920X 12C/24T, MSI RTX3070 Gaming X Trio, X299X Aorus Master, 2x32GB Corsair, 2x1TB XPG, 2x DeckLink Quad • Rp 82.618.000',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-002',
    code: 'AST-MM-002',
    name: 'PC Streaming 2 Workstation (AMD Ryzen 9 5900X, RTX 2060 Super, 32GB RAM, SEMOX 4-HDMI PCIe)',
    brand: 'AMD Ryzen / MSI / Gigabyte',
    serialNumber: 'Ryzen 9 5900X 12C/24T, MSI RTX2060 Super, B550 Aorus Master, 32GB Corsair, 1TB+512GB XPG, SEMOX 4-HDMI • Rp 41.562.000',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-003',
    code: 'AST-MM-003',
    name: 'PC Streaming 3 Workstation (AMD Ryzen 9 3900XT, RTX 2060 Super, 32GB RAM, Elgato Cam Link Pro Quad HDMI)',
    brand: 'AMD Ryzen / MSI / Gigabyte',
    serialNumber: 'Ryzen 9 3900XT 12C, MSI RTX2060 Super, B550 Aorus Pro AC, 32GB Corsair, 1TB XPG + 1TB V-Gen, Elgato Cam Link Pro 4K30',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-004',
    code: 'AST-MM-004',
    name: 'Video Capture Card Elgato HD60S (2 Unit), Acasis HD33 (1) & Acasis HD31 (2)',
    brand: 'ELGATO / ACASIS',
    serialNumber: 'Elgato H260S/HD60S (2 Unit), Acasis HD 33 1080P (1 Unit), Acasis HD 31 1080P (2 Unit)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-005',
    code: 'AST-MM-005',
    name: 'Video Capture Card Hagibis 4K (2), Vention USB-HDMI (2), Ezcap HD60 (3 - 1 Rusak) & Game Link Raw 4K (1)',
    brand: 'HAGIBIS / VENTION / EZCAP',
    serialNumber: 'Hagibis LNM-318 4K (2), Vention ACW (2), Ezcap HD60 (3 Unit - SATU RUSAK), Ezcap Game Link Raw 4K30 (1)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-006',
    code: 'AST-MM-006',
    name: 'Audio Soundcard Behringer U-Phoria UMC202HD (3 - 1 Rusak), UMC402HD (1) & Xenyx QX1002USB (1)',
    brand: 'BEHRINGER',
    serialNumber: 'UMC202HD 2-In (3 Unit, 2 Aktif - SATU RUSAK), UMC402HD 4-In (1 Unit), Xenyx QX1002USB (1 Unit)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-007',
    code: 'AST-MM-007',
    name: 'Audio Soundcard Hardwell Optimus 4 (2 Unit), ISK DS-1 (1) & Focusrite Scarlett 2i2 3rd Gen (1 NEW)',
    brand: 'HARDWELL / FOCUSRITE / ISK',
    serialNumber: 'Hardwell Optimus 4 (2 Unit), ISK DS-1 (1 Unit), Focusrite Scarlett 2i2 3rd Gen USB (1 Unit NEW)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-008',
    code: 'AST-MM-008',
    name: 'Camcorder Sony HXR-NX100 FHD NXCAM (2 Unit Aktif)',
    brand: 'CAMCORDER SONY',
    serialNumber: 'QTY: 2 Unit Aktif dari 4 (Remark: GANTI KAMERA YANG HILANG 2) • Nilai: Rp 66.000.000',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-009',
    code: 'AST-MM-009',
    name: 'Camcorder Sony PXW-Z190 4K 3-CMOS XDCAM (4 Unit - NEW)',
    brand: 'CAMCORDER SONY',
    serialNumber: 'QTY: 4 Unit (Kondisi: NEW)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-010',
    code: 'AST-MM-010',
    name: 'Remote Control Kamera Libec ZFC-5HD Peanut Zoom (3 Unit)',
    brand: 'LIBEC',
    serialNumber: 'QTY: 3 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-011',
    code: 'AST-MM-011',
    name: 'Tripod Kamera Libec 650EX (4), Libec TH-X (4 NEW), Sirui SH-5 (1) & Takara Hydro A16 (1)',
    brand: 'LIBEC / SIRUI / TAKARA',
    serialNumber: 'Libec 650EX (4), Libec TH-X (4 NEW - Ganti Tripod Hilang 2), Sirui SH-5 (1), Takara Hydro A16 (1)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-012',
    code: 'AST-MM-012',
    name: 'Wireless Cam Accsoon CineEye II Pro (2 Unit) & Hollyland Cosmo C1 FullHD (1 Unit NEW)',
    brand: 'ACCSON / HOLLYLAND',
    serialNumber: 'Accsoon CineEye II Pro (2 Unit) & Hollyland Cosmo C1 FullHD (1 Unit NEW)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-013',
    code: 'AST-MM-013',
    name: 'Memory Cam SanDisk 64GB (4 Unit), 128GB (1 Unit NEW) & 256GB (1 Unit)',
    brand: 'SANDISK',
    serialNumber: 'SanDisk 64GB (4 Unit - 3 NEW), 128GB (1 Unit NEW), 256GB (1 Unit)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-014',
    code: 'AST-MM-014',
    name: 'Blackmagic Design Micro Converter HDMI to SDI 3G (3 Unit) & SDI to HDMI 3G (1 Unit)',
    brand: 'BLACKMAGIC DESIGN',
    serialNumber: 'Micro Converter HDMI to SDI 3G (3 Unit) & SDI to HDMI 3G (1 Unit)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-015',
    code: 'AST-MM-015',
    name: 'Laptop Produksi Gaming: HP Omen 15 i7 (1), MSI GP66 RTX3060 (1 NEW), ROG Strix G16 RTX4050 (1 NEW) & Alienware M15 RTX3080 (1)',
    brand: 'HP / MSI / ASUS ROG / ALIENWARE',
    serialNumber: 'HP Omen 15 GTX1660Ti (1), MSI GP66 Leopard 11UE (1 NEW), ASUS ROG Strix G16 (1 NEW), Dell Alienware M15 R4 32GB/1TB/RTX3080 (1)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-016',
    code: 'AST-MM-016',
    name: 'Laptop Operasional: Lenovo X1 i7 (2 NEW), Lenovo T495 Ryzen 5 Pro (3 NEW), Dell Latitude E7480 (1) & Dell 5580 (1)',
    brand: 'LENOVO / DELL',
    serialNumber: 'Lenovo X1 i7-8565U (2 NEW), Lenovo T495 Ryzen 5 Pro 14" (3 NEW), Dell Latitude E7480 i7 (1), Dell 5580 i7 RAM 16GB (1)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-017',
    code: 'AST-MM-017',
    name: 'Green Screen 3x8m (3), Stand Takara Spirit-3 (10), Tiang Backdrop 4m (3), Clamp (20) & Studio LED Godox SL200II (4)',
    brand: 'Godox / Takara / Custom',
    serialNumber: 'Green Screen 3x8m (3), Stand Takara Spirit-3 (10), Tiang Backdrop 4m (3), Clamp Backdrop (20 Aktif, Hilang 4), Godox SL200II (4)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-018',
    code: 'AST-MM-018',
    name: 'Controller Elgato Stream Deck XL (1), Akai MIDI MIX (2), ICON Platform M+ (1) & ICON Platform X+ (1)',
    brand: 'Elgato / AKAI / ICON',
    serialNumber: 'Stream Deck XL (1), Akai MIDI MIX (2), ICON Platform M+ (1), ICON Platform X+ (1) • Nilai: Rp 14.739.000',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-019',
    code: 'AST-MM-019',
    name: 'Video Switcher DataVideo SE-500 4Ch (1), SE-650 4Ch SDI/HDMI (1) & SE-1200 6Ch SDI/HDMI (1 NEW)',
    brand: 'DATA VIDEO',
    serialNumber: 'SE-500 4Ch 1080P (1 Unit), SE-650 2SDI+2HDMI (1 Unit), SE-1200 4SDI+2HDMI (1 Unit NEW)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-020',
    code: 'AST-MM-020',
    name: 'Video Recorder Vitesse HD 1080 (1 Unit) & Ninja Atomos Inferno (1 Unit)',
    brand: 'Vitesse / NINJA ATOMOS',
    serialNumber: 'Vitesse HD Video Recorder 1080 (1 Unit) & Ninja Atomos Inferno (1 Unit)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-021',
    code: 'AST-MM-021',
    name: 'Clear Com Wireless Intercom UltraLITE Eartec UL5D 5-Person (1 Set) & 4-Person (1 Set - 1 Rusak)',
    brand: 'ULTRALITE EARTEC',
    serialNumber: 'Eartec UL5D 5-Person Full Duplex (1 Set) & UL5D 4-Person Full Duplex (1 Set • Remark: SATU RUSAK)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-022',
    code: 'AST-MM-022',
    name: 'Switch Hub TP-Link 16-Port Gigabit (2), Router Tenda AC23 (1) & UPS APC 1100VA/1200VA (2)',
    brand: 'TP-LINK / Tenda / APC',
    serialNumber: 'TP-Link TL-SG1016D 16-Port (2), Router Tenda AC23 (1), UPS APC BX1100LI-MS (1), UPS APC BVX1200LI-MS (1)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-023',
    code: 'AST-MM-023',
    name: 'HDMI Splitter Vention & Bafo (1x8: 2 Unit, 1x4: 6 Unit, 1x2: 5 Unit - 2 Rusak)',
    brand: 'Vention / BAFO',
    serialNumber: 'Vention 1x8 (2), Vention 1x4 (3 Aktif dari 4 - RUSAK 1), Vention 1x2 (2 Aktif dari 3 - RUSAK 1), 4-In 1x4 (1), Bafo 1x4 (2), Bafo 1x2 (3)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-024',
    code: 'AST-MM-024',
    name: 'Converter, Adapter, Audio Isolator MPOW, HDMI Repeater 8K/4K & Hub LAN Vention',
    brand: 'VENTION / UGREEN / MPOW',
    serialNumber: 'Thunderbolt-HDMI (3), DP-HDMI (7 - RUSAK 1), HDMI-VGA (2), TypeC-HDMI (2), LAN Adapter (3), Noise Isolator MPOW (3 Aktif), Repeater 8K/4K (2), Hub LAN (3)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-025',
    code: 'AST-MM-025',
    name: 'Cabling Multimedia: HDMI Fiber Optic 25M-50M, HDMI 5M/1M, SDI 50M/25M/1M & LAN Cat6 Vention',
    brand: 'VENTION / BAFO',
    serialNumber: 'HDMI FO 30-40M (12 - RUSAK 2), FO 25M Bafo (1 NEW), FO 50M Bafo (2 NEW), HDMI 5M (18), HDMI 1M (10), SDI 50M (7), SDI 25M (1), SDI 1M (4), LAN Cat6 (27)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-026',
    code: 'AST-MM-026',
    name: 'LED Smart TV Coocaa 50" (2 Unit), Coocaa 42" (3 Unit - 1 Rusak), Samsung 42" (1 Rusak) & Weyoon 42" (1 Rusak)',
    brand: 'Coocaa / Samsung / WEYOON',
    serialNumber: 'Coocaa 50" FHD (2 Unit - 1 NEW), Coocaa 42" 42CTC6200 (3 Unit - 1 RUSAK), Samsung 42" (1 RUSAK), Weyoon 42" (1 RUSAK)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. DIVISI VIDEOTRON (LED) — Sheet: INVENTORY LED MAR 2024 (18 MAR 2024)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-led-001',
    code: 'AST-LED-001',
    name: 'LED Visual Yestech Hybrid P3.9 (60 Meter / 30 Box)',
    brand: 'YESTECH',
    serialNumber: 'No. 1 • LED HYBRID P 3.9 (30 BOX) • QTY: 60 Meter',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-002',
    code: 'AST-LED-002',
    name: 'Processor NovaStar VX6s LED Video Processor (2 Unit)',
    brand: 'NOVASTAR',
    serialNumber: 'No. 1b • NovaStar VX6s Led Video Processor • QTY: 2 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-003',
    code: 'AST-LED-003',
    name: 'Panel Listrik LED Kecil (2 Unit), Panel Listrik Besar (1 Unit) & Extension Legrand 3-Out 1-In Fort (2 Unit)',
    brand: 'LEGRAND / Custom',
    serialNumber: 'Panel Listrik Kecil (2 Unit), Panel Listrik Besar (1 Unit), Plug Socket 3 Out 1 In Fort (2 Unit)',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-004',
    code: 'AST-LED-004',
    name: 'Bracket / Clamp LED Yestech (60 Unit)',
    brand: 'YESTECH',
    serialNumber: 'No. 2d • BRACKET LED • QTY: 60 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-005',
    code: 'AST-LED-005',
    name: 'Rigging & Leveling LED: Hambalan Holo (12), Hambalan 2M (10), Hambalan 1M (1), Tiang 1M (24) & Tiang 2M (32)',
    brand: 'Custom Rigging LED',
    serialNumber: 'Hambalan Holo (12), Hambalan 2M (10), Hambalan 1M (1), Tiang 1M (24), Tiang 2M (32)',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-006',
    code: 'AST-LED-006',
    name: 'Pemberat LED (30 Unit), Tali Tambang (5 Roll) & Gantungan Hanging Bar (16 Unit)',
    brand: 'Custom Rigging LED',
    serialNumber: 'Pemberat LED (30 Unit), Tali Tambang (5 Roll), Gantungan (16 Unit)',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-007',
    code: 'AST-LED-007',
    name: 'HDMI Cable Armored 100M (1 Unit), Armored 50M (2 Unit) & Vention 5M/2M/1M 4K (6 Unit)',
    brand: 'ARMORED / VENTION',
    serialNumber: 'HDMI Armored 100M (1), Armored 50M (2), Vention 5M (2), Vention 2M (2), Vention 1M (2)',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-008',
    code: 'AST-LED-008',
    name: 'Network Cable Neutrik LAN RJ45 Cat6/Cat6a SSTP Double-Shielded 100M (10 Unit) & 20M (16 Unit)',
    brand: 'NEUTRIC',
    serialNumber: 'Kabel LAN RJ45 Cat6/Cat6a SSTP Double-Shielded 100M (10 Unit) & 20M (16 Unit)',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-009',
    code: 'AST-LED-009',
    name: 'Cable Panel LED 50M (4 Unit), Cable Panel 50M Steker (1 Unit) & Power Legrand OE',
    brand: 'LEGRAND / Custom',
    serialNumber: 'Cable Panel 50M (4 Unit), Cable Panel 50M Steker (1 Unit), Power Legrand OE',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  }
];
