/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KATALOG & REFERENSI RESMI PERALATAN EVENT RIZ-PRODUCTION
 * Sumber Resmi: Website PT. RIZ PRODUCTION MULTI KREASI (https://www.rizproduction.id)
 */

export interface OfficialEquipmentSource {
  title: string;
  category: string;
  division: 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Gudang' | 'Service';
  url: string;
  description: string;
}

export const OFFICIAL_EQUIPMENT_SOURCES: OfficialEquipmentSource[] = [
  {
    title: 'Rental Sound System Professional',
    category: 'Sound System (Line Array, Subwoofer, Monitor & Digital Console)',
    division: 'Audio',
    url: 'https://www.rizproduction.id/rental-sound-system',
    description: 'World-class line array, subwoofer, monitor system, dan mixer console untuk event skala kecil hingga festival.'
  },
  {
    title: 'Rental Backline Musical Instrument & Wireless',
    category: 'Backline & Alat Musik (Drum, Amplifier, Keyboard, Wireless)',
    division: 'Audio',
    url: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    description: 'Keyboard Roland, drum set Yamaha & Tama, gitar & bass amplifier Marshall, Ampeg, GK, serta mic wireless Sennheiser & Shure.'
  },
  {
    title: 'Rental LED Videotron & Display Controller',
    category: 'LED Screen (Indoor/Outdoor P3.9 & NovaStar Processor)',
    division: 'Videotron',
    url: 'https://www.rizproduction.id/rental-led-videotron',
    description: 'Indoor & outdoor LED display untuk stage backdrop, konferensi, dan instalasi kreatif resolusi tinggi.'
  },
  {
    title: 'Rental Lighting Stage & Special Effects',
    category: 'Lighting (Moving Head, Beam, Par LED, Console GrandMA & Avolites)',
    division: 'Lighting',
    url: 'https://www.rizproduction.id/rental-lighting',
    description: 'Moving head, beam, wash, par LED, hazer, smoke machine dengan lighting control GrandMA2 & Avolites untuk panggung stunning.'
  },
  {
    title: 'Rental Streaming & Multicam Production',
    category: 'Broadcast & Streaming (Sony Camcorder, ATEM Switcher, Clearcom)',
    division: 'Multimedia',
    url: 'https://www.rizproduction.id/rental-streaming-multimedia',
    description: 'Multi-platform live streaming dengan setup multicam profesional Sony, Blackmagic ATEM, wireless video Hollyland & Accsoon.'
  },
  {
    title: 'Rental Custom Event Production, Stage & Backdrop',
    category: 'Stage, Rigging, Backdrop, Gate & Wall Panel',
    division: 'Gudang',
    url: 'https://www.rizproduction.id/rental-custom-event-production',
    description: 'Custom backdrop, stage set design, entrance gate, wallpanel display, dan rigging truss untuk kebutuhan event dan branding.'
  }
];

export interface OfficialEquipmentItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  division: 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Gudang' | 'Service';
  sourceUrl: string;
  specs: string;
  maintenanceSchedule: string;
}

export const OFFICIAL_EQUIPMENT_CATALOG: OfficialEquipmentItem[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. SOUND SYSTEM (https://www.rizproduction.id/rental-sound-system)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'SND-01',
    name: 'AVANDA 210 Line Array Speaker',
    brand: 'Audiocenter',
    category: 'Line Array Speaker',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: 'Dual 10" Neodymium Woofer, Dual 1" Exit HF Compression Driver, Waveguide Horn',
    maintenanceSchedule: 'QC pin lock rigging, tes kontinuitas kabel NL4 Speakon, cek baut bodi'
  },
  {
    id: 'SND-02',
    name: 'AVANDA 218 Subwoofer',
    brand: 'Audiocenter',
    category: 'Subwoofer',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: 'Dual 18" Long Excursion Woofer, 4" Voice Coil, Bass Reflex Enclosure',
    maintenanceSchedule: 'Pengecekan konus woofer, impedansi 4/8 Ohm, konektor Speakon NL4'
  },
  {
    id: 'SND-03',
    name: 'ARTIST T45 Column Speaker',
    brand: 'Audiocenter',
    category: 'Column Speaker / Line Source',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '4x 5" Low-Mid Driver, 1x HF Dome Tweeter, Compact Sleek Design',
    maintenanceSchedule: 'Inspeksi bracket dudukan tiang, kebersihan grille, kontinuitas kabel'
  },
  {
    id: 'SND-04',
    name: '4PRO 6001-A Active 3-Way Speaker',
    brand: 'RCF',
    category: 'Point Source Speaker',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: 'Tri-Amplified Active 3-Way Speaker (15" LF, 8" MF, 1" HF), 950 Watt RMS',
    maintenanceSchedule: 'Tes pendingin heatsink internal power amp, limiter LED indikator, XLR balance'
  },
  {
    id: 'SND-05',
    name: '4PRO 8001-AS Active Subwoofer',
    brand: 'RCF',
    category: 'Active Subwoofer',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '18" High-Power Woofer, 800W Integrated Class-H Amplifier, Crossover Stereo',
    maintenanceSchedule: 'Cek fasa (phase switch), ground-lift, tes level gain amp internal'
  },
  {
    id: 'SND-06',
    name: '4PRO 8003-AS II Active Subwoofer',
    brand: 'RCF',
    category: 'Active Subwoofer',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '18" Woofer, 2200W Peak Digital Amp, DSP Presets, Stereo XLR Input/Output',
    maintenanceSchedule: 'Inspeksi DSP preset internal, powercon locking plug, castor wheels'
  },
  {
    id: 'SND-07',
    name: 'ART 315-A Active 2-Way Speaker',
    brand: 'RCF',
    category: 'Monitor / Main Speaker',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '15" Woofer, 1" HF Driver, 400 Watt RMS / 800 Watt Peak, Portable Polypropylene',
    maintenanceSchedule: 'Cek mic/line input switch, EQ boost switch, handle & mounting pole'
  },
  {
    id: 'SND-08',
    name: 'Opera Series Active Speaker',
    brand: 'dB Technologies',
    category: 'Active Speaker / Stage Monitor',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: 'Asymmetrical CD Horn, Class D 600W RMS Digipro Amp, FIR Filter Processing',
    maintenanceSchedule: 'Tes wedge monitor angle 45°, reset DSP preset flat/monitor'
  },
  {
    id: 'SND-09',
    name: 'Heritage D96-24 Digital Console',
    brand: 'Midas',
    category: 'Flagship Digital Mixing Console',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '144 Flexible Inputs, 96 kHz 64-bit Core, 21" Touchscreen, AI Manifold Engine',
    maintenanceSchedule: 'Kalibrasi motorized fader touch-sense, update showfile backup, tes port AES50'
  },
  {
    id: 'SND-10',
    name: 'M32 Digital Live Mixing Console',
    brand: 'Midas',
    category: 'Digital Mixing Console',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '32 Midas Preamps, 25 Mix Buses, 25 Motorized Faders, 40-bit Floating Point',
    maintenanceSchedule: 'Dust cleaning fader rail, tes phantom power 48V individual, Ethernet remote'
  },
  {
    id: 'SND-11',
    name: 'M32R LIVE Rackmount Digital Console',
    brand: 'Midas',
    category: 'Compact Digital Mixing Console',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '16 Midas Pro Preamp, 17 Motorized Faders, 32-Channel Recording Card',
    maintenanceSchedule: 'Flightcase latch check, tes SD card multitrack recording, fader smooth run'
  },
  {
    id: 'SND-12',
    name: 'TF-1 Digital Mixing Console',
    brand: 'Yamaha',
    category: 'Digital Mixing Console',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '16 Analog D-PRE Inputs, TouchFlow Operation, QuickPro Presets, 17 Motor Faders',
    maintenanceSchedule: 'Kalibrasi layar sentuh touchscreen, backup scene memori, tes footswitch'
  },
  {
    id: 'SND-13',
    name: 'MIR-480I Digital Loudspeaker Management',
    brand: 'Marani',
    category: 'DLMS Processor',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '4 In / 8 Out Matrix, FIR Filter, 96 kHz DSP, Dual Dynamic EQ, Noise Gate',
    maintenanceSchedule: 'Lock security password preset, backup via PC software RS485/Ethernet'
  },
  {
    id: 'SND-14',
    name: 'MIR 408A Digital Processor',
    brand: 'Marani',
    category: 'DLMS Processor',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '4 Input 8 Output Speaker Management, RMS Limiter, Parametric Equalizer',
    maintenanceSchedule: 'Cek input/output clipping level, tes ground lift, proteksi limiter'
  },
  {
    id: 'SND-15',
    name: 'XD-4080 Digital Audio Matrix',
    brand: 'Xilica',
    category: 'DLMS Processor',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-sound-system',
    specs: '4-In 8-Out 96kHz Digital Processor, 40-Bit Floating Point DSP, XConsole GUI',
    maintenanceSchedule: 'Verifikasi crossover slope (Butterworth/Linkwitz-Riley), tes delay align'
  },

  // ─────────────────────────────────────────────────────────────
  // 2. BACKLINE & MUSICAL INSTRUMENT (https://www.rizproduction.id/rental-backline-musical-instrument)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'BKL-01',
    name: 'StarClassic Acoustic Drum Kit',
    brand: 'TAMA',
    category: 'Acoustic Drum Kit',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Maple/Birch Shell 5-Piece, Star-Cast Mounting, Die-Cast Hoops, Heavy Stand',
    maintenanceSchedule: 'Pengecekan drumhead tension, pelumasan thread lugs, snare strainer & cymbal felt'
  },
  {
    id: 'BKL-02',
    name: 'Tour Custom Acoustic Drum Kit',
    brand: 'Yamaha',
    category: 'Acoustic Drum Kit',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '100% Maple Shells, YESS Tom Mounts, 6-Ply Construction, Inverse Dyna Hoops',
    maintenanceSchedule: 'Pembersihan shell varnish, kelengkapan kunci drum, pedal chain lubrication'
  },
  {
    id: 'BKL-03',
    name: 'Stage Custom Birch Drum Kit',
    brand: 'Yamaha',
    category: 'Acoustic Drum Kit',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '100% Birch Shells, Ball Clamp & Triple Tom Holder, Die-Cast Bass Drum Claw',
    maintenanceSchedule: 'Karet kaki stand boom cymbal, busa peredam bass drum, tes pedal double'
  },
  {
    id: 'BKL-04',
    name: 'DTX-6 Electronic Drum Kit',
    brand: 'Yamaha',
    category: 'Electronic Drum Kit',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'DTX-PRO Module, TCS Silicone Snare Pad, 3-Zone Cymbals, Modifier Knobs',
    maintenanceSchedule: 'Tes sensitivitas piezo trigger, kabel snake multi-jack, adaptor catu daya'
  },
  {
    id: 'BKL-05',
    name: 'SVT-4 PRO Bass Amplifier (Head + 8x10 Cabinet)',
    brand: 'Ampeg',
    category: 'Bass Amplifier',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '1200W Tube Preamp / Solid State Power Amp, 9-Band Graphic EQ, Dual Power Amp',
    maintenanceSchedule: 'Cek tabung preamp 12AX7, pendingin kipas sirkulasi, Speakon kabel speaker'
  },
  {
    id: 'BKL-06',
    name: '1001RB Bass Head + 410 Neo Cabinet',
    brand: 'Gallien Krueger',
    category: 'Bass Amplifier',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '700W Main + 50W Horn Bi-Amp System, 4-Band Active EQ, Contour & Presence',
    maintenanceSchedule: 'Cek switch mute, ground lift direct XLR out, horn level attenuator'
  },
  {
    id: 'BKL-07',
    name: 'JCM 900 Guitar Head + 1960A 4x12 Cabinet',
    brand: 'Marshall',
    category: 'Guitar Amplifier',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '100W All-Valve Dual Reverb Guitar Head, 4x 5881 Power Valves, 3x ECC83 Preamp',
    maintenanceSchedule: 'Inspeksi bias tabung power, pot kotor kresek, impedansi 4/8/16 Ohm selector'
  },
  {
    id: 'BKL-08',
    name: 'Jazz Chorus JC-120 Guitar Amplifier',
    brand: 'Roland',
    category: 'Guitar Amplifier',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Classic 120W True-Stereo Solid State, 2x 12" Silver Cone Speakers, Dimensional Chorus',
    maintenanceSchedule: 'Tes stereo vibrato/chorus circuit, footswitch jack, pot volume/EQ'
  },
  {
    id: 'BKL-09',
    name: 'KC-550 Keyboard Amplifier',
    brand: 'Roland',
    category: 'Keyboard Amplifier',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '180W 4-Channel Mixing Keyboard Amp, 15" Woofer + Horn Tweeter, Subwoofer Out',
    maintenanceSchedule: 'Inspeksi 4-channel input mixer, XLR line output, horn tweeter tester'
  },
  {
    id: 'BKL-10',
    name: 'RD-700NX / RD-700GX Stage Piano',
    brand: 'Roland',
    category: 'Digital Stage Piano',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '88-Key PHA III Ivory Feel Keyboard with Escapement, SuperNATURAL Piano Engine',
    maintenanceSchedule: 'Sensitivitas tuts keyboard, damper pedal DP-10 kontinuitas, stereo balanced out'
  },
  {
    id: 'BKL-11',
    name: 'RD-800 Stage Piano',
    brand: 'Roland',
    category: 'Digital Stage Piano',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'PHA-4 Concert Keyboard, Tone Color knob, 1100+ Sounds, Live Set Architecture',
    maintenanceSchedule: 'Firmware check, pitch bend wheel centering, kelengkapan adaptor original'
  },
  {
    id: 'BKL-12',
    name: 'RD-2000 Flagship Stage Piano',
    brand: 'Roland',
    category: 'Digital Stage Piano',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Dual Sound Engines (V-Piano + SuperNATURAL), PHA-50 Hybrid Wood/Molded Action',
    maintenanceSchedule: 'LED knob encoders calibration, USB audio interface check, XLR main outputs'
  },
  {
    id: 'BKL-13',
    name: 'PSR-S950 Arranger Workstation',
    brand: 'Yamaha',
    category: 'Arranger Keyboard',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '61-Key Organ Style, Super Articulation Voices, Audio Styles, Vocal Harmony 2',
    maintenanceSchedule: 'LCD display tester, pitch bend/modulation wheel, USB flashdisk socket'
  },
  {
    id: 'BKL-14',
    name: 'Evolution Wireless Digital EW-D 835-S',
    brand: 'Sennheiser',
    category: 'Wireless Microphone',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Digital UHF Handheld System, MMD 835 Cardioid Dynamic Capsule, Smart Assist App',
    maintenanceSchedule: 'Cek voltase baterai AA, pin kontak receiver, scan frekuensi bebas intervensi'
  },
  {
    id: 'BKL-15',
    name: 'SLXD4 Digital Wireless Receiver + Handheld',
    brand: 'Shure',
    category: 'Wireless Microphone',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: '24-Bit Digital Audio, 118 dB Dynamic Range, Predictive Switching Diversity',
    maintenanceSchedule: 'Pengecekan antena BNC 1/2 wave, sinkronisasi IR transmitter-receiver'
  },
  {
    id: 'BKL-16',
    name: 'QLX-D Digital Wireless System',
    brand: 'Shure',
    category: 'Wireless Microphone',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Transparent 24-Bit Digital Audio, Ethernet Networking with WWB6 Integration',
    maintenanceSchedule: 'Network scan via Wireless Workbench, cek bodypack mini 4-pin TA4F'
  },
  {
    id: 'BKL-17',
    name: 'Antenna Distribution System',
    brand: 'Shure',
    category: 'RF Distribution',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Active 4-Way Antenna Splitter, Low Noise Amplification, Cascading Outputs',
    maintenanceSchedule: 'Kabel koaksial RG58/RG8 kontinuitas, tes gain booster paddle antenna'
  },
  {
    id: 'BKL-18',
    name: 'evolution G4 Wireless In-Ear Monitoring',
    brand: 'Sennheiser',
    category: 'In-Ear Monitor (IEM)',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Stereo Transmitter + Bodypack EK IEM G4, IE 4 Earphones, OLED Display',
    maintenanceSchedule: 'Cek earphone jack 3.5mm, tes volume limiter audio, frekuensi RF tuning'
  },
  {
    id: 'BKL-19',
    name: 'DN100 Active Direct Box',
    brand: 'Klark Teknik',
    category: 'DI Box',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'High-Headroom Active DI Box, Transformer Output, 30 dB Input Pad, Ground Lift',
    maintenanceSchedule: 'Pengecekan saklar phantom power 48V LED, saklar ground lift isolasi hum'
  },
  {
    id: 'BKL-20',
    name: 'DI 10A Active Direct Box',
    brand: 'Klark Teknik',
    category: 'DI Box',
    division: 'Audio',
    sourceUrl: 'https://www.rizproduction.id/rental-backline-musical-instrument',
    specs: 'Active Single-Channel DI Box, Midas Design Transformer, Rugged Aluminium Casing',
    maintenanceSchedule: 'Tes impedansi high-Z ke low-Z, jack 1/4" input & link throughput'
  },

  // ─────────────────────────────────────────────────────────────
  // 3. LED VIDEOTRON (https://www.rizproduction.id/rental-led-videotron)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'LED-01',
    name: 'Panel LED 50x50 Cabinet P3.9',
    brand: 'YessTech',
    category: 'LED Screen Module',
    division: 'Videotron',
    sourceUrl: 'https://www.rizproduction.id/rental-led-videotron',
    specs: '500x500mm Die-Cast Magnesium Cabinet, Pixel Pitch 3.91mm, Indoor/Outdoor IP65',
    maintenanceSchedule: 'Test pattern RGBW dead pixel, fast lock alignment, receiving card ribbon'
  },
  {
    id: 'LED-02',
    name: 'VX600 All-in-One LED Controller',
    brand: 'NovaStar',
    category: 'Video Processor',
    division: 'Videotron',
    sourceUrl: 'https://www.rizproduction.id/rental-led-videotron',
    specs: '6 Gigabit Ethernet Outputs (3.9M pixels), HDMI 1.3 / DVI / 3G-SDI Input, 3x Layers',
    maintenanceSchedule: 'Backup file mapping .rcfgx, tes koneksi Cat6 EtherCON LAN port 1-6'
  },
  {
    id: 'LED-03',
    name: 'VX1000 All-in-One LED Controller',
    brand: 'NovaStar',
    category: 'Video Processor',
    division: 'Videotron',
    sourceUrl: 'https://www.rizproduction.id/rental-led-videotron',
    specs: '10 Gigabit Ethernet Outputs (6.5M pixels), 4Kx1K @ 60Hz processing, 3G-SDI loop',
    maintenanceSchedule: 'Firmware maintenance, tes scaling video, EDID configuration'
  },

  // ─────────────────────────────────────────────────────────────
  // 4. LIGHTING SYSTEM (https://www.rizproduction.id/rental-lighting)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'LGT-01',
    name: 'grandMA2 Full-Size Lighting Console',
    brand: 'MA Lighting',
    category: 'Lighting Console',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Real-time control for up to 65,536 parameters, 3 Internal Touchscreens, 30 Motor Faders',
    maintenanceSchedule: 'Kalibrasi touchscreen, backup showfile USB, tes DMX output universe 1-6'
  },
  {
    id: 'LGT-02',
    name: 'grandMA onPC Command Wing',
    brand: 'MA Lighting',
    category: 'Lighting Console',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: '4,096 Parameters with grandMA3 onPC, 2 DMX Outputs, USB Connection to PC/Laptop',
    maintenanceSchedule: 'Inspeksi USB communication port, fader tension, button backlight test'
  },
  {
    id: 'LGT-03',
    name: 'Quartz Compact Lighting Console',
    brand: 'Avolites',
    category: 'Lighting Console',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Titan Operating System, 12.1" Touchscreen, 16 DMX Universes Art-Net, 10 Playback Faders',
    maintenanceSchedule: 'Update Titan personality fixture library, screen calibration, cleaning'
  },
  {
    id: 'LGT-04',
    name: 'Tiger Touch II Lighting Console',
    brand: 'Avolites',
    category: 'Lighting Console',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: '15.6" High-Brightness Touchscreen, 20 Submasters Playback, 4 Physical DMX Out',
    maintenanceSchedule: 'Internal SSD health check, fader dust cleaning, DMX optical isolation'
  },
  {
    id: 'LGT-05',
    name: 'B-EYE K10 LED Moving Wash/Beam',
    brand: 'SPARK',
    category: 'Moving Head Wash/Beam',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: '19x 15W RGBW Osram LEDs, 4° to 60° Electronic Zoom, Rotating Front Lens (Kaleidoscope)',
    maintenanceSchedule: 'Pelumasan rotating lens gear, homing sensor pan/tilt, pembersihan optik'
  },
  {
    id: 'LGT-06',
    name: 'BSW-550 Moving Hybrid (Beam/Spot/Wash)',
    brand: 'Centurion',
    category: 'Moving Head Hybrid',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'High Power Lamp, Linear CMY + CTO Color Mixing, Dual Prism, Gobo Wheels',
    maintenanceSchedule: 'Monitoring jam kerja bohlam (lamp hours), motor gobo wheel alignment'
  },
  {
    id: 'LGT-07',
    name: 'Moving Beam 450 Fixture',
    brand: 'Centurion',
    category: 'Moving Head Beam',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Razor-Sharp 2° Beam Angle, 14 Colors + Open, 17 Fixed Gobos, 8+16 Facet Prism',
    maintenanceSchedule: 'Reset pan/tilt opto-coupler, tes prism rotation, clamp safety wire'
  },
  {
    id: 'LGT-08',
    name: 'Stormy 1000W LED Strobe Stripe',
    brand: 'Pro-Series',
    category: 'Strobe Light',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Linear High-Power White/RGB LED Strobe, Continuous Blinder Effect, 1000W Peak',
    maintenanceSchedule: 'Pengecekan thermal overload sensor, driver DMX pulse, mounting bracket'
  },
  {
    id: 'LGT-09',
    name: 'Mini Brute 400W LED Blinder 4-Eye',
    brand: 'Centurion',
    category: 'Audience Blinder',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: '4x 100W Warm White COB LED (3200K), Individual Cell Control, Dimmer Curves',
    maintenanceSchedule: 'Tes dimmer curve 0-100%, soket powercon link in/out, heat dissipation fan'
  },
  {
    id: 'LGT-10',
    name: 'ParLED 20-18 Outdoor/Indoor',
    brand: 'TRF',
    category: 'PAR LED Wash',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: '18x 20W RGBW 4-in-1 LEDs, IP65 Waterproof Housing, DMX 512 Control',
    maintenanceSchedule: 'Cek seal gasket anti-air, tes flicker-free refresh rate, kabel DMX jumper'
  },
  {
    id: 'LGT-11',
    name: 'Hazer Machine 1500W DMX',
    brand: 'SPARK',
    category: 'Atmospheric Effect',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Continuous Fine Mist Output, Fast Warm-Up, Water-Based Liquid, Low Consumption',
    maintenanceSchedule: 'Flushing nozzle pemanas dengan distilled water, cek level liquid sensor'
  },
  {
    id: 'LGT-12',
    name: 'Fresnel 300W / 200W LED Studio Light',
    brand: 'Pro-Series',
    category: 'Stage / Studio Warm Light',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Manual/Motorized Zoom 15°-50°, High CRI >95, Barn Door Included, Silent Cooling',
    maintenanceSchedule: 'Inspeksi engsel barn door, lensa fresnel akrilik, clamp safety wire'
  },
  {
    id: 'LGT-13',
    name: 'Followspot-Light 350W LED with Stand',
    brand: 'SPARK',
    category: 'Followspot Light',
    division: 'Lighting',
    sourceUrl: 'https://www.rizproduction.id/rental-lighting',
    specs: 'Iris Focus Control, 5 Color Filters + CTO, Ergonomic Handle, Heavy Duty Stand',
    maintenanceSchedule: 'Pelumasan mekanisme iris & slider zoom manual, tes kestabilan tripod'
  },

  // ─────────────────────────────────────────────────────────────
  // 5. STREAMING & MULTIMEDIA (https://www.rizproduction.id/rental-streaming-multimedia)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'MM-01',
    name: 'PXW-Z190 4K 3-CMOS Camcorder',
    brand: 'Sony',
    category: 'Professional Broadcast Camera',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: '3x 1/3-Type Exmor R CMOS Sensors, 4K 60p Recording, 25x Optical Zoom, 3G-SDI Output',
    maintenanceSchedule: 'Pembersihan sensor/lensa optik, tes output 3G-SDI, cek baterai BP-U'
  },
  {
    id: 'MM-02',
    name: 'HXR-NX100 Full HD Camcorder',
    brand: 'Sony',
    category: 'Professional Camcorder',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: '1.0-Type Exmor R CMOS Sensor, 12x Optical G-Lens (24x Clear Image Zoom), HDMI/BNC',
    maintenanceSchedule: 'Inspeksi zoom rocker & manual ring, port HDMI out, slot SD Card Dual'
  },
  {
    id: 'MM-03',
    name: 'UltraLITE Full Duplex Wireless Intercom',
    brand: 'Eartec / UltraLITE',
    category: 'Intercom System',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'Self-Contained Headsets (No Beltpack), 1.9 GHz DECT Frequency, 400m Range',
    maintenanceSchedule: 'Cek charging dock baterai Lithium, microphone boom auto-mute switch'
  },
  {
    id: 'MM-04',
    name: 'Solidcom C1 Pro Wireless Intercom',
    brand: 'Hollyland',
    category: 'Intercom System',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'Dual-Mic ENC Noise Cancellation, 1100ft (350m) Range, Full-Duplex Talk',
    maintenanceSchedule: 'Pembersihan bantalan telinga headset, update pairing master-remote'
  },
  {
    id: 'MM-05',
    name: 'High-End Broadcast Streaming PC Core i9-14900KF',
    brand: 'Custom Production Rig',
    category: 'Workstation Streaming & Playback',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'Intel Core i9-14900KF, 64GB DDR5, RTX 4080 16GB, Blackmagic DeckLink Quad 2 8-SDI',
    maintenanceSchedule: 'Pembersihan debu filter fan, benchmarking stress test vMix/Resolume, software update'
  },
  {
    id: 'MM-06',
    name: 'ATEM Television Studio Pro 4K / HD 8-Ch',
    brand: 'Blackmagic Design',
    category: 'Live Video Switcher',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: '8-Channel SDI/HDMI Switcher with Integrated Hardware Control Panel & T-Bar',
    maintenanceSchedule: 'Kalibrasi T-Bar fader transisi, tes multiview HDMI/SDI out, talkback jack'
  },
  {
    id: 'MM-07',
    name: 'HyperDeck Studio HD Plus Recorder',
    brand: 'Blackmagic Design',
    category: 'Broadcast Deck Recorder',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'ProRes / DNx / H.264 Dual SD & SSD Recording, 6G-SDI In/Out, Search Dial Jog',
    maintenanceSchedule: 'Format & benchmark kartu SD UHS-II, cek audio meters, jog shuttle test'
  },
  {
    id: 'MM-08',
    name: 'Cosmo C1 SDI/HDMI Wireless Video System',
    brand: 'Hollyland',
    category: 'Wireless Video Transmission',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'HEVO Wireless Tech, 1000ft Range, Ultra-Low 40ms Latency, SDI & HDMI Cross-Conversion',
    maintenanceSchedule: 'Cek konektor antena mushroom BNC, tes latency transmitter ke receiver'
  },
  {
    id: 'MM-09',
    name: 'CineEye 2 Pro Wireless Video Transmitter',
    brand: 'Accsoon',
    category: 'Wireless Video Transmission',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'Dual-Band (2.4GHz + 5GHz) Transmission, 1200ft Range, Receiver + iOS/Android App',
    maintenanceSchedule: 'Pairing channel scan, tes battery plate NP-F mount, HDMI passthrough'
  },
  {
    id: 'MM-10',
    name: 'TH-X / TH-650 Professional Fluid Head Tripod',
    brand: 'Libec',
    category: 'Camera Support Tripod',
    division: 'Multimedia',
    sourceUrl: 'https://www.rizproduction.id/rental-streaming-multimedia',
    specs: 'Dual Head (Flat Base & 65mm Bowl), Smooth Pan/Tilt Drag, Mid-Level Spreader',
    maintenanceSchedule: 'Tes fluid friction drag, pengencangan quick release plate, waterpass bubble'
  },

  // ─────────────────────────────────────────────────────────────
  // 6. STAGE, RIGGING & CUSTOM PRODUCTION (https://www.rizproduction.id/rental-custom-event-production)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'STG-01',
    name: 'Heavy Duty Aluminium Rigging Truss System',
    brand: 'Custom Setup RIZ',
    category: 'Stage & Rigging',
    division: 'Gudang',
    sourceUrl: 'https://www.rizproduction.id/rental-custom-event-production',
    specs: 'Spigot Connection 40x40cm Box Truss, Aluminium 6082-T6, Rigging Tower & Motor Hoist',
    maintenanceSchedule: 'Inspeksi pin spigot pengunci, safety R-clip, kelurusan chord pipa'
  },
  {
    id: 'STG-02',
    name: 'Entrance Gate Thematic 3D Rigging',
    brand: 'Custom Setup RIZ',
    category: 'Event Entrance Gate',
    division: 'Gudang',
    sourceUrl: 'https://www.rizproduction.id/rental-custom-event-production',
    specs: 'Modular Timber & Truss Hybrid Gate, Integrated LED Neon Flex & Branding Panel',
    maintenanceSchedule: 'Pengecekan ballast pemberat gate, kestabilan struktur angin outdoor'
  },
  {
    id: 'STG-03',
    name: 'PhotoBooth & Thematic Event Backdrop',
    brand: 'Custom Setup RIZ',
    category: 'Stage Backdrop & Booth',
    division: 'Gudang',
    sourceUrl: 'https://www.rizproduction.id/rental-custom-event-production',
    specs: '3D Embossed Backdrop with Spotlighting, Carpet Flooring & Media Wall Display',
    maintenanceSchedule: 'Pengecekan rangka kayu multiplek, kebersihan cat finishing & vinyl visual'
  },
  {
    id: 'STG-04',
    name: 'Mojo Crowd Control Barrier',
    brand: 'Custom Setup RIZ',
    category: 'Crowd Safety Barrier',
    division: 'Gudang',
    sourceUrl: 'https://www.rizproduction.id/rental-custom-event-production',
    specs: 'Heavy Duty Aluminium / Galvanized Steel Folding Barrier with Step Plate',
    maintenanceSchedule: 'Pengecekan pin engsel lipat, sambungan interlocking bolt, pijakan anti-slip'
  }
];
