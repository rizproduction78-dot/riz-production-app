/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * DATA MASTER INVENTARIS ALAT & ASET GUDANG RESMI 2026 PT. RIZ PRODUCTION MULTI KREASI
 * Sumber Referensi Resmi Google Sheet 2026:
 * https://docs.google.com/spreadsheets/d/18UHbZsqbaE66mmpjF37p97wNmM5EheDzyx4lmOOWshk/edit?gid=1322035217#gid=1322035217
 * Spreadsheet ID: 18UHbZsqbaE66mmpjF37p97wNmM5EheDzyx4lmOOWshk (GID Sound 2026: 1322035217)
 *
 * Mencakup 4 Tab Inventaris Resmi 2026 (Total 133 Kelompok Aset Gudang):
 * 1. Inventory LIGHTING 2026 (28 Kelompok Aset • Check by Heri 30 Juni 2026)
 * 2. Inventory SOUND 2026 (70 Kelompok Aset • GID 1322035217 • Update s/d Oktober 2026)
 * 3. INVENTORY STREEMING 2026 (26 Kelompok Aset • Check by Uloh & Chandra 29 Juli 2026)
 * 4. INVENTORY LED 2026 (9 Kelompok Aset • Update 30 September 2026 • LED Hybrid P3.9 80m / 40 Box / 160 Panel)
 */

import { Asset, Finding, WorkOrder, DailyReport, JobAssignment } from '../types';
import { INITIAL_JOB_ASSIGNMENTS } from './jobAssignmentsData';
import {
  CANONICAL_FIRESTORE_FINDINGS,
  CANONICAL_FIRESTORE_WORK_ORDERS,
  CANONICAL_FIRESTORE_DAILY_REPORTS
} from './canonicalFirestoreData';

export const INITIAL_INVENTORY_ASSETS: Asset[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. DIVISI LIGHTING — Sheet: Inventory LIGHTING 2026 (Check by Heri • 30 Juni 2026)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-lgt-001',
    code: 'AST-LGT-001',
    name: 'Moving Beam Centurion C450B (24 Unit)',
    brand: 'CENTURION',
    serialNumber: 'No. 1-24 • QTY: 24 Unit (Ready 24 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-002',
    code: 'AST-LGT-002',
    name: 'Moving Beam Centurion CM550BWS (12 Unit)',
    brand: 'CENTURION',
    serialNumber: 'No. 1-12 • QTY: 12 Unit (Ready 12 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-003',
    code: 'AST-LGT-003',
    name: 'Moving Beam B-EYE K10 (8 Unit)',
    brand: 'B-EYE',
    serialNumber: 'No. 37-44 • QTY: 8 Unit (Ready 8 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-004',
    code: 'AST-LGT-004',
    name: 'Fresnel Spark 200W (13 Unit)',
    brand: 'SPARK',
    serialNumber: 'No. 1-13 • QTY: 13 Unit (Ready 13 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-005',
    code: 'AST-LGT-005',
    name: 'Fresnel AMT Light 300W (8 Unit)',
    brand: 'AMT LIGHT',
    serialNumber: 'No. 1-8 • QTY: 8 Unit (Ready 8 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-006',
    code: 'AST-LGT-006',
    name: 'Par Light TRF A64 (RGB WW) Set A No. 1-24 (24 Unit)',
    brand: 'TRF',
    serialNumber: 'No. 1-24 • QTY: 24 Unit (Ready 24 Unit dari Total 48 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-007',
    code: 'AST-LGT-007',
    name: 'Par Light TRF A64 (RGB WW) Set B No. 25-48 (24 Unit)',
    brand: 'TRF',
    serialNumber: 'No. 25-48 • QTY: 24 Unit (Ready 24 Unit dari Total 48 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-008',
    code: 'AST-LGT-008',
    name: 'Stormy Strobe Light (32 Unit - 2 Error / Ready 30 Unit)',
    brand: 'STORMY',
    serialNumber: 'No. 1-32 • QTY: 32 Unit (Ready 30 Unit • Remark: ERROR 2)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-lgt-009',
    code: 'AST-LGT-009',
    name: 'Wallwasher LED 24x 10 Watt (20 Unit)',
    brand: 'WALLWASER',
    serialNumber: 'No. 1-20 • QTY: 20 Unit (Ready 20 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-010',
    code: 'AST-LGT-010',
    name: 'Follow Spot 7R 230 Spark (2 Unit)',
    brand: 'SPARK',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (Ready 2 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-011',
    code: 'AST-LGT-011',
    name: 'Mini Brute 4 Cell (10 Unit)',
    brand: 'MINI BRUTE',
    serialNumber: 'No. 1-10 • QTY: 10 Unit (Ready 10 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-012',
    code: 'AST-LGT-012',
    name: 'Smoke Machine (5 Unit - 1 Rusak / Ready 4 Unit)',
    brand: 'SMOKE MACHINE',
    serialNumber: 'No. 1-5 • QTY: 5 Unit (Ready 4 Unit • Remark: 1 RUSAK)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-lgt-013',
    code: 'AST-LGT-013',
    name: 'Hazer Machine (4 Unit)',
    brand: 'HAZER',
    serialNumber: 'No. 1-4 • QTY: 4 Unit (Ready 4 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-014',
    code: 'AST-LGT-014',
    name: 'Mixer Lighting Grand MA 2 Full (1 Unit) & Command Wing MA (1 Unit)',
    brand: 'MA',
    serialNumber: 'Grand MA 2 (1 Unit) & Command Wing MA (1 Unit) • QTY: 2 Unit (Ready 2 Unit)',
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
    serialNumber: 'QTY: 1 Unit (Ready 1 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-016',
    code: 'AST-LGT-016',
    name: 'Mixer Lighting Avolites Tiger Touch II (1 Unit)',
    brand: 'AVOLITES',
    serialNumber: 'QTY: 1 Unit (Ready 1 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-017',
    code: 'AST-LGT-017',
    name: 'Splitter DMX C-Artnet (1 Unit)',
    brand: 'C-ARTNET',
    serialNumber: 'No. 221 • QTY: 1 Unit (Ready 1 Unit)',
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
    serialNumber: 'QTY: 1 Unit (Kondisi: MATI SURI)',
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
    serialNumber: 'No. 217-220 • QTY: 4 Unit (Ready 4 Unit)',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-020',
    code: 'AST-LGT-020',
    name: 'Stand Lighting Double Stand (6 Unit)',
    brand: 'DOUBLE STAND',
    serialNumber: 'No. 222-227 • QTY: 6 Unit (Ready 6 Unit)',
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
    serialNumber: 'No. 228 • QTY: 1 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-022',
    code: 'AST-LGT-022',
    name: 'Kabel Link Baru DMX / Power 100M (1), 75M Rolan (1), 50M (2), 25M (8) & 10M (50) (62 Unit)',
    brand: 'CABLE LINK',
    serialNumber: '100M (1), 75M Rolan (1), 50M (2), 25M (8), 10M (50) • QTY: 62 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-023',
    code: 'AST-LGT-023',
    name: 'Kabel Link Baru DMX / Power 5M (28 Unit) & 2M (41 Unit) (69 Unit)',
    brand: 'CABLE LINK',
    serialNumber: '5M (28 Unit), 2M (41 Unit) • QTY: 69 Unit',
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
    serialNumber: 'No. 244 • XLR Link Pendek • QTY: 1 Lot',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-025',
    code: 'AST-LGT-025',
    name: 'Kabel Extension Lighting 25M (6 Unit), 10M (6 Unit) & 5M (43 Unit) (55 Unit)',
    brand: 'TAMBAHAN',
    serialNumber: '25M (6 Unit), 10M (6 Unit), 5M (43 Unit) • QTY: 55 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-026',
    code: 'AST-LGT-026',
    name: 'Kabel Power 4 X 2.5 25M (4 Unit)',
    brand: 'TAMBAHAN',
    serialNumber: '25M (4 Unit) • QTY: 4 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-027',
    code: 'AST-LGT-027',
    name: 'Cover Minibrute (10 Unit), Cover Fresnel 200 (12 Unit) & Cover Fresnel 300 (4 Unit) (26 Unit)',
    brand: 'COVER LIGHTING',
    serialNumber: 'Cover Minibrute (10), Cover Fresnel 200 (12), Cover Fresnel 300 (4) • QTY: 26 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-lgt-028',
    code: 'AST-LGT-028',
    name: 'Cover Beam (20 Unit), Cover Parled (19 Unit) & Cover Stormy (16 Unit) (55 Unit)',
    brand: 'COVER LIGHTING',
    serialNumber: 'Cover Beam (20 Unit), Cover Parled (19 Unit), Cover Stormy (16 Unit) • QTY: 55 Unit',
    division: 'Lighting',
    location: 'Gudang Utama RIZ - Zona Lighting',
    condition: 'Baik',
    repairHistory: []
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. DIVISI SOUND (AUDIO) — Sheet: Inventory SOUND 2026 (GID 1322035217)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-aud-001',
    code: 'AST-AUD-001',
    name: 'PA Speaker RCF 4Pro 6001-A (4 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-002',
    code: 'AST-AUD-002',
    name: 'PA Speaker Line Array Audio Center Avanda 210 (24 Unit)',
    brand: 'AUDIO CENTER',
    serialNumber: 'No. 1-24 • QTY: 24 Unit (Masuk 8 Sept 2025)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-003',
    code: 'AST-AUD-003',
    name: 'Flying Bar Audio Center Line Array (4 Unit)',
    brand: 'AUDIO CENTER',
    serialNumber: 'No. 270 • QTY: 4 Unit (Masuk 8 Sept 2025)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-004',
    code: 'AST-AUD-004',
    name: 'Sub Single Audio Center T115S-DSP (2 Unit)',
    brand: 'AUDIO CENTER',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (Masuk 14 Feb 2025)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-005',
    code: 'AST-AUD-005',
    name: 'Sub Double Audio Center Avanda 218A (16 Unit)',
    brand: 'AUDIO CENTER',
    serialNumber: 'No. 1-16 • QTY: 16 Unit (Masuk 8 Sept 2025)',
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
    name: 'Monitor Speaker RCF ART-312A (4 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-4 • QTY: 4 Unit (Masuk 14 Feb 2025)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-008',
    code: 'AST-AUD-008',
    name: 'Sub Single RCF 4 PRO 8001 (2 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-009',
    code: 'AST-AUD-009',
    name: 'Sub Single RCF 4 PRO 8002 (2 Unit)',
    brand: 'RCF',
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
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
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
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
    name: 'Monitor Speaker dB Technologies Opera 15 (18 Unit)',
    brand: 'DB TECH',
    serialNumber: 'No. 1-18 • QTY: 18 Unit (16 Unit + 2 Masuk 14 Feb 2025)',
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
    name: 'Digital Mixer Midas M32 R (2 Unit)',
    brand: 'MIDAS',
    serialNumber: 'No. 1-2 • QTY: 2 Unit',
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
    serialNumber: 'No. 1-3 • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-016',
    code: 'AST-AUD-016',
    name: 'Digital Mixer Midas HERITAGE-D (2 Unit) & Yamaha TF 1 (1 Unit)',
    brand: 'MIDAS / YAMAHA',
    serialNumber: 'Midas HERITAGE-D (2 Unit • Masuk Juli & Sept 2025) & Yamaha TF 1 (1 Unit) • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-017',
    code: 'AST-AUD-017',
    name: 'Analog Mixer Yamaha MG16 (1 Unit), MG12 (1 Unit) & MG8 (1 Unit)',
    brand: 'YAMAHA',
    serialNumber: 'Yamaha MG16 (1), MG12 (1), MG8 (1) • QTY: 3 Unit',
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
    serialNumber: 'QTY: 1 Unit',
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
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-020',
    code: 'AST-AUD-020',
    name: 'IO / Stage Box Midas DL 251 (2 Unit)',
    brand: 'MIDAS',
    serialNumber: 'No. 1-2 • QTY: 2 Unit (Masuk 10 Juli & 8 Sept 2025)',
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
    serialNumber: 'QTY: 1 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-022',
    code: 'AST-AUD-022',
    name: 'Instrument Drum Tama Star Classic (1 Set) & Cymbal Set Kingdo (1 Set)',
    brand: 'TAMA / KINGDO',
    serialNumber: 'Tama Star Classic (1 Set • Masuk 5 Okt 2025) & Cymbal Kingdo (1 Set • Masuk 20 Juli 2025) • QTY: 2 Set',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-023',
    code: 'AST-AUD-023',
    name: 'Instrument Drum Yamaha Tour Custom (1 Set)',
    brand: 'YAMAHA',
    serialNumber: 'QTY: 1 Set (Masuk 20 Juli 2025)',
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
    serialNumber: 'QTY: 1 Set',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-025',
    code: 'AST-AUD-025',
    name: 'Instrument Drum Electric Yamaha DTX-6 (1 Set)',
    brand: 'YAMAHA',
    serialNumber: 'QTY: 1 Set (Masuk 14 Feb 2025)',
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
    serialNumber: 'QTY: 1 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-027',
    code: 'AST-AUD-027',
    name: 'Instrument Amply Gallien-Krueger GK 1001RB (2 Unit) & Ampeg SVT-4PRO (1 Unit)',
    brand: 'Gallien-Krueger / Ampeg',
    serialNumber: 'GK 1001RB (2 Unit) & Ampeg SVT-4PRO (1 Unit • Masuk 20 Juli 2025) • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-028',
    code: 'AST-AUD-028',
    name: 'Instrument Amply Roland KC-550 (3 Unit)',
    brand: 'Roland',
    serialNumber: 'No. 1-3 • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-029',
    code: 'AST-AUD-029',
    name: 'Instrument Amply Marshall JCM 900 (3 Unit)',
    brand: 'Marshall',
    serialNumber: 'No. 1-3 • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-030',
    code: 'AST-AUD-030',
    name: 'Instrument Keyboard Roland RD 700 NX (1 Unit) & Roland RD 700 GX (1 Unit)',
    brand: 'Roland',
    serialNumber: 'Roland RD 700 NX (1 Unit) & Roland RD 700 GX (1 Unit) • QTY: 2 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-031',
    code: 'AST-AUD-031',
    name: 'Instrument Keyboard Roland RD 800 (1 Unit), Roland RD 2000 (1 Unit) & Yamaha PSR (1 Unit)',
    brand: 'Roland / YAMAHA',
    serialNumber: 'Roland RD 800 (1), Roland RD 2000 (1), Yamaha PSR (1) • QTY: 3 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-032',
    code: 'AST-AUD-032',
    name: 'Microphone Wireless Sennheiser EW-D EM (e835) (18 Unit)',
    brand: 'SENNHEISER',
    serialNumber: 'No. 1-18 (16 Unit + 2 Masuk 1 Okt 2026) • QTY: 18 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-033',
    code: 'AST-AUD-033',
    name: 'Microphone Wireless Sennheiser EWD Clipon (2 Unit), G3 Clipon (3 Unit) & Antenna Dist EWD ASA (2 Unit)',
    brand: 'SENNHEISER',
    serialNumber: 'EWD Clipon (2), G3 Clipon (3), Antenna Distributor EWD ASA (2) • QTY: 7 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-034',
    code: 'AST-AUD-034',
    name: 'Microphone Wireless Shure SLXD4 (8 Unit), Shure QLXD4 (4 Unit) & Bodypack SLXD4 (1 Unit)',
    brand: 'SHURE',
    serialNumber: 'Shure SLXD4 (8 Unit), Shure QLXD4 (4 Unit), Shure Bodypack SLXD4 (1 Unit) • QTY: 13 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-035',
    code: 'AST-AUD-035',
    name: 'Antenna Distributor Shure UA844 + SWB (4 Unit)',
    brand: 'SHURE',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
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
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-037',
    code: 'AST-AUD-037',
    name: 'Microphone Wireless Headset QA HMD46PRO (4 Unit)',
    brand: 'QA',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-038',
    code: 'AST-AUD-038',
    name: 'Microphone Cable Shure SM57 (25 Unit)',
    brand: 'SHURE',
    serialNumber: 'No. 1-25 • QTY: 25 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-039',
    code: 'AST-AUD-039',
    name: 'Microphone Cable Shure SM58 (22 Unit - 4 Hilang)',
    brand: 'SHURE',
    serialNumber: 'No. 1-22 • QTY: 22 Unit (18 Aktif • Remark: 4 hilang)',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-aud-040',
    code: 'AST-AUD-040',
    name: 'Microphone Cable VXT-TX300 / VXT-TX301 (13 Unit)',
    brand: 'VXT',
    serialNumber: 'No. 1-13 • QTY: 13 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
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
    name: 'Microphone Gooseneck Hardwell (7 Unit)',
    brand: 'HARDWELL',
    serialNumber: 'No. 1-7 • QTY: 7 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-043',
    code: 'AST-AUD-043',
    name: 'Microphone Gooseneck Shure MX418DC (2 Unit)',
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
    name: 'Microphone Drum Set A (Audix D6, Shure Beta 56A, SM57, 4x E604 - 7 Unit)',
    brand: 'AUDIX / SHURE / SENNHEISER',
    serialNumber: 'Audix D6 (1), Shure Beta 56A (1), SM57 (1), Sennheiser E604 (4) • QTY: 7 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-045',
    code: 'AST-AUD-045',
    name: 'Microphone Drum Set B (Beta 52A, 2x SM57, 4x E604) & Set C (Beta 52A, SM57, 4x E904) (13 Unit)',
    brand: 'SHURE / SENNHEISER',
    serialNumber: 'Set B (7 Pcs) & Set C (6 Pcs) • QTY: 13 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-046',
    code: 'AST-AUD-046',
    name: 'Microphone Drum Set AKG (D112 MKII, 4x P4, 2x P17 - 7 Pcs) & Takstar Drum Set (2 Set)',
    brand: 'AKG / TAKSTAR',
    serialNumber: 'AKG Drum Set (7 Pcs) & Takstar Drum Set (2 Set) • QTY: 9 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-047',
    code: 'AST-AUD-047',
    name: 'DI-Box Behringer Ultra-DI DI100 (8 Unit)',
    brand: 'Behringer',
    serialNumber: 'No. 1-8 • QTY: 8 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-048',
    code: 'AST-AUD-048',
    name: 'DI-Box Samson MDA1 Mono Active (15 Unit) & Samson S-Direct (3 Unit)',
    brand: 'SAMSON',
    serialNumber: 'Samson MDA1 (15 Unit) & Samson S-Direct (3 Unit) • QTY: 18 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-049',
    code: 'AST-AUD-049',
    name: 'DI-Box Klark Teknik DN10A Active (20 Unit) & Klark Teknik DN100 (2 Unit)',
    brand: 'KLARK TEKNIK',
    serialNumber: 'Klark Teknik DN10A (20 Unit • Masuk 20 Juli 2025) & DN100 (2 Unit) • QTY: 22 Unit',
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
    name: 'Microphone Condenser AKG C-1000 (15 Unit)',
    brand: 'AKG',
    serialNumber: 'No. 1-15 • QTY: 15 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-052',
    code: 'AST-AUD-052',
    name: 'Microphone Condenser JTS TX-9 (3 Unit), JTS NX-9 (1 Unit) & AKG C411 (3 Unit)',
    brand: 'JTS / AKG',
    serialNumber: 'JTS TX-9 (3 Unit), JTS NX-9 (1 Unit), AKG C411 (3 Unit) • QTY: 7 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-053',
    code: 'AST-AUD-053',
    name: 'Microphone Kick In/Out Shure Beta 91A (4 Unit), Beta 52A (3 Unit), Behringer BA19A (1) & Shure SM81 (1)',
    brand: 'SHURE / BEHRINGER',
    serialNumber: 'Shure Beta 91A (4), Beta 52A (3), Behringer BA19A (1), Shure SM81 (1) • QTY: 9 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-054',
    code: 'AST-AUD-054',
    name: 'Microphone RTA & Condenser Earthworks M50 (1), Behringer ECM800 (1), Melab (1), QA (1) & Superlux (2)',
    brand: 'EARTHWORKS / BEHRINGER / SUPERLUX',
    serialNumber: 'Earthworks M50 (1), Behringer ECM800 (1), Melab (1), QA (1), Superlux (2) • QTY: 6 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-055',
    code: 'AST-AUD-055',
    name: 'In-Ear Monitor (IEM) Sennheiser SR IEM G4 (8 Unit), Combiner AC 41 + ADP UHF (1) & Mipro MI-58 (1)',
    brand: 'SENNHEISER / MIPRO',
    serialNumber: 'Sennheiser SR IEM G4 (8 Unit), Combiner AC 41 + ADP UHF (1 Unit), Mipro MI-58 (1 Unit) • QTY: 10 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-056',
    code: 'AST-AUD-056',
    name: 'Speaker Management DLMS Xilica XP4080 (1), Marani MIR 480i (2), Marani MIR 480A (1) & FIR408 (1)',
    brand: 'XILICA / MARANI / PRECISION DRIVE',
    serialNumber: 'Xilica XP4080 (1), Marani MIR 480i (2), Marani MIR 480A (1), Precision Drive FIR408 (1) • QTY: 5 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-057',
    code: 'AST-AUD-057',
    name: 'Audio Splitter 32CH Switch A+B (1), 32CH A+B+C (1), 48CH A+B+C (1) & Splitter AUX (1)',
    brand: 'Custom',
    serialNumber: 'Splitter 32CH A+B (1), 32CH A+B+C (1), 48CH A+B+C (1), Splitter AUX (1) • QTY: 4 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-058',
    code: 'AST-AUD-058',
    name: 'Kabel LAN Belden 75M Abu-Abu (7 Roll), LAN 75M Ungu (2 Roll), Kabel Optik 250M (1) & Extender DN9680 (1)',
    brand: 'BELDEN / KLARK TEKNIK',
    serialNumber: 'LAN Belden 75M Abu2 (7), LAN 75M Ungu (2), Kabel Optik 250M (1), Extender Optik DN9680 (1) • QTY: 11 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-059',
    code: 'AST-AUD-059',
    name: 'Cable XLR Canare 10 Meter (306 Unit) & Cable XLR Galileo (29 Unit)',
    brand: 'Canare / Galileo',
    serialNumber: 'XLR Canare 10M (306 Unit) & XLR Galileo (29 Unit) • QTY: 335 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-060',
    code: 'AST-AUD-060',
    name: 'Cable Jack to Jack Canare (58 Unit)',
    brand: 'Canare',
    serialNumber: 'No. 233 • QTY: 58 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-061',
    code: 'AST-AUD-061',
    name: 'Kabel Rumbai Panjang (10), Rumbai Pendek (16), Rumbai Drum Canare (1) & Snake Box 8/16/24CH (10)',
    brand: 'Canare / Custom',
    serialNumber: 'Rumbai Panjang (10), Pendek (16), Drum (1), Junction AUX (1), Snake 8CH (1), Biru 16CH (3), Hitam 16CH (4), Orange 24CH (1) • QTY: 37 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-062',
    code: 'AST-AUD-062',
    name: 'Stand Speaker LB720 (24 Unit)',
    brand: 'LB720',
    serialNumber: 'No. 247 • QTY: 24 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-063',
    code: 'AST-AUD-063',
    name: 'Stand Mic Hercules MS33B (44 Unit), Stand Mic Pendek Samson (5 Unit) & Hercules Pendek (5 Unit)',
    brand: 'Hercules / Samson',
    serialNumber: 'Hercules MS33B (44 Unit), Samson Pendek (5 Unit), Hercules Pendek (5 Unit) • QTY: 54 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-064',
    code: 'AST-AUD-064',
    name: 'Stand Keyboard Double Hercules KS 410B (3 Unit) & Single KS 120B (4 Unit)',
    brand: 'Hercules',
    serialNumber: 'KS 410B Double (3 Unit) & KS 120B Single (4 Unit) • QTY: 7 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-065',
    code: 'AST-AUD-065',
    name: 'Stand Book Superior (12 Unit)',
    brand: 'Superior',
    serialNumber: 'No. 253 • QTY: 12 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-066',
    code: 'AST-AUD-066',
    name: 'Stand Guitar Single Hercules (4 Unit) & Double GS 422B (2 Unit)',
    brand: 'Hercules',
    serialNumber: 'Single Guitar Stand (4 Unit) & Double GS 422B (2 Unit) • QTY: 6 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-067',
    code: 'AST-AUD-067',
    name: 'Panel Box Custom 3Phase (1 Unit), Panel Legrand 6 Port (2 Unit) & Reglan Panel Orange (23 Unit)',
    brand: 'Legrand / Custom',
    serialNumber: 'Panel 3Phase (1), Panel Legrand 6 Port (2), Reglan Panel Orange 1 (14) & Orange 2 (9) • QTY: 26 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-068',
    code: 'AST-AUD-068',
    name: 'Kabel Listrik Eterna 50M (8 Unit), Eterna 5M-15M (117 Unit) & Kabel Panel Jembo 10M/24M/25M (6 Unit)',
    brand: 'Eterna / Jembo',
    serialNumber: 'Eterna 50M (4), 50M 4x4 (3), 50M 4x5 (1), Eterna 5M-15M (117), Jembo 10M (1), 25M (1), 24M (4) • QTY: 131 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-aud-069',
    code: 'AST-AUD-069',
    name: 'Stabilizer Stavolt 3000Va (4), UPS ICA CP700 (2), CP1400 (2), iPad Gen 10 (2) & Router AX23 (2)',
    brand: 'Stavolt / ICA / Apple / TP-Link',
    serialNumber: 'Stavolt 3000Va (4), UPS ICA CP700 (2), CP1400 (2), Apple iPad Gen 10 (2), Router TP-Link AX23 (2) • QTY: 12 Unit',
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
    serialNumber: 'No. 256-259 • Takel 2T (2), Takel 1T (8), Strap 2T 3M (12), Booster Pasline (4) • QTY: 26 Unit',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    repairHistory: []
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. DIVISI MULTIMEDIA — Sheet: INVENTORY STREEMING 2026 (Check by Uloh & Chandra • 29 Juli 2026)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-mm-001',
    code: 'AST-MM-001',
    name: 'PC Streaming 1 Workstation (Intel Core i9 14900KF, RTX A5000 24GB, 128GB DDR5, DeckLink Quad SDI + VMOX 4-HDMI)',
    brand: 'Intel / Leadtek Quadro / MSI',
    serialNumber: 'i9-14900KF 24C/32T, Leadtek RTX A5000 24GB, MSI PRO Z790-A MAX WIFI, 128GB Corsair DDR5, DeckLink Quad SDI + VMOX 4-HDMI • QTY: 1 Set',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-002',
    code: 'AST-MM-002',
    name: 'PC Streaming 2 Workstation (Intel Core i9 14900KF, RTX 3070 8GB, 128GB DDR5, VMOX 4-HDMI + DeckLink HDMI)',
    brand: 'Intel / MSI / Corsair',
    serialNumber: 'i9-14900KF 24C/32T, MSI RTX 3070 Gaming X Trio 8GB, MSI PRO Z790-A MAX WIFI, 128GB Corsair DDR5, VMOX 4-HDMI + DeckLink • QTY: 1 Set',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-003',
    code: 'AST-MM-003',
    name: 'PC Streaming 3 Workstation (Intel Core i9 10920X, RTX 3070Ti 8GB, 48GB DDR4, Elgato Cam Link Pro 4-HDMI)',
    brand: 'Intel / Gigabyte Aorus / MSI',
    serialNumber: 'i9-10920X 12C/24T, RTX 3070Ti Gaming X Trio 8GB, X299X Aorus Master, 48GB DDR4, Elgato Cam Link Pro 4K30 • QTY: 1 Set',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-004',
    code: 'AST-MM-004',
    name: 'Video Capture Card Acasis HD33 (1 Unit), Acasis HD31 (2 Unit) & Hagibis LNM-318 4K (2 Unit)',
    brand: 'ACASIS / HAGIBIS',
    serialNumber: 'Acasis HD 33 1080P (1 Unit), Acasis HD 31 1080P (2 Unit), Hagibis LNM-318 4K (2 Unit) • QTY: 5 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-005',
    code: 'AST-MM-005',
    name: 'Video Capture Card Vention USB-HDMI (2 Unit), Ezcap HD60 (3 Unit) & Ezcap Game Link Raw 4K30 (1 Unit)',
    brand: 'VENTION / EZCAP',
    serialNumber: 'Vention ACW USB-HDMI (2 Unit), Ezcap HD60 (3 Unit), Ezcap Game Link Raw 4K30 (1 Unit) • QTY: 6 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-006',
    code: 'AST-MM-006',
    name: 'Audio Soundcard Behringer Xenyx QX1002USB (1 Unit), ISK DS-1 (1 Unit) & SSL Soundcard (2 Unit)',
    brand: 'BEHRINGER / ISK / SSL',
    serialNumber: 'Behringer Xenyx QX1002USB (1 Unit), ISK DS-1 (1 Unit), SSL Soundcard (2 Unit) • QTY: 4 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-007',
    code: 'AST-MM-007',
    name: 'Audio Soundcard Hardwell Optimus 4 Channel (2 Unit - 1 Rusak)',
    brand: 'HARDWELL',
    serialNumber: 'Hardwell Optimus 4 Channel • QTY: 2 Unit (1 Aktif • Remark: 1 Rusak)',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-008',
    code: 'AST-MM-008',
    name: 'Camcorder Sony HXR-NX100 FHD NXCAM (4 Unit)',
    brand: 'CAMCORDER SONY',
    serialNumber: 'No. 1-4 • QTY: 4 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-009',
    code: 'AST-MM-009',
    name: 'Camcorder Sony PXW-Z190 4K 3-CMOS XDCAM (4 Unit) & Camera PTZ Feelworld (1 Unit)',
    brand: 'CAMCORDER SONY / FEELWORLD',
    serialNumber: 'Sony PXW-Z190 4K (4 Unit) & Camera PTZ Feelworld (1 Unit) • QTY: 5 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-010',
    code: 'AST-MM-010',
    name: 'Remote Control Kamera Libec ZFC-5HD Zoom (3 Unit) & Battery Pack Livegear NPF-970 (2) / Sony BP-U100 (2)',
    brand: 'LIBEC / LIVEGEAR / SONY',
    serialNumber: 'Libec ZFC-5HD (3 Unit), Battery Livegear NPF-970 (2 Unit), Battery Sony BP-U100 PXW (2 Unit) • QTY: 7 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-011',
    code: 'AST-MM-011',
    name: 'Tripod Kamera Libec 650EX (4 Unit), Libec TH-X (4 Unit) & Sirui SH-5 (1 Unit)',
    brand: 'LIBEC / SIRUI',
    serialNumber: 'Libec 650EX (4 Unit), Libec TH-X (4 Unit), Sirui SH-5 (1 Unit) • QTY: 9 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-012',
    code: 'AST-MM-012',
    name: 'Wireless Cam Accsoon CineEye II Pro (2 Unit) & Hollyland Cosmo C1 FullHD (2 Unit)',
    brand: 'ACCSON / HOLLYLAND',
    serialNumber: 'Accsoon CineEye II Pro (2 Unit) & Hollyland Cosmo C1 FullHD (2 Unit) • QTY: 4 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-013',
    code: 'AST-MM-013',
    name: 'Memory Cam SanDisk Extreme PRO SDXC UHS-I 256GB (1 Unit)',
    brand: 'SANDISK',
    serialNumber: 'SanDisk Extreme PRO 256GB • QTY: 1 Unit',
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
    serialNumber: 'Micro Converter HDMI to SDI 3G (3 Unit) & SDI to HDMI 3G (1 Unit) • QTY: 4 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-015',
    code: 'AST-MM-015',
    name: 'Video Switcher Blackmagic ATEM HD/4K 8CH (1 Unit), Blackmagic 4K 8-Input (1 Unit) & PTZ Keyboard (1 Unit)',
    brand: 'BLACKMAGIC DESIGN / FEELWORLD',
    serialNumber: 'Blackmagic ATEM HD/4K 8CH (1), Blackmagic 4K 8-Input (1), PTZ Keyboard Controller (1) • QTY: 3 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-016',
    code: 'AST-MM-016',
    name: 'Laptop Operasional Lenovo ThinkPad T495 Ryzen 5 Pro 14" (3 Unit)',
    brand: 'LENOVO',
    serialNumber: 'Lenovo ThinkPad T495 AMD Ryzen 5 Pro 3500U 14" FHD • QTY: 3 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-017',
    code: 'AST-MM-017',
    name: 'Green Screen 3x8m (3), Stand Takara Spirit-3 (10), Tiang Backdrop 4m (9), Clamp (24) & Studio LED Godox SL200II (4)',
    brand: 'Godox / Takara / Custom',
    serialNumber: 'Green Screen 3x8m (3), Stand Takara Spirit-3 (10), Tiang Backdrop 4m (9), Clamp Backdrop (24), Godox SL200II (4) • QTY: 50 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-018',
    code: 'AST-MM-018',
    name: 'Controller Elgato Stream Deck XL (1 Unit) & Akai Professional MIDI MIX (2 Unit)',
    brand: 'Elgato / AKAI',
    serialNumber: 'Stream Deck XL (1 Unit) & Akai Professional MIDI MIX (2 Unit) • QTY: 3 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-019',
    code: 'AST-MM-019',
    name: 'Video Switcher DataVideo SE-650 4Ch SDI/HDMI (1 Unit) & DataVideo SE-1200MU 6Ch SDI/HDMI (1 Unit)',
    brand: 'DATA VIDEO',
    serialNumber: 'DataVideo SE-650 2SDI+2HDMI (1 Unit) & DataVideo SE-1200MU 4SDI+2HDMI (1 Unit) • QTY: 2 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-020',
    code: 'AST-MM-020',
    name: 'Video Recorder Shimbol Memory Recorder HD (1 Unit) & Blackmagic HyperDeck HD Recorder (1 Unit)',
    brand: 'SHIMBOL / BLACKMAGIC DESIGN',
    serialNumber: 'Shimbol Video Memory Recorder HD 1080 (1 Unit) & Blackmagic HyperDeck HD Recorder (1 Unit) • QTY: 2 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-021',
    code: 'AST-MM-021',
    name: 'Clear Com Intercom Eartec UL5D 5-Person (4 - 1 Rusak), 4-Person (3 - 1 Rusak) & Hollyland Solidcom SE (5)',
    brand: 'ULTRALITE EARTEC / HOLLYLAND',
    serialNumber: 'Eartec UL5D 5-Person (4 Unit - 1 Rusak), UL5D 4-Person (3 Unit - 1 Rusak), Hollyland Solidcom SE (5 Unit) • QTY: 12 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-022',
    code: 'AST-MM-022',
    name: 'Switch Hub TP-Link 16-Port Gigabit (2 Unit) & UPS APC BVX1200LI-MS 1200VA (1 Unit - Rusak)',
    brand: 'TP-LINK / APC',
    serialNumber: 'TP-Link TL-SG1016D 16-Port (2 Unit) & UPS APC BVX1200LI-MS 1200VA (1 Unit • Remark: Rusak) • QTY: 3 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-023',
    code: 'AST-MM-023',
    name: 'HDMI Splitter Vention 1x8 (2 Unit), PX HDMI (2 Unit), Cable Time 1x4 (2 Unit) & Vention 1x4 (2 Unit)',
    brand: 'Vention / PX / Cable Time',
    serialNumber: 'Vention 1x8 (2), PX (2), Cable Time 1x4 (2), Vention 1x4 (2) • QTY: 8 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-mm-024',
    code: 'AST-MM-024',
    name: 'Converter & Adapter: Thunderbolt-HDMI (4), DP-HDMI (4 - 1 Rusak), MPOW (5 - 3 Rusak), Repeater 8K/4K (3) & Hub LAN (9)',
    brand: 'VENTION / UGREEN / MPOW',
    serialNumber: 'TB-HDMI (4), DP-HDMI (4 - 1 Rusak), HDMI-VGA (2), TypeC-HDMI (2), LAN Adapter (6), MPOW (5 - Rusak 3), Repeater 8K/4K (3), Hub LAN (3), XLR-3.5mm (3) • QTY: 32 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-025',
    code: 'AST-MM-025',
    name: 'Cabling Multimedia: HDMI FO 25M-50M (21 - 3 Rusak), HDMI 5M/1M/Optic (40 - 3 Rusak), SDI (12) & LAN Vention (33 - 6 Rusak)',
    brand: 'VENTION / BAFO',
    serialNumber: 'HDMI FO 30-40M (10 - Rusak 2), Bafo 25M FO (8), Vention 5M (21 - Rusak 3), FO 50M (3 - Rusak 1), HDMI 1M (14), Optic 100M (1), Surge (4), SDI (12), LAN Cat6 (33 - Hilang/Rusak 6) • QTY: 106 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-mm-026',
    code: 'AST-MM-026',
    name: 'LED Smart TV Samsung 50" (4), Coocaa 50" (2 - 1 Rusak), Samsung 42" (2), Coocaa 42" (3 - 2 Rusak), Standing (5) & Matador (6)',
    brand: 'Samsung / Coocaa',
    serialNumber: 'Samsung 50" (4), Coocaa 50" (2 - Rusak 1), Samsung 42" (2), Coocaa 42" (3 - Rusak 2), Standing TV (5), Matador TV (6) • QTY: 22 Unit',
    division: 'Multimedia',
    location: 'Gudang Utama RIZ - Zona Multimedia',
    condition: 'Rusak Ringan',
    repairHistory: []
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. DIVISI VIDEOTRON (LED) — Sheet: INVENTORY LED 2026 (Update 30 September 2026)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ast-led-001',
    code: 'AST-LED-001',
    name: 'LED Visual Yestech Hybrid P3.9 (80 Meter / 40 Box / 160 Panel)',
    brand: 'YESTECH',
    serialNumber: 'No. 1 • LED HYBRID P 3.9 40 BOX (80 Meter / 160 Panel) • QTY: 40 Box',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-002',
    code: 'AST-LED-002',
    name: 'Processor NovaStar VX600s (3 Unit), NovaStar VX1000 (2 Unit), NovaStar VX1000 Pro (2 Unit) & TB (1 Unit)',
    brand: 'NOVASTAR',
    serialNumber: 'NovaStar VX600s (3 Unit), VX1000 (2 Unit), VX1000 Pro (2 Unit), Processor TB (1 Unit) • QTY: 8 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-003',
    code: 'AST-LED-003',
    name: 'Laptop Produksi LED (MSI Katana RTX4060, Cyborg, GP66 RTX3060, ROG Strix RTX4050, Alienware RTX3080) (5) & Capture/Soundcard LED (19)',
    brand: 'MSI / ASUS ROG / ALIENWARE / ELGATO',
    serialNumber: 'Laptop LED (5 Unit), Soundcard UMC202HD/402HD/Scarlett (4 Unit), Capture Card Elgato/Ezcap/Vention (12 Unit), USB Hub (3 Unit) • QTY: 24 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-004',
    code: 'AST-LED-004',
    name: 'Bracket / Clamp LED Yestech (80 Unit - 1 Hilang Penyodok)',
    brand: 'YESTECH',
    serialNumber: 'No. 2h • BRACKET LED • QTY: 80 Unit (79 Layak • Remark: 1 Hilang Penyodok)',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-led-005',
    code: 'AST-LED-005',
    name: 'Rigging 20x20 (20), Level LED 2x1 & 1x1 (17), Kaki Tiang & Shoks (206), Hambalan (16) & Tiang Frame 1M/2M (68 - 1 Patah)',
    brand: 'Custom Rigging LED',
    serialNumber: 'Rigging 20x20 (20), Level LED (17), Kaki Tiang 1M-20cm + Shoks (206), Hambalan 2M/1M/50cm (16), Tiang 1M (26 - Patah 1), Tiang 2M (42) • QTY: 327 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-led-006',
    code: 'AST-LED-006',
    name: 'Pemberat LED (38 Unit), Hanging Bar Yestech (17 Unit), Tali Tambang (5), Tali Strap (18) & Cooling Pad (3)',
    brand: 'YESTECH / Custom Rigging LED',
    serialNumber: 'Pemberat LED (38), Hanging Bar Yestech (17), Tali Tambang (5), Strap Ungu Kecil (12), Strap Panjang (6), Cooling Pad (3) • QTY: 81 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Baik',
    repairHistory: []
  },
  {
    id: 'ast-led-007',
    code: 'AST-LED-007',
    name: 'HDMI Armored 100M (4 - 2 Rusak), Armored 50M (2), Vention (6), Kabel Optik 300M (1), Extender Optik (4) & HDMI Optic/4K (7)',
    brand: 'ARMORED / VENTION / OPTIC',
    serialNumber: 'HDMI Armored 100M (4 - Rusak 2), Armored 50M (2), Vention 5M/2M/1M (6), Optik 300M (1), Extender Optik (4), HDMI Optic 100M (2), Converter 4K (5) • QTY: 24 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-led-008',
    code: 'AST-LED-008',
    name: 'Network Cable Neutrik LAN RJ45 Cat6a SSTP 100M (16 Unit - 1 Hilang), 50M (3 Unit), 20M (26 Unit) & Barel LAN (14 Unit)',
    brand: 'NEUTRIC',
    serialNumber: 'Neutrik Cat6a 100M (16 - Hilang 1), 50M (3), 20M (26), Barel LAN (14) • QTY: 59 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Rusak Ringan',
    repairHistory: []
  },
  {
    id: 'ast-led-009',
    code: 'AST-LED-009',
    name: 'Panel Listrik 12 Port (5 - 1 Panel Check R), Panel 6 Port (1), Cable Panel 50M (5), Power & Konektor Legrand (60) & Terminal (6)',
    brand: 'LEGRAND / Custom',
    serialNumber: 'Panel 12 Port (5 - 1 Check R), Panel 6 Port (1), Cable Panel 50M (5), Power Legrand (23), Konektor Legrand/Speakon (37), Terminal (6) • QTY: 77 Unit',
    division: 'Videotron',
    location: 'Gudang Utama RIZ - Zona Videotron',
    condition: 'Rusak Ringan',
    repairHistory: []
  }
];

export type InventoryTypeIconKey =
  | 'speaker'
  | 'sliders'
  | 'cpu'
  | 'music'
  | 'radio'
  | 'mic'
  | 'layers'
  | 'zap'
  | 'lightbulb'
  | 'sparkles'
  | 'monitor'
  | 'camera'
  | 'tv'
  | 'video'
  | 'package';

export interface InventoryAssetTypeInfo {
  typeGroup: string;
  shortTypeLabel: string;
  typeOrder: number;
  iconKey: InventoryTypeIconKey;
  bgClass: string;
  textClass: string;
  borderClass: string;
  headerBgClass: string;
  badgeClass: string;
}

export function getInventoryAssetTypeInfo(asset: Asset): InventoryAssetTypeInfo {
  const id = (asset.id || '').toLowerCase();
  const name = (asset.name || '').toLowerCase();
  const text = `${asset.code} ${asset.name} ${asset.brand} ${asset.serialNumber}`.toLowerCase();

  // ─────────────────────────────────────────────────────────────────────────
  // 1. DIVISI AUDIO / SOUND (Sheet: Inventory SOUND 2026 • GID 1322035217)
  // ─────────────────────────────────────────────────────────────────────────
  if (asset.division === 'Audio') {
    if (
      ['ast-aud-001', 'ast-aud-002', 'ast-aud-003', 'ast-aud-010'].includes(id) ||
      name.includes('pa speaker') ||
      name.includes('line array') ||
      name.includes('flying bar') ||
      name.includes('fullrange')
    ) {
      return {
        typeGroup: 'PA Speaker, Line Array & Fullrange',
        shortTypeLabel: 'PA Speaker & Line Array',
        typeOrder: 10,
        iconKey: 'speaker',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-600',
        borderClass: 'border-blue-200',
        headerBgClass: 'bg-blue-50/80 border-blue-200 text-blue-900',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    }

    if (
      ['ast-aud-004', 'ast-aud-005', 'ast-aud-006', 'ast-aud-008', 'ast-aud-009'].includes(id) ||
      name.includes('sub double') ||
      name.includes('sub single') ||
      name.includes('subwoofer')
    ) {
      return {
        typeGroup: 'Subwoofer (Sub Double & Sub Single)',
        shortTypeLabel: 'Subwoofer (Double/Single)',
        typeOrder: 20,
        iconKey: 'speaker',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-600',
        borderClass: 'border-indigo-200',
        headerBgClass: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      };
    }

    if (
      ['ast-aud-007', 'ast-aud-011', 'ast-aud-012', 'ast-aud-013'].includes(id) ||
      name.includes('monitor speaker') ||
      name.includes('floor monitor')
    ) {
      return {
        typeGroup: 'Floor Monitor Speaker',
        shortTypeLabel: 'Floor Monitor Speaker',
        typeOrder: 30,
        iconKey: 'speaker',
        bgClass: 'bg-sky-50',
        textClass: 'text-sky-600',
        borderClass: 'border-sky-200',
        headerBgClass: 'bg-sky-50/80 border-sky-200 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-200'
      };
    }

    if (
      ['ast-aud-014', 'ast-aud-015', 'ast-aud-016', 'ast-aud-017', 'ast-aud-018', 'ast-aud-019', 'ast-aud-020'].includes(id) ||
      name.includes('mixer') ||
      name.includes('stage box') ||
      name.includes('stagebox') ||
      text.includes('dl 32') ||
      text.includes('dl 251') ||
      text.includes('dl32')
    ) {
      return {
        typeGroup: 'Digital / Analog Mixer & IO Stage Box',
        shortTypeLabel: 'Mixer & IO Stage Box',
        typeOrder: 40,
        iconKey: 'sliders',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-700',
        borderClass: 'border-indigo-200',
        headerBgClass: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      };
    }

    if (
      ['ast-aud-021', 'ast-aud-056', 'ast-aud-057'].includes(id) ||
      name.includes('power amply') ||
      name.includes('speaker management') ||
      name.includes('dlms') ||
      name.includes('audio splitter') ||
      text.includes('xilica') ||
      text.includes('marani')
    ) {
      return {
        typeGroup: 'Power Amplifier, DLMS & Audio Splitter',
        shortTypeLabel: 'Power Amply, DLMS & Splitter',
        typeOrder: 50,
        iconKey: 'cpu',
        bgClass: 'bg-cyan-50',
        textClass: 'text-cyan-700',
        borderClass: 'border-cyan-200',
        headerBgClass: 'bg-cyan-50/80 border-cyan-200 text-cyan-900',
        badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200'
      };
    }

    if (
      ['ast-aud-022', 'ast-aud-023', 'ast-aud-024', 'ast-aud-025', 'ast-aud-026', 'ast-aud-027', 'ast-aud-028', 'ast-aud-029', 'ast-aud-030', 'ast-aud-031'].includes(id) ||
      name.includes('instrument') ||
      name.includes('drum ') ||
      name.includes('keyboard') ||
      text.includes('jc-120') ||
      text.includes('kc-550') ||
      text.includes('marshall') ||
      text.includes('krueger')
    ) {
      return {
        typeGroup: 'Instrument & Backline (Drum, Amply, Keyboard)',
        shortTypeLabel: 'Instrument & Backline',
        typeOrder: 60,
        iconKey: 'music',
        bgClass: 'bg-violet-50',
        textClass: 'text-violet-600',
        borderClass: 'border-violet-200',
        headerBgClass: 'bg-violet-50/80 border-violet-200 text-violet-900',
        badgeClass: 'bg-violet-100 text-violet-800 border-violet-200'
      };
    }

    if (
      ['ast-aud-032', 'ast-aud-033', 'ast-aud-034', 'ast-aud-035', 'ast-aud-036', 'ast-aud-037'].includes(id) ||
      name.includes('microphone wireless') ||
      name.includes('antenna distributor') ||
      name.includes('clipon')
    ) {
      return {
        typeGroup: 'Microphone Wireless & Clip-On',
        shortTypeLabel: 'Microphone Wireless',
        typeOrder: 70,
        iconKey: 'radio',
        bgClass: 'bg-sky-50',
        textClass: 'text-sky-700',
        borderClass: 'border-sky-200',
        headerBgClass: 'bg-sky-50/80 border-sky-200 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-200'
      };
    }

    if (
      ['ast-aud-047', 'ast-aud-048', 'ast-aud-049', 'ast-aud-050'].includes(id) ||
      name.includes('di-box') ||
      name.includes('di-active') ||
      text.includes('ultra-di')
    ) {
      return {
        typeGroup: 'DI-Box Active & Passive',
        shortTypeLabel: 'DI-Box Active & Passive',
        typeOrder: 90,
        iconKey: 'sliders',
        bgClass: 'bg-teal-50',
        textClass: 'text-teal-700',
        borderClass: 'border-teal-200',
        headerBgClass: 'bg-teal-50/80 border-teal-200 text-teal-900',
        badgeClass: 'bg-teal-100 text-teal-800 border-teal-200'
      };
    }

    if (
      [
        'ast-aud-038', 'ast-aud-039', 'ast-aud-040', 'ast-aud-041', 'ast-aud-042',
        'ast-aud-043', 'ast-aud-044', 'ast-aud-045', 'ast-aud-046', 'ast-aud-051',
        'ast-aud-052', 'ast-aud-053', 'ast-aud-054', 'ast-aud-055'
      ].includes(id) ||
      name.includes('microphone') ||
      name.includes('in-ear monitor') ||
      name.includes('gooseneck') ||
      name.includes('condenser')
    ) {
      return {
        typeGroup: 'Microphone Cable, Gooseneck, Drum Mic & Condenser',
        shortTypeLabel: 'Mic Cable, Drum & Condenser',
        typeOrder: 80,
        iconKey: 'mic',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
        headerBgClass: 'bg-blue-50/80 border-blue-200 text-blue-900',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    }

    if (
      ['ast-aud-062', 'ast-aud-063', 'ast-aud-064', 'ast-aud-065', 'ast-aud-066', 'ast-aud-070'].includes(id) ||
      name.includes('stand ') ||
      name.includes('takel') ||
      name.includes('strap') ||
      name.includes('booster')
    ) {
      return {
        typeGroup: 'Stand, Rigging & Takel Audio',
        shortTypeLabel: 'Stand, Rigging & Takel',
        typeOrder: 100,
        iconKey: 'layers',
        bgClass: 'bg-slate-100',
        textClass: 'text-slate-700',
        borderClass: 'border-slate-300',
        headerBgClass: 'bg-slate-100 border-slate-300 text-slate-900',
        badgeClass: 'bg-slate-200 text-slate-800 border-slate-300'
      };
    }

    return {
      typeGroup: 'Cabling Snake/XLR, Panel Listrik & Stabilizer',
      shortTypeLabel: 'Cabling, Panel & Stabilizer',
      typeOrder: 110,
      iconKey: 'zap',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-200',
      headerBgClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. DIVISI LIGHTING (Sheet: Inventory LIGHTING 2026)
  // ─────────────────────────────────────────────────────────────────────────
  if (asset.division === 'Lighting') {
    if (
      ['ast-lgt-001', 'ast-lgt-002', 'ast-lgt-003'].includes(id) ||
      name.includes('moving beam')
    ) {
      return {
        typeGroup: 'Moving Beam Lighting',
        shortTypeLabel: 'Moving Beam',
        typeOrder: 210,
        iconKey: 'lightbulb',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-600',
        borderClass: 'border-amber-200',
        headerBgClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    }

    if (
      ['ast-lgt-004', 'ast-lgt-005', 'ast-lgt-006', 'ast-lgt-007'].includes(id) ||
      name.includes('fresnel') ||
      name.includes('parled') ||
      name.includes('par light')
    ) {
      return {
        typeGroup: 'Fresnel & Parled / Par Light',
        shortTypeLabel: 'Fresnel & Parled',
        typeOrder: 220,
        iconKey: 'lightbulb',
        bgClass: 'bg-yellow-50',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-200',
        headerBgClass: 'bg-yellow-50/80 border-yellow-200 text-yellow-900',
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    }

    if (
      ['ast-lgt-008', 'ast-lgt-009', 'ast-lgt-010', 'ast-lgt-011'].includes(id) ||
      name.includes('stormy') ||
      name.includes('strobe') ||
      name.includes('wallwasher') ||
      name.includes('follow spot') ||
      name.includes('mini brute')
    ) {
      return {
        typeGroup: 'Strobe, Wallwasher, Follow Spot & Mini Brute',
        shortTypeLabel: 'Strobe, Wallwasher & Follow Spot',
        typeOrder: 230,
        iconKey: 'sparkles',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-600',
        borderClass: 'border-orange-200',
        headerBgClass: 'bg-orange-50/80 border-orange-200 text-orange-900',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    }

    if (
      ['ast-lgt-012', 'ast-lgt-013'].includes(id) ||
      name.includes('smoke') ||
      name.includes('hazer') ||
      name.includes('minyak')
    ) {
      return {
        typeGroup: 'Smoke Machine, Hazer & Consumable SFX',
        shortTypeLabel: 'Smoke Machine & Hazer (SFX)',
        typeOrder: 240,
        iconKey: 'sparkles',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-600',
        borderClass: 'border-rose-200',
        headerBgClass: 'bg-rose-50/80 border-rose-200 text-rose-900',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
      };
    }

    if (
      ['ast-lgt-014', 'ast-lgt-015', 'ast-lgt-016', 'ast-lgt-017', 'ast-lgt-018', 'ast-lgt-019'].includes(id) ||
      name.includes('mixer lighting') ||
      name.includes('grand ma') ||
      name.includes('avolite') ||
      name.includes('splitter dmx')
    ) {
      return {
        typeGroup: 'Mixer Lighting Console & Splitter DMX',
        shortTypeLabel: 'Mixer Console & Splitter DMX',
        typeOrder: 250,
        iconKey: 'sliders',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-200',
        headerBgClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    }

    if (
      ['ast-lgt-020', 'ast-lgt-021', 'ast-lgt-027', 'ast-lgt-028'].includes(id) ||
      name.includes('stand lighting') ||
      name.includes('cover ')
    ) {
      return {
        typeGroup: 'Stand Lighting & Cover Unit',
        shortTypeLabel: 'Stand Lighting & Cover',
        typeOrder: 260,
        iconKey: 'layers',
        bgClass: 'bg-slate-100',
        textClass: 'text-slate-700',
        borderClass: 'border-slate-300',
        headerBgClass: 'bg-slate-100 border-slate-300 text-slate-900',
        badgeClass: 'bg-slate-200 text-slate-800 border-slate-300'
      };
    }

    return {
      typeGroup: 'Kabel Link DMX & Power Extension Lighting',
      shortTypeLabel: 'Kabel Link DMX & Power',
      typeOrder: 270,
      iconKey: 'zap',
      bgClass: 'bg-orange-50',
      textClass: 'text-orange-700',
      borderClass: 'border-orange-200',
      headerBgClass: 'bg-orange-50/80 border-orange-200 text-orange-900',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. DIVISI MULTIMEDIA (Sheet: INVENTORY STREEMING 2026)
  // ─────────────────────────────────────────────────────────────────────────
  if (asset.division === 'Multimedia') {
    if (
      ['ast-mm-001', 'ast-mm-002', 'ast-mm-003'].includes(id) ||
      name.includes('pc streaming') ||
      name.includes('workstation')
    ) {
      return {
        typeGroup: 'PC Streaming Workstation',
        shortTypeLabel: 'PC Streaming Workstation',
        typeOrder: 310,
        iconKey: 'monitor',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-600',
        borderClass: 'border-purple-200',
        headerBgClass: 'bg-purple-50/80 border-purple-200 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    }

    if (
      ['ast-mm-016'].includes(id) ||
      name.includes('laptop') ||
      name.includes('macbook')
    ) {
      return {
        typeGroup: 'Laptop Gaming Produksi & Operasional',
        shortTypeLabel: 'Laptop Produksi & Operasional',
        typeOrder: 320,
        iconKey: 'monitor',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-600',
        borderClass: 'border-indigo-200',
        headerBgClass: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      };
    }

    if (
      ['ast-mm-008', 'ast-mm-009', 'ast-mm-010', 'ast-mm-011', 'ast-mm-012', 'ast-mm-013'].includes(id) ||
      name.includes('camcorder') ||
      name.includes('remote control kamera') ||
      name.includes('tripod kamera') ||
      name.includes('wireless cam') ||
      name.includes('memory cam')
    ) {
      return {
        typeGroup: 'Camcorder, Tripod, Wireless Cam & Memory',
        shortTypeLabel: 'Camcorder, Tripod & Wireless Cam',
        typeOrder: 330,
        iconKey: 'camera',
        bgClass: 'bg-fuchsia-50',
        textClass: 'text-fuchsia-600',
        borderClass: 'border-fuchsia-200',
        headerBgClass: 'bg-fuchsia-50/80 border-fuchsia-200 text-fuchsia-900',
        badgeClass: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200'
      };
    }

    if (
      ['ast-mm-004', 'ast-mm-005', 'ast-mm-015', 'ast-mm-018', 'ast-mm-019', 'ast-mm-020'].includes(id) ||
      name.includes('video capture') ||
      name.includes('video switcher') ||
      name.includes('video recorder') ||
      name.includes('controller') ||
      text.includes('stream deck')
    ) {
      return {
        typeGroup: 'Video Switcher, Recorder, Capture Card & Controller',
        shortTypeLabel: 'Switcher, Capture Card & Recorder',
        typeOrder: 340,
        iconKey: 'cpu',
        bgClass: 'bg-violet-50',
        textClass: 'text-violet-700',
        borderClass: 'border-violet-200',
        headerBgClass: 'bg-violet-50/80 border-violet-200 text-violet-900',
        badgeClass: 'bg-violet-100 text-violet-800 border-violet-200'
      };
    }

    if (
      ['ast-mm-006', 'ast-mm-007', 'ast-mm-021'].includes(id) ||
      name.includes('soundcard') ||
      name.includes('clear com') ||
      name.includes('intercom')
    ) {
      return {
        typeGroup: 'Audio Soundcard & Clear Com Wireless Intercom',
        shortTypeLabel: 'Soundcard & Clear Com Intercom',
        typeOrder: 350,
        iconKey: 'radio',
        bgClass: 'bg-cyan-50',
        textClass: 'text-cyan-700',
        borderClass: 'border-cyan-200',
        headerBgClass: 'bg-cyan-50/80 border-cyan-200 text-cyan-900',
        badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200'
      };
    }

    if (
      ['ast-mm-017', 'ast-mm-026'].includes(id) ||
      name.includes('smart tv') ||
      name.includes('green screen') ||
      text.includes('godox')
    ) {
      return {
        typeGroup: 'Smart TV Monitor, Green Screen & Studio Lighting',
        shortTypeLabel: 'Smart TV, Green Screen & Studio LED',
        typeOrder: 360,
        iconKey: 'tv',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-700',
        borderClass: 'border-purple-200',
        headerBgClass: 'bg-purple-50/80 border-purple-200 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    }

    return {
      typeGroup: 'Converter SDI/HDMI, Splitter, Network & Cabling FO',
      shortTypeLabel: 'Converter, Splitter & Cabling FO/SDI',
      typeOrder: 370,
      iconKey: 'zap',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-600',
      borderClass: 'border-purple-200',
      headerBgClass: 'bg-purple-50/80 border-purple-200 text-purple-900',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. DIVISI VIDEOTRON / LED (Sheet: INVENTORY LED 2026)
  // ─────────────────────────────────────────────────────────────────────────
  if (asset.division === 'Videotron') {
    if (
      id === 'ast-led-001' ||
      name.includes('led visual') ||
      name.includes('hybrid p3.9')
    ) {
      return {
        typeGroup: 'Kabinet Panel LED Visual',
        shortTypeLabel: 'Kabinet Panel LED P3.9',
        typeOrder: 410,
        iconKey: 'tv',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-600',
        borderClass: 'border-emerald-200',
        headerBgClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      };
    }

    if (
      ['ast-led-002', 'ast-led-003'].includes(id) ||
      name.includes('processor') ||
      name.includes('novastar') ||
      name.includes('vx6') ||
      name.includes('vx1000')
    ) {
      return {
        typeGroup: 'LED Video Processor',
        shortTypeLabel: 'LED Video Processor',
        typeOrder: 420,
        iconKey: 'cpu',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
        headerBgClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      };
    }

    if (
      ['ast-led-004', 'ast-led-005', 'ast-led-006'].includes(id) ||
      name.includes('bracket') ||
      name.includes('rigging') ||
      name.includes('hambalan') ||
      name.includes('pemberat') ||
      name.includes('hanging bar')
    ) {
      return {
        typeGroup: 'Rigging, Bracket, Hambalan & Pemberat LED',
        shortTypeLabel: 'Rigging, Bracket & Pemberat LED',
        typeOrder: 430,
        iconKey: 'layers',
        bgClass: 'bg-teal-50',
        textClass: 'text-teal-700',
        borderClass: 'border-teal-200',
        headerBgClass: 'bg-teal-50/80 border-teal-200 text-teal-900',
        badgeClass: 'bg-teal-100 text-teal-800 border-teal-200'
      };
    }

    return {
      typeGroup: 'Panel Listrik, Kabel LAN Neutrik & HDMI Armored LED',
      shortTypeLabel: 'Panel Listrik, LAN & HDMI Armored',
      typeOrder: 440,
      iconKey: 'zap',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-600',
      borderClass: 'border-emerald-200',
      headerBgClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
  }

  return {
    typeGroup: 'Unit Inventaris Gudang Umum',
    shortTypeLabel: 'Unit Inventaris Umum',
    typeOrder: 999,
    iconKey: 'package',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-200',
    headerBgClass: 'bg-slate-100 border-slate-200 text-slate-900',
    badgeClass: 'bg-slate-200 text-slate-800 border-slate-300'
  };
}

export interface InventoryTypeGroupBucket {
  typeInfo: InventoryAssetTypeInfo;
  assets: Asset[];
}

export function groupInventoryAssetsByType(assets: Asset[]): InventoryTypeGroupBucket[] {
  const map = new Map<string, InventoryTypeGroupBucket>();
  for (const asset of assets) {
    const info = getInventoryAssetTypeInfo(asset);
    const existing = map.get(info.typeGroup);
    if (existing) {
      existing.assets.push(asset);
    } else {
      map.set(info.typeGroup, { typeInfo: info, assets: [asset] });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.typeInfo.typeOrder - b.typeInfo.typeOrder);
}

/**
 * Menghapus pencantuman nilai nominal Rupiah (Rp ...) dari teks serialNumber / spesifikasi
 * sesuai instruksi resmi: "nilai nominal tidak perlu di cantumkan".
 */
export function stripInventoryNominalText(raw: string): string {
  if (!raw) return '-';
  return raw
    .replace(/\s*•?\s*Nilai:\s*Rp\s*[\d.,]+/gi, '')
    .replace(/\s*•?\s*Total Nilai[^•]*/gi, '')
    .replace(/\s*•?\s*Rp\s*[\d.,]+/gi, '')
    .trim();
}

const CANONICAL_ASSET_BASE_COUNTS: Record<
  string,
  { total: number; sheetDamaged: number; sheetDamageNote?: string }
> = {
  // 1. Lighting 2026 (28 Kelompok)
  'ast-lgt-001': { total: 24, sheetDamaged: 0 },
  'ast-lgt-002': { total: 12, sheetDamaged: 0 },
  'ast-lgt-003': { total: 8, sheetDamaged: 0 },
  'ast-lgt-004': { total: 13, sheetDamaged: 0 },
  'ast-lgt-005': { total: 8, sheetDamaged: 0 },
  'ast-lgt-006': { total: 24, sheetDamaged: 0 },
  'ast-lgt-007': { total: 24, sheetDamaged: 0 },
  'ast-lgt-008': { total: 32, sheetDamaged: 2, sheetDamageNote: '2 Unit Stormy Error (Ready 30 Unit - Sheet Lighting 2026)' },
  'ast-lgt-009': { total: 20, sheetDamaged: 0 },
  'ast-lgt-010': { total: 2, sheetDamaged: 0 },
  'ast-lgt-011': { total: 10, sheetDamaged: 0 },
  'ast-lgt-012': { total: 5, sheetDamaged: 1, sheetDamageNote: '1 Unit Smoke Machine Rusak (Ready 4 Unit - Sheet Lighting 2026)' },
  'ast-lgt-013': { total: 4, sheetDamaged: 0 },
  'ast-lgt-014': { total: 2, sheetDamaged: 0 },
  'ast-lgt-015': { total: 1, sheetDamaged: 0 },
  'ast-lgt-016': { total: 1, sheetDamaged: 0 },
  'ast-lgt-017': { total: 1, sheetDamaged: 0 },
  'ast-lgt-018': { total: 1, sheetDamaged: 1, sheetDamageNote: '1 Unit Mati Suri (Sheet Lighting 2026)' },
  'ast-lgt-019': { total: 4, sheetDamaged: 0 },
  'ast-lgt-020': { total: 6, sheetDamaged: 0 },
  'ast-lgt-021': { total: 1, sheetDamaged: 0 },
  'ast-lgt-022': { total: 62, sheetDamaged: 0 },
  'ast-lgt-023': { total: 69, sheetDamaged: 0 },
  'ast-lgt-024': { total: 1, sheetDamaged: 0 },
  'ast-lgt-025': { total: 55, sheetDamaged: 0 },
  'ast-lgt-026': { total: 4, sheetDamaged: 0 },
  'ast-lgt-027': { total: 26, sheetDamaged: 0 },
  'ast-lgt-028': { total: 55, sheetDamaged: 0 },

  // 2. Audio / Sound 2026 (70 Kelompok • GID 1322035217)
  'ast-aud-001': { total: 4, sheetDamaged: 0 },
  'ast-aud-002': { total: 24, sheetDamaged: 0 },
  'ast-aud-003': { total: 4, sheetDamaged: 0 },
  'ast-aud-004': { total: 2, sheetDamaged: 0 },
  'ast-aud-005': { total: 16, sheetDamaged: 0 },
  'ast-aud-006': { total: 4, sheetDamaged: 0 },
  'ast-aud-007': { total: 4, sheetDamaged: 0 },
  'ast-aud-008': { total: 2, sheetDamaged: 0 },
  'ast-aud-009': { total: 2, sheetDamaged: 0 },
  'ast-aud-010': { total: 2, sheetDamaged: 0 },
  'ast-aud-011': { total: 12, sheetDamaged: 0 },
  'ast-aud-012': { total: 18, sheetDamaged: 0 },
  'ast-aud-013': { total: 2, sheetDamaged: 0 },
  'ast-aud-014': { total: 2, sheetDamaged: 0 },
  'ast-aud-015': { total: 3, sheetDamaged: 0 },
  'ast-aud-016': { total: 3, sheetDamaged: 0 },
  'ast-aud-017': { total: 3, sheetDamaged: 0 },
  'ast-aud-018': { total: 1, sheetDamaged: 0 },
  'ast-aud-019': { total: 4, sheetDamaged: 0 },
  'ast-aud-020': { total: 2, sheetDamaged: 0 },
  'ast-aud-021': { total: 1, sheetDamaged: 0 },
  'ast-aud-022': { total: 2, sheetDamaged: 0 },
  'ast-aud-023': { total: 1, sheetDamaged: 0 },
  'ast-aud-024': { total: 1, sheetDamaged: 0 },
  'ast-aud-025': { total: 1, sheetDamaged: 0 },
  'ast-aud-026': { total: 1, sheetDamaged: 0 },
  'ast-aud-027': { total: 3, sheetDamaged: 0 },
  'ast-aud-028': { total: 3, sheetDamaged: 0 },
  'ast-aud-029': { total: 3, sheetDamaged: 0 },
  'ast-aud-030': { total: 2, sheetDamaged: 0 },
  'ast-aud-031': { total: 3, sheetDamaged: 0 },
  'ast-aud-032': { total: 18, sheetDamaged: 0 },
  'ast-aud-033': { total: 7, sheetDamaged: 0 },
  'ast-aud-034': { total: 13, sheetDamaged: 0 },
  'ast-aud-035': { total: 4, sheetDamaged: 0 },
  'ast-aud-036': { total: 4, sheetDamaged: 0 },
  'ast-aud-037': { total: 4, sheetDamaged: 0 },
  'ast-aud-038': { total: 25, sheetDamaged: 0 },
  'ast-aud-039': { total: 22, sheetDamaged: 4, sheetDamageNote: '4 Unit SM58 Hilang (Sheet Sound 2026)' },
  'ast-aud-040': { total: 13, sheetDamaged: 0 },
  'ast-aud-041': { total: 3, sheetDamaged: 0 },
  'ast-aud-042': { total: 7, sheetDamaged: 0 },
  'ast-aud-043': { total: 2, sheetDamaged: 0 },
  'ast-aud-044': { total: 7, sheetDamaged: 0 },
  'ast-aud-045': { total: 13, sheetDamaged: 0 },
  'ast-aud-046': { total: 9, sheetDamaged: 0 },
  'ast-aud-047': { total: 8, sheetDamaged: 0 },
  'ast-aud-048': { total: 18, sheetDamaged: 0 },
  'ast-aud-049': { total: 22, sheetDamaged: 0 },
  'ast-aud-050': { total: 3, sheetDamaged: 0 },
  'ast-aud-051': { total: 15, sheetDamaged: 0 },
  'ast-aud-052': { total: 7, sheetDamaged: 0 },
  'ast-aud-053': { total: 9, sheetDamaged: 0 },
  'ast-aud-054': { total: 6, sheetDamaged: 0 },
  'ast-aud-055': { total: 10, sheetDamaged: 0 },
  'ast-aud-056': { total: 5, sheetDamaged: 0 },
  'ast-aud-057': { total: 4, sheetDamaged: 0 },
  'ast-aud-058': { total: 11, sheetDamaged: 0 },
  'ast-aud-059': { total: 335, sheetDamaged: 0 },
  'ast-aud-060': { total: 58, sheetDamaged: 0 },
  'ast-aud-061': { total: 37, sheetDamaged: 0 },
  'ast-aud-062': { total: 24, sheetDamaged: 0 },
  'ast-aud-063': { total: 54, sheetDamaged: 0 },
  'ast-aud-064': { total: 7, sheetDamaged: 0 },
  'ast-aud-065': { total: 12, sheetDamaged: 0 },
  'ast-aud-066': { total: 6, sheetDamaged: 0 },
  'ast-aud-067': { total: 26, sheetDamaged: 0 },
  'ast-aud-068': { total: 131, sheetDamaged: 0 },
  'ast-aud-069': { total: 12, sheetDamaged: 0 },
  'ast-aud-070': { total: 26, sheetDamaged: 0 },

  // 3. Multimedia / Streaming 2026 (26 Kelompok)
  'ast-mm-001': { total: 1, sheetDamaged: 0 },
  'ast-mm-002': { total: 1, sheetDamaged: 0 },
  'ast-mm-003': { total: 1, sheetDamaged: 0 },
  'ast-mm-004': { total: 5, sheetDamaged: 0 },
  'ast-mm-005': { total: 6, sheetDamaged: 0 },
  'ast-mm-006': { total: 4, sheetDamaged: 0 },
  'ast-mm-007': { total: 2, sheetDamaged: 1, sheetDamageNote: '1 Unit Hardwell Optimus 4 Rusak (Sheet Streaming 2026)' },
  'ast-mm-008': { total: 4, sheetDamaged: 0 },
  'ast-mm-009': { total: 5, sheetDamaged: 0 },
  'ast-mm-010': { total: 7, sheetDamaged: 0 },
  'ast-mm-011': { total: 9, sheetDamaged: 0 },
  'ast-mm-012': { total: 4, sheetDamaged: 0 },
  'ast-mm-013': { total: 1, sheetDamaged: 0 },
  'ast-mm-014': { total: 4, sheetDamaged: 0 },
  'ast-mm-015': { total: 3, sheetDamaged: 0 },
  'ast-mm-016': { total: 3, sheetDamaged: 0 },
  'ast-mm-017': { total: 50, sheetDamaged: 0 },
  'ast-mm-018': { total: 3, sheetDamaged: 0 },
  'ast-mm-019': { total: 2, sheetDamaged: 0 },
  'ast-mm-020': { total: 2, sheetDamaged: 0 },
  'ast-mm-021': { total: 12, sheetDamaged: 2, sheetDamageNote: '2 Unit Eartec UL5D Rusak (Sheet Streaming 2026)' },
  'ast-mm-022': { total: 3, sheetDamaged: 1, sheetDamageNote: '1 Unit UPS APC 1200VA Rusak (Sheet Streaming 2026)' },
  'ast-mm-023': { total: 8, sheetDamaged: 0 },
  'ast-mm-024': { total: 32, sheetDamaged: 4, sheetDamageNote: '1 DP-HDMI & 3 MPOW Isolator Rusak (Sheet Streaming 2026)' },
  'ast-mm-025': { total: 106, sheetDamaged: 12, sheetDamageNote: '6 HDMI & 6 LAN Vention Rusak/Hilang (Sheet Streaming 2026)' },
  'ast-mm-026': { total: 22, sheetDamaged: 3, sheetDamageNote: '1 Coocaa 50" & 2 Coocaa 42" Rusak (Sheet Streaming 2026)' },

  // 4. Videotron / LED 2026 (9 Kelompok)
  'ast-led-001': { total: 40, sheetDamaged: 0 },
  'ast-led-002': { total: 8, sheetDamaged: 0 },
  'ast-led-003': { total: 24, sheetDamaged: 0 },
  'ast-led-004': { total: 80, sheetDamaged: 1, sheetDamageNote: '1 Unit Bracket LED Hilang Penyodok (Sheet LED 2026)' },
  'ast-led-005': { total: 327, sheetDamaged: 1, sheetDamageNote: '1 Unit Tiang Frame 1M Patah (Sheet LED 2026)' },
  'ast-led-006': { total: 81, sheetDamaged: 0 },
  'ast-led-007': { total: 24, sheetDamaged: 2, sheetDamageNote: '2 Unit HDMI Armored 100M Rusak (Sheet LED 2026)' },
  'ast-led-008': { total: 59, sheetDamaged: 1, sheetDamageNote: '1 Unit LAN Neutrik 100M Hilang (Sheet LED 2026)' },
  'ast-led-009': { total: 77, sheetDamaged: 1, sheetDamageNote: '1 Unit Panel Listrik 12 Port Check R (Sheet LED 2026)' }
};

export interface InventoryAssetAvailability {
  totalUnits: number;
  unitLabel: string;
  sheetDamagedUnits: number;
  reportDamagedUnits: number;
  totalDamagedUnits: number;
  assignedUnits: number;
  availableUnits: number;
  damageReasons: string[];
  assignedReasons: string[];
}

export interface InventoryCalculationContext {
  findings?: Finding[];
  workOrders?: WorkOrder[];
  dailyReports?: DailyReport[];
  jobAssignments?: JobAssignment[];
}

function parseCustomAssetTotalUnits(asset: Asset): { total: number; sheetDamaged: number } {
  const known = CANONICAL_ASSET_BASE_COUNTS[asset.id];
  if (known) return { total: known.total, sheetDamaged: known.sheetDamaged };

  const text = `${asset.name} ${asset.serialNumber}`;
  const qtyMatch = text.match(/QTY:\s*(\d+)/i) || text.match(/\((\d+)\s*(?:Unit|Set|Box|Lot|Roll)\b/i);
  const total = qtyMatch ? Math.max(1, parseInt(qtyMatch[1], 10)) : 1;
  const sheetDamaged = asset.condition === 'Rusak Berat' ? total : asset.condition === 'Rusak Ringan' ? 1 : 0;
  return { total, sheetDamaged };
}

/**
 * Menghitung jumlah unit total, pengurangan akibat kerusakan (Sheet + Report/Temuan/WO),
 * pengurangan akibat penugasan aktif (Jadwal Penugasan Job), dan sisa unit siap pakai.
 */
export function calculateInventoryAssetAvailability(
  asset: Asset,
  ctx?: InventoryCalculationContext
): InventoryAssetAvailability {
  const findings = ctx?.findings ?? CANONICAL_FIRESTORE_FINDINGS;
  const workOrders = ctx?.workOrders ?? CANONICAL_FIRESTORE_WORK_ORDERS;
  const jobAssignments = ctx?.jobAssignments ?? INITIAL_JOB_ASSIGNMENTS;

  const base = parseCustomAssetTotalUnits(asset);
  const totalUnits = base.total;
  let sheetDamagedUnits = base.sheetDamaged;
  const damageReasons: string[] = [];

  const canonicalBase = CANONICAL_ASSET_BASE_COUNTS[asset.id];
  if (canonicalBase?.sheetDamageNote && sheetDamagedUnits > 0) {
    damageReasons.push(canonicalBase.sheetDamageNote);
  }

  // Jika aset sedang berada di Divisi SERVICE atau diubah manual menjadi Rusak oleh user
  if (asset.location.includes('SERVICE') && sheetDamagedUnits === 0) {
    sheetDamagedUnits = 1;
    damageReasons.push('Sedang di Divisi SERVICE');
  }

  // 1. Hitung pengurangan kerusakan berdasarkan Report / Temuan QC (Findings) & Work Orders aktif
  let reportDamagedUnits = 0;
  const openFindings = findings.filter(f => f && f.status !== 'Close');
  const activeWOs = workOrders.filter(w => w && w.status !== 'Completed');

  const id = asset.id;

  if (id === 'ast-aud-012') {
    // Monitor Speaker dB Technologies Opera 15 (16 Unit) -> Temuan DB No. 15
    const db15Finding = openFindings.find(f => {
      const t = `${f.equipment} ${f.issue}`.toLowerCase();
      return t.includes('db') && t.includes('15') && !t.includes('lvx');
    });
    if (db15Finding) {
      reportDamagedUnits += 1;
      damageReasons.push('Report Temuan: Monitor DB Tech No. 15 (Tweeter Bermasalah - 1 Unit)');
    }
  } else if (id === 'ast-aud-013') {
    // Monitor Speaker dB Technologies LVX 15 (2 Unit) -> Temuan LVX15 Mesin Mati
    const lvxFinding = openFindings.find(f => `${f.equipment} ${f.issue}`.toLowerCase().includes('lvx'));
    if (lvxFinding) {
      reportDamagedUnits += 1;
      damageReasons.push('Report Temuan: Monitor dBTech LVX 15 (Mesin Mati / Cek Damri - 1 Unit)');
    }
  } else if (id === 'ast-lgt-007') {
    // Par Light TRF A64 (24 Unit) -> Temuan No. 5, 12, 19, 33 Eror (4 Unit)
    const trfFinding = openFindings.find(f => `${f.equipment} ${f.issue}`.toLowerCase().includes('a64'));
    if (trfFinding) {
      reportDamagedUnits += 4;
      damageReasons.push('Report Temuan: Parled TRF A64 No. 5, 12, 19, 33 Eror (4 Unit)');
    }
  } else if (id === 'ast-mm-022') {
    // UPS Multimedia -> Temuan UPS tidak bisa mengisi
    const upsFinding = openFindings.find(f => `${f.equipment} ${f.issue}`.toLowerCase().includes('ups'));
    if (upsFinding) {
      reportDamagedUnits += 1;
      damageReasons.push('Report Temuan: UPS Multimedia Tidak Bisa Mengisi Daya (1 Unit)');
    }
  } else if (id === 'ast-led-001') {
    // Kabinet LED Videotron -> Temuan 8 Kabinet / 2 Box Service
    const ledFinding = openFindings.find(f => {
      const t = `${f.equipment} ${f.issue}`.toLowerCase();
      return t.includes('kabinet led') || t.includes('box led');
    });
    if (ledFinding) {
      reportDamagedUnits += 2;
      damageReasons.push('Report Temuan: 2 Box (8 Kabinet) LED Videotron Sedang Servis');
    }
  } else if (id === 'ast-aud-070') {
    // Takel 1 Ton LOS
    const takelWO = activeWOs.find(w => `${w.equipment || ''} ${w.title}`.toLowerCase().includes('takel'));
    if (takelWO) {
      reportDamagedUnits += 1;
      damageReasons.push('Report WO: Takel Chain Hoist 1 Ton LOS (1 Unit)');
    }
  } else if (id === 'ast-lgt-020') {
    // Tripot Custom Lighting
    const tripotFinding = openFindings.find(f => `${f.equipment} ${f.issue}`.toLowerCase().includes('tripot'));
    if (tripotFinding) {
      reportDamagedUnits += 1;
      damageReasons.push('Report Temuan: Tripot Custom Lighting Tidak Komplit (1 Unit)');
    }
  }

  // Pencocokan dinamis untuk temuan baru yang mencantumkan kode aset (misal AST-AUD-001) atau nama persis aset
  const codeLower = (asset.code || '').toLowerCase();
  if (codeLower) {
    for (const f of openFindings) {
      const fText = `${f.equipment} ${f.issue}`.toLowerCase();
      if (fText.includes(codeLower)) {
        reportDamagedUnits += 1;
        damageReasons.push(`Report Temuan [${f.id}]: ${f.issue}`);
      }
    }
  }

  const totalDamagedUnits = Math.min(totalUnits, sheetDamagedUnits + reportDamagedUnits);

  // 2. Hitung pengurangan unit berdasarkan Jadwal Penugasan Kerja (JobAssignment) yang sedang aktif
  let assignedUnits = 0;
  const assignedReasons: string[] = [];

  const activeJobs = jobAssignments.filter(
    j => j && (j.status === 'Berlangsung (Show)' || j.status === 'Loading / Setup')
  );

  for (const job of activeJobs) {
    const allEqText = job.sections.flatMap(s => s.equipment).join(' , ');

    if (id === 'ast-aud-001') {
      // PA Speaker RCF 4Pro 6001-A
      const m = allEqText.match(/\b6001\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-002') {
      const m = allEqText.match(/\b(?:hdl(?:\s*20)?|avanda\s*210)\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-005') {
      const m = allEqText.match(/\b(?:sub\s+double|avanda\s*218a?|sub\s+kla)\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-006') {
      // Sub Single RCF 8003-A
      const m = allEqText.match(/\b8003\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-008') {
      const m = allEqText.match(/\b8001\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-011') {
      const m = allEqText.match(/\bart\s*(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-012') {
      // Monitor Speaker dB Technologies Opera 15 (Db 4, Db 6)
      const m = allEqText.match(/\bdb\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-013') {
      // Monitor Speaker dB Technologies LVX 15
      const m = allEqText.match(/\blvx\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-014') {
      // Digital Mixer Midas M32 R
      if (/\bm32r\b/i.test(allEqText)) {
        assignedUnits += 1;
        assignedReasons.push(`Job ${job.venue}: 1 Unit`);
      }
    } else if (id === 'ast-aud-015') {
      // Digital Mixer Midas M32 LIVE (M32+DL, bukan M32R)
      if (/\bm32\b(?!\s*r)/i.test(allEqText)) {
        assignedUnits += 1;
        assignedReasons.push(`Job ${job.venue}: 1 Unit`);
      }
    } else if (id === 'ast-aud-019') {
      // Stage Box Midas DL 32
      if (/\bdl\s*32\b|\+\s*dl\b/i.test(allEqText)) {
        assignedUnits += 1;
        assignedReasons.push(`Job ${job.venue}: 1 Unit`);
      }
    } else if (id === 'ast-aud-032') {
      // Microphone Wireless MIPRO (WHM di JS Luwansa)
      if (job.id.includes('js-luwansa')) {
        const m = allEqText.match(/\bwhm\s+(\d+)/i);
        if (m) {
          const qty = parseInt(m[1], 10);
          assignedUnits += qty;
          assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
        }
      }
    } else if (id === 'ast-aud-034') {
      // Microphone Wireless QA HMD46PRO (WHM di TSI / QA)
      const qaMatch = allEqText.match(/\bqa\s+(\d+)/i);
      if (qaMatch) {
        const qty = parseInt(qaMatch[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Set`);
      } else if (!job.id.includes('js-luwansa')) {
        const whmMatch = allEqText.match(/\bwhm\s+(\d+)/i);
        if (whmMatch) {
          const qty = parseInt(whmMatch[1], 10);
          assignedUnits += qty;
          assignedReasons.push(`Job ${job.venue}: ${qty} Set`);
        }
      }
    } else if (id === 'ast-aud-042') {
      // Microphone Gooseneck Hardwell
      const m = allEqText.match(/\bgooseneck(?:\s+(\d+))?/i);
      if (m) {
        const qty = m[1] ? parseInt(m[1], 10) : 1;
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-aud-062') {
      // Stand Speaker (Stand Set)
      if (/\bstand\s+set\b/i.test(allEqText)) {
        assignedUnits += 4;
        assignedReasons.push(`Job ${job.venue}: 4 Unit (Stand Set)`);
      }
    } else if (id === 'ast-lgt-001') {
      // Moving Beam TRF
      const m = allEqText.match(/\bbeam\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-lgt-004') {
      // Fresnel Spark 200W
      const m = allEqText.match(/\bfresnel\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-lgt-006') {
      // Parled 54 RGBW
      const m = allEqText.match(/\bpar(?:led)?\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-lgt-012') {
      // Smoke Machine
      const m = allEqText.match(/\bsmoke\s+(\d+)/i);
      if (m) {
        const qty = parseInt(m[1], 10);
        assignedUnits += qty;
        assignedReasons.push(`Job ${job.venue}: ${qty} Unit`);
      }
    } else if (id === 'ast-lgt-015') {
      // Mixer Lighting Avolite Quartz (JS Luwansa)
      if (job.id.includes('js-luwansa') && /\bquartz\b/i.test(allEqText)) {
        assignedUnits += 1;
        assignedReasons.push(`Job ${job.venue}: 1 Unit`);
      }
    } else if (id === 'ast-lgt-016') {
      // Mixer Lighting Avolites Mini Pearl / Quartz cadangan (TSI)
      if (!job.id.includes('js-luwansa') && /\bquartz\b/i.test(allEqText)) {
        assignedUnits += 1;
        assignedReasons.push(`Job ${job.venue}: 1 Unit`);
      }
    } else if (id === 'ast-led-001') {
      // LED Visual Yestech Hybrid P3.9 (Parkir Timur Senayan Main Stage)
      const hasInternalLed = job.sections.some(
        s => s.division === 'Videotron' && !s.packageLabel.toLowerCase().includes('victor')
      );
      if (hasInternalLed) {
        assignedUnits += 20;
        assignedReasons.push(`Job ${job.venue}: 20 Box LED P3.9`);
      }
    } else if (id === 'ast-led-002') {
      const hasInternalLed = job.sections.some(
        s => s.division === 'Videotron' && !s.packageLabel.toLowerCase().includes('victor')
      );
      if (hasInternalLed) {
        assignedUnits += 1;
        assignedReasons.push(`Job ${job.venue}: 1 Unit Processor NovaStar`);
      }
    }

    // Pencocokan dinamis untuk unit yang dipilih dari daftar Inventory [AST-...] pada Jadwal Penugasan
    if (asset.code && allEqText.toUpperCase().includes(`[${asset.code.toUpperCase()}]`)) {
      const escapedCode = asset.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const codeRegex = new RegExp(`\\[${escapedCode}\\][^,]*?\\((\\d+)\\s*Unit\\)`, 'i');
      const codeMatch = allEqText.match(codeRegex);
      const dynamicQty = codeMatch ? Math.max(1, parseInt(codeMatch[1], 10)) : 1;
      assignedUnits += dynamicQty;
      assignedReasons.push(`Job ${job.venue}: ${dynamicQty} Unit`);
    }
  }

  const maxAssignable = Math.max(0, totalUnits - totalDamagedUnits);
  const clampedAssigned = Math.min(maxAssignable, assignedUnits);
  const availableUnits = Math.max(0, totalUnits - totalDamagedUnits - clampedAssigned);

  const unitLabelMatch = `${asset.name} ${asset.serialNumber}`.match(/\b(Box|Set|Lot|Roll|Batang|Lembar|Unit)\b/i);
  const unitLabel = unitLabelMatch
    ? unitLabelMatch[1].charAt(0).toUpperCase() + unitLabelMatch[1].slice(1).toLowerCase()
    : 'Unit';

  return {
    totalUnits,
    unitLabel,
    sheetDamagedUnits,
    reportDamagedUnits,
    totalDamagedUnits,
    assignedUnits: clampedAssigned,
    availableUnits,
    damageReasons,
    assignedReasons
  };
}

export interface InventorySummaryMetrics {
  groupCount: number;
  totalUnits: number;
  totalDamagedUnits: number;
  reportDamagedUnits: number;
  assignedUnits: number;
  availableUnits: number;
}

export function calculateInventorySummaryMetrics(
  assets: Asset[],
  ctx?: InventoryCalculationContext
): InventorySummaryMetrics {
  let totalUnits = 0;
  let totalDamagedUnits = 0;
  let reportDamagedUnits = 0;
  let assignedUnits = 0;
  let availableUnits = 0;

  for (const asset of assets) {
    const avail = calculateInventoryAssetAvailability(asset, ctx);
    totalUnits += avail.totalUnits;
    totalDamagedUnits += avail.totalDamagedUnits;
    reportDamagedUnits += avail.reportDamagedUnits;
    assignedUnits += avail.assignedUnits;
    availableUnits += avail.availableUnits;
  }

  return {
    groupCount: assets.length,
    totalUnits,
    totalDamagedUnits,
    reportDamagedUnits,
    assignedUnits,
    availableUnits
  };
}


