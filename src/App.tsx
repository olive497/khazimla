import { useState, useRef, useEffect } from 'react'

type Role = 'farmer' | 'business' | null
type FarmerTab = 'health' | 'security'
type BusinessTab = 'inspection' | 'intake' | 'auction'
type Language = 'en' | 'zu' | 'xh' | 'nso' | 'st' | 'af'
type FilterBy = 'tag' | 'breed' | 'status'

const LANG_LABELS: Record<Language, string> = {
  en: 'English', zu: 'isiZulu', xh: 'isiXhosa', nso: 'Sepedi', st: 'Sesotho', af: 'Afrikaans',
}

const TR: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Ukhazimula Konnect', tagline: 'Smart Livestock Management',
    chooseRole: 'Choose your role to continue', farmer: 'Farmer', business: 'Business',
    farmerDesc: 'Manage your herd, monitor animal health & secure your farm perimeter',
    businessDesc: 'Slaughterhouse & auction operations, traceability, inspection & lot management',
    online: 'Online · Synced', offline: 'Offline · Pending',
    search: 'Search by Tag, Breed or Status…', addAnimal: 'Tap to Add Animal',
    farmBook: 'Digital Farm Book', farmWatch: 'Farm Watch & SMS',
    geofenceActive: 'Geofence Active — Perimeter Secure',
    emergency: 'One-Tap Police / Insurance Report',
    inspection: 'Health Inspection', intake: 'Animal Intake', auction: 'Auction Lots',
    temperature: 'Body Temp', heartRate: 'Heart Rate', respiration: 'Respiration',
    bodyCondition: 'Body Score', milkYield: 'Milk Yield', vaccination: 'Vaccination',
    deworming: 'Deworming', reproStatus: 'Repro Status',
    healthy: 'Healthy', monitor: 'Monitor', critical: 'Critical',
    aiTitle: 'Farm Flow AI Assistant',
    aiPlaceholder: 'Ask me about your herd, grazing, prices…',
    aiGreet: "Sawubona! I'm Farm Flow AI. Ask me about herd health, grazing schedules, market prices, or vet advice.",
    support: 'Support', docs: 'Documentation',
    copyright: '© 2026 Ukhazimula Konnect. All rights reserved.',
    biometrics: 'Biometrics — Cow #12', filterTag: 'Tag ID', filterBreed: 'Breed', filterStatus: 'Status',
    allAnimals: 'All Animals', recentAlerts: 'Recent Boundary Alerts', resolved: 'Resolved', active: 'Active',
    smsContacts: 'SMS sent to', contacts: 'contacts', noAlerts: 'No active alerts — perimeter clear.',
    lotId: 'Lot ID', animals: 'Animals', avgWeight: 'Avg. Weight', inspector: 'Inspector', date: 'Date',
    reserve: 'Reserve', estimate: 'Price Estimate', bidders: 'Bidders',
    businessPriority: 'Health & Inspection Dashboard', intakeTitle: 'Live Animal Intake', auctionTitle: 'Auction Lot Manager',
    weight: 'Weight', age: 'Age', months: 'mo', kg: 'kg',
  },
  zu: {
    appName: 'Ukhazimula Konnect', tagline: 'Ukuphathwa Kwezifuyo Okuhlakanipha',
    chooseRole: 'Khetha indima yakho uqhubeke', farmer: 'Umlimi', business: 'Ibhizinisi',
    farmerDesc: 'Phatha umhlambi wakho, qaphela impilo, uvikele ipulazi lakho',
    businessDesc: 'Ukungeniswa kwezifuyo, ukuphathwa kwezivumelwano',
    online: 'Ku-inthanethi · Kuvumelanisiwe', offline: 'Ngaphandle · Kulindile',
    search: 'Sesha nge-Tag, Uhlobo noma Isimo…', addAnimal: 'Thepha Ukengeza Isilwane',
    farmBook: 'Incwadi Yepulazi', farmWatch: 'Umlindi Wepulazi',
    geofenceActive: 'Umngcele Uyasebenza — Ukuvikeleka Kwezwe',
    emergency: 'Umbiko Wamaphoyisa / Umshwalense',
    inspection: 'Ukuhlolwa Kwempilo', intake: 'Ukungena Kwezilwane', auction: 'Izinhlobo Zokhankaso',
    temperature: 'Umzimba', heartRate: 'Inhliziyo', respiration: 'Ukuphefumula',
    bodyCondition: 'Isimo', milkYield: 'Ubisi', vaccination: 'Umgomo',
    deworming: 'Izinambuzane', reproStatus: 'Ukuzala',
    healthy: 'Uphile', monitor: 'Qaphela', critical: 'Engozi',
    aiTitle: 'Farm Flow AI', aiPlaceholder: 'Buza mayelana nomhlambi wakho…',
    aiGreet: 'Sawubona! Ngingusizo mayelana nezifuyo zakho, amandla, nezintengo.',
    support: 'Usizo', docs: 'Amandla', copyright: '© 2026 Ukhazimula Konnect.',
    biometrics: 'Izinkomba Zebhayomethriksi — Inkomo #12', filterTag: 'Inombolo', filterBreed: 'Uhlobo', filterStatus: 'Isimo',
    allAnimals: 'Zonke Izilwane', recentAlerts: 'Izexwayiso Zamuva', resolved: 'Kusonjululwe', active: 'Kusebenza',
    smsContacts: 'I-SMS ithunyelwe ku', contacts: 'oxhumana', noAlerts: 'Akukho zexwayiso — umngcele uhlanzekile.',
    lotId: 'Inombolo', animals: 'Izilwane', avgWeight: 'Isisindo', inspector: 'Umhloli', date: 'Usuku',
    reserve: 'Okugcinwe', estimate: 'Isibalo', bidders: 'Ababolekwa',
    businessPriority: 'Iphephadatha Lempilo', intakeTitle: 'Ukungena Kwezilwane', auctionTitle: 'Ukuphatha Izinhlangano',
    weight: 'Isisindo', age: 'Ubudala', months: 'izinyanga', kg: 'kg',
  },
  xh: {
    appName: 'Ukhazimula Konnect', tagline: 'Ulawulo Lwemfuyo Olukrelekrele',
    chooseRole: 'Khetha indima yakho uqhubeke', farmer: 'Umlimi', business: 'Ishishini',
    farmerDesc: 'Lawula umhlambi, gcina impilo, vikela ipulazi lakho',
    businessDesc: 'Ukungena kwezilwanyana, ukulawulwa kwezivumelwano',
    online: 'Kwi-intanethi · Isivumelanisiwe', offline: 'Ngaphandle · Ilindile',
    search: 'Khangela nge-Tag, Uhlobo okanye Imeko…', addAnimal: 'Cofa Ukongeza Isilwanyana',
    farmBook: 'Incwadi Yepulazi', farmWatch: 'Umlindi Wepulazi',
    geofenceActive: 'Umda Uyasebenza — Ukhuseleko Lwenqanaba',
    emergency: 'Ingxelo Yamapholis / Umshwalense',
    inspection: 'Ukuhlolwa Kwempilo', intake: 'Ukungena', auction: 'Ukubhida',
    temperature: 'Ubushushu', heartRate: 'Intliziyo', respiration: 'Ukuphefumla',
    bodyCondition: 'Imeko', milkYield: 'Ubisi', vaccination: 'Umgomo',
    deworming: 'Iintsholongwane', reproStatus: 'Ukuzala',
    healthy: 'Uphilile', monitor: 'Qaphela', critical: 'Ingozi',
    aiTitle: 'Farm Flow AI', aiPlaceholder: 'Buza malunga nomhlambi wakho…',
    aiGreet: 'Molo! Ndingakunceda ngemfuyo yakho, amalungiselelo, nezixabiso.',
    support: 'Inkxaso', docs: 'Amaxwebhu', copyright: '© 2026 Ukhazimula Konnect.',
    biometrics: 'Izilinganiso Zebhayometriksi — Inkomo #12', filterTag: 'Inombolo', filterBreed: 'Uhlobo', filterStatus: 'Imeko',
    allAnimals: 'Zonke Izilwanyana', recentAlerts: 'Iindaba Zaposend', resolved: 'Kulungisiwe', active: 'Kusebenza',
    smsContacts: 'I-SMS ithunyelwe ku', contacts: 'oxhumana', noAlerts: 'Akukho ndaba — umda ucociwe.',
    lotId: 'Inombolo', animals: 'Izilwanyana', avgWeight: 'Ubunzima', inspector: 'Umgcini', date: 'Umhla',
    reserve: 'Okugcinwe', estimate: 'Isicwangciso', bidders: 'Ababhidi',
    businessPriority: 'Ikhasi Lempilo', intakeTitle: 'Ukungena Kwezilwanyana', auctionTitle: 'Ulawulo Lwezithuba',
    weight: 'Ubunzima', age: 'Ubudala', months: 'iinyanga', kg: 'kg',
  },
  nso: {
    appName: 'Ukhazimula Konnect', tagline: 'Taolo ya Diruiwa tsa Bohlale',
    chooseRole: 'Kgetha karolo ya gago go tšwela pele', farmer: 'Molemegi', business: 'Kgwebo',
    farmerDesc: 'Laola lešoka la gago, hlokomela bophelo, šireletša polase ya gago',
    businessDesc: 'Tšeašo ya diruiwa, taolo ya dithulaganyo',
    online: 'Inthanete · Go kopantšwe', offline: 'Ntle · E letile',
    search: 'Nyaka ka Tag, Mofuta goba Maemo…', addAnimal: 'Kgotla go Oketša Sešidi',
    farmBook: 'Buka ya Polase', farmWatch: 'Lekolelo la Polase',
    geofenceActive: 'Mollwane o a Šoma — Go Fiwa Tšhireletšo',
    emergency: 'Tlaleho ya Maphodisa / Inšorense',
    inspection: 'Tšekatšeko ya Bophelo', intake: 'Go Tšeša', auction: 'Phetiše',
    temperature: 'Mogote', heartRate: 'Pelo', respiration: 'Go Hema',
    bodyCondition: 'Maemo', milkYield: 'Lebese', vaccination: 'Ente',
    deworming: 'Dibupiwa', reproStatus: 'Tšalo',
    healthy: 'O Phela', monitor: 'Hlokomela', critical: 'Kotsi',
    aiTitle: 'Farm Flow AI', aiPlaceholder: 'Botšiša ka lešoka la gago…',
    aiGreet: 'Dumela! Ke thušo ya temo ya gago, bophelo le mebaraka.',
    support: 'Thušo', docs: 'Manwalo', copyright: '© 2026 Ukhazimula Konnect.',
    biometrics: 'Dipalopalo — Kgomo #12', filterTag: 'Nomoro', filterBreed: 'Mofuta', filterStatus: 'Maemo',
    allAnimals: 'Diruiwa Kamoka', recentAlerts: 'Dipolelo tša Moragorago', resolved: 'Go Rarulwa', active: 'Go Šoma',
    smsContacts: 'SMS e romeletšwe go', contacts: 'batho', noAlerts: 'Ga go na dipolelo — mollwane o hlwekile.',
    lotId: 'Nomoro', animals: 'Diruiwa', avgWeight: 'Boima', inspector: 'Mohlodi', date: 'Letšatši',
    reserve: 'Go Bolokwa', estimate: 'Tekanyetšo', bidders: 'Babidi',
    businessPriority: 'Papetla ya Bophelo', intakeTitle: 'Go Tšeša Diruiwa', auctionTitle: 'Taolo ya Diphetiše',
    weight: 'Boima', age: 'Mengwaga', months: 'dikgwedi', kg: 'kg',
  },
  st: {
    appName: 'Ukhazimula Konnect', tagline: 'Tsamaiso ea Liphoofolo tsa Botsebi',
    chooseRole: 'Khetha karolo ea hao ho tswela pele', farmer: 'Molemisi', business: 'Khoebo',
    farmerDesc: 'Laola mohlapana oa hao, hlokomela bophelo, sireletsa polase ea hao',
    businessDesc: 'Ho kena ha liphoofolo, tsamaiso ea likamano',
    online: 'Inthanete · Ho kopantswe', offline: 'Kantle · E emetse',
    search: 'Batla ka Tag, Mofuta kapa Boemo…', addAnimal: 'Tobetsa ho Eketsa Phooofolo',
    farmBook: 'Buka ea Polase', farmWatch: 'Letlotlo la Polase',
    geofenceActive: 'Moeli o a Sebetsa — Polokelo ea Lebala',
    emergency: 'Tlaleho ea Mapolesa / Inshorense',
    inspection: 'Tlhahlobo ea Bophelo', intake: 'Ho Kenya', auction: 'Ho Hira',
    temperature: 'Mocheso', heartRate: 'Pelo', respiration: 'Ho hema',
    bodyCondition: 'Boemo', milkYield: 'Lebese', vaccination: 'Ente',
    deworming: 'Dinoha', reproStatus: 'Tsoalo',
    healthy: 'O Phela', monitor: 'Hlokomela', critical: 'Kotsing',
    aiTitle: 'Farm Flow AI', aiPlaceholder: 'Botsa ka mohlapana oa hao…',
    aiGreet: 'Lumela! Ke thuso ea temo ea hao, bophelo le mebaraka.',
    support: 'Tšehetso', docs: 'Litokomane', copyright: '© 2026 Ukhazimula Konnect.',
    biometrics: 'Lipalo — Kgomo #12', filterTag: 'Nomoro', filterBreed: 'Mofuta', filterStatus: 'Boemo',
    allAnimals: 'Liphoofolo Tsohle', recentAlerts: 'Lintlha tsa Morao-rao', resolved: 'Ho Raroa', active: 'Ho Sebetsa',
    smsContacts: 'SMS e rometsoe ho', contacts: 'batho', noAlerts: 'Ha ho lintlha — moeli o hloekiloe.',
    lotId: 'Nomoro', animals: 'Liphoofolo', avgWeight: 'Boima', inspector: 'Mopatlisisi', date: 'Letsatsi',
    reserve: 'Ho Boloka', estimate: 'Tekanyetso', bidders: 'Babidi',
    businessPriority: 'Letlapa la Bophelo', intakeTitle: 'Ho Kenya Liphoofolo', auctionTitle: 'Tsamaiso ea Lisenyo',
    weight: 'Boima', age: 'Lilemo', months: 'likhoeli', kg: 'kg',
  },
  af: {
    appName: 'Ukhazimula Konnect', tagline: 'Slim Vee Bestuur',
    chooseRole: 'Kies jou rol om voort te gaan', farmer: 'Boer', business: 'Besigheid',
    farmerDesc: 'Bestuur jou trop, monitor dieregesondheid & beveilig jou plaas',
    businessDesc: 'Slagpale & veilingbedrywighede, naspeurbaarheid, inspeksie',
    online: 'Aanlyn · Gesinkroniseer', offline: 'Vanlyn · Wag',
    search: 'Soek per Tag, Ras of Status…', addAnimal: 'Tik om Dier By te Voeg',
    farmBook: 'Digitale Plaasboekie', farmWatch: 'Plaas Wag & SMS',
    geofenceActive: 'Geosperking Aktief — Omtrek Veilig',
    emergency: 'Een-Druk Polisie / Versekering Verslag',
    inspection: 'Gesondheid Inspeksie', intake: 'Dier Inname', auction: 'Veiling Klappe',
    temperature: 'Liggaamstemperatuur', heartRate: 'Hartklop', respiration: 'Asemhaling',
    bodyCondition: 'Liggaamstoestand', milkYield: 'Melkopbrengs', vaccination: 'Inenting',
    deworming: 'Ontworming', reproStatus: 'Reproduksiestatus',
    healthy: 'Gesond', monitor: 'Monitor', critical: 'Krities',
    aiTitle: 'Farm Flow KI Assistent', aiPlaceholder: 'Vra oor jou trop, beweiding, pryse…',
    aiGreet: 'Goeiedag! Ek is Farm Flow KI. Vra my oor tropdiergesondheid, beweidingskeduling, of markpryse.',
    support: 'Ondersteuning', docs: 'Dokumentasie', copyright: '© 2026 Ukhazimula Konnect. Alle regte voorbehou.',
    biometrics: 'Biometrika — Koei #12', filterTag: 'Etiket ID', filterBreed: 'Ras', filterStatus: 'Status',
    allAnimals: 'Alle Diere', recentAlerts: 'Onlangse Grenswaarskuwings', resolved: 'Opgelos', active: 'Aktief',
    smsContacts: 'SMS gestuur aan', contacts: 'kontakte', noAlerts: 'Geen aktiewe waarskuwings — omtrek duidelik.',
    lotId: 'Lot ID', animals: 'Diere', avgWeight: 'Gem. Gewig', inspector: 'Inspekteur', date: 'Datum',
    reserve: 'Reserwe', estimate: 'Prysberaming', bidders: 'Bieërs',
    businessPriority: 'Gesondheid & Inspeksie Paneelbord', intakeTitle: 'Lewendige Dier Inname', auctionTitle: 'Veiling Lot Bestuurder',
    weight: 'Gewig', age: 'Ouderdom', months: 'mnd', kg: 'kg',
  },
}

const ANIMALS = [
  { id: 'NGU-001', name: 'Cow #12', type: 'Nguni Cow', breed: 'Nguni', weight: 412, age: 36, status: 'healthy', img: 'https://images.unsplash.com/photo-1698342290314-1a6b71e8a839?w=300&h=300&fit=crop&auto=format' },
  { id: 'BRH-007', name: 'Bull #07', type: 'Brahman Bull', breed: 'Brahman', weight: 680, age: 48, status: 'monitor', img: 'https://images.unsplash.com/photo-1772187900597-dca19d1d56bb?w=300&h=300&fit=crop&auto=format' },
  { id: 'NGU-015', name: 'Calf #15', type: 'Nguni Calf', breed: 'Nguni', weight: 89, age: 4, status: 'healthy', img: 'https://images.unsplash.com/photo-1785974661946-fe6a2adfe618?w=300&h=300&fit=crop&auto=format' },
  { id: 'DRB-003', name: 'Cow #03', type: 'Drakensberger', breed: 'Drakensberger', weight: 388, age: 29, status: 'critical', img: 'https://images.unsplash.com/photo-1653180422275-8edfc78dd593?w=300&h=300&fit=crop&auto=format' },
  { id: 'AFR-009', name: 'Heifer #09', type: 'Afrikaner', breed: 'Afrikaner', weight: 295, age: 18, status: 'healthy', img: 'https://images.unsplash.com/photo-1698342290314-1a6b71e8a839?w=300&h=300&fit=crop&auto=format' },
  { id: 'BRH-011', name: 'Steer #11', type: 'Brahman Steer', breed: 'Brahman', weight: 520, age: 24, status: 'monitor', img: 'https://images.unsplash.com/photo-1777839327784-d24aea3e971e?w=300&h=300&fit=crop&auto=format' },
]

const BIOMETRICS = [
  { key: 'temperature', value: '38.7°C', normal: '38.0–39.5°C', status: 'healthy', icon: '🌡️' },
  { key: 'heartRate', value: '72 bpm', normal: '60–80 bpm', status: 'healthy', icon: '♥' },
  { key: 'respiration', value: '24 /min', normal: '12–30 /min', status: 'healthy', icon: '◎' },
  { key: 'bodyCondition', value: '6.5 / 9', normal: '5–7 optimal', status: 'healthy', icon: '▣' },
  { key: 'milkYield', value: '8.2 L/day', normal: '7–12 L/day', status: 'healthy', icon: '◈' },
  { key: 'vaccination', value: 'FMD · 14 Mar 2026', normal: 'Next: Sep 2026', status: 'healthy', icon: '⊕' },
  { key: 'deworming', value: '01 Jun 2026', normal: 'Next: Sep 2026', status: 'monitor', icon: '⊗' },
  { key: 'reproStatus', value: 'Pregnant · 6mo', normal: 'ECD: Feb 2027', status: 'healthy', icon: '◉' },
]

const ALERTS = [
  { id: 1, animal: 'Cow #12', event: 'left boundary', time: '2:14 AM', date: 'Today', contacts: 3, severity: 'high', resolved: false },
  { id: 2, animal: 'Bull #07', event: 'approached perimeter fence', time: '11:48 PM', date: 'Yesterday', contacts: 2, severity: 'medium', resolved: true },
  { id: 3, animal: 'Heifer #09', event: 'returned within boundary', time: '6:33 AM', date: 'Yesterday', contacts: 0, severity: 'low', resolved: true },
  { id: 4, animal: 'Calf #15', event: 'GPS signal lost 8 min', time: '3:05 AM', date: '13 Aug', contacts: 3, severity: 'high', resolved: true },
]

const INTAKE_LOTS = [
  { lot: 'LOT-4821', count: 24, breed: 'Nguni', avgWeight: '398 kg', status: 'Passed', inspector: 'Dr. M. Dlamini', date: '15 Aug 2026' },
  { lot: 'LOT-4822', count: 12, breed: 'Brahman', avgWeight: '521 kg', status: 'Hold', inspector: 'Dr. N. Mokoena', date: '15 Aug 2026' },
  { lot: 'LOT-4819', count: 36, breed: 'Afrikaner', avgWeight: '345 kg', status: 'Passed', inspector: 'Dr. M. Dlamini', date: '14 Aug 2026' },
  { lot: 'LOT-4817', count: 8, breed: 'Drakensberger', avgWeight: '412 kg', status: 'Rejected', inspector: 'Dr. T. Sithole', date: '13 Aug 2026' },
]

const AUCTION_LOTS = [
  { id: 'AUC-221', desc: '8× Nguni Cows (prime breeding)', reserve: 'R 4,200', estimate: 'R 5,800 – R 7,200', status: 'Live', bidders: 14 },
  { id: 'AUC-222', desc: '3× Brahman Bulls (18–24 mo)', reserve: 'R 8,500', estimate: 'R 11,000 – R 15,000', status: 'Upcoming', bidders: 0 },
  { id: 'AUC-220', desc: '15× Drakensberger Heifers', reserve: 'R 3,600', estimate: 'R 4,500 – R 6,800', status: 'Closed', bidders: 9 },
]

const HEALTH_INSPECTIONS = [
  { id: 'INS-8801', lot: 'LOT-4821', breed: 'Nguni', count: 24, fmd: 'Clear', brucellosis: 'Clear', tbTest: 'Negative', carcassGrade: 'A', meatTemp: '4.2°C', inspector: 'Dr. M. Dlamini', passed: true },
  { id: 'INS-8802', lot: 'LOT-4822', breed: 'Brahman', count: 12, fmd: 'Suspected', brucellosis: 'Clear', tbTest: 'Pending', carcassGrade: '—', meatTemp: '—', inspector: 'Dr. N. Mokoena', passed: false },
  { id: 'INS-8799', lot: 'LOT-4819', breed: 'Afrikaner', count: 36, fmd: 'Clear', brucellosis: 'Clear', tbTest: 'Negative', carcassGrade: 'B+', meatTemp: '3.8°C', inspector: 'Dr. M. Dlamini', passed: true },
]

interface ChatMsg { role: 'user' | 'assistant'; text: string }

const AI_RESPONSES: Record<string, string> = {
  default: "I can help with herd health trends, grazing schedules, market prices, vet contacts, and disease alerts. What would you like to know?",
  health: "Cow #12 is in good condition. Body temperature (38.7°C) and heart rate (72 bpm) are within normal range. Consider scheduling a follow-up deworming in September.",
  price: "Current Nguni Cow prices in Limpopo: R 4,800–R 6,200 live weight. Brahman Bulls command a premium at R 9,000–R 14,500. Auction day is every Friday at Mokopane.",
  grazing: "With current rainfall (Limpopo average 34mm), I recommend rotating to the eastern pasture block. Rest your western camps for at least 21 days to allow regrowth.",
  disease: "FMD risk level in your area is currently LOW. Ensure all animals are vaccinated before September. Lumpy Skin Disease cases reported 80km north — monitor your herd closely.",
}

function getAIResponse(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('health') || lower.includes('sick') || lower.includes('cow')) return AI_RESPONSES.health
  if (lower.includes('price') || lower.includes('market') || lower.includes('sell')) return AI_RESPONSES.price
  if (lower.includes('graz') || lower.includes('grass') || lower.includes('pasture')) return AI_RESPONSES.grazing
  if (lower.includes('disease') || lower.includes('fmd') || lower.includes('virus')) return AI_RESPONSES.disease
  return AI_RESPONSES.default
}

function StatusBadge({ status, lang }: { status: string; lang: Language }) {
  const label = TR[lang][status] || status
  const cls = status === 'healthy' ? 'status-healthy' : status === 'monitor' ? 'status-monitor' : 'status-critical'
  return (
    <span className={`${cls} text-xs font-mono px-2 py-0.5 rounded-full font-medium tracking-wide`}>
      {label}
    </span>
  )
}

function OnboardingScreen({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: '#080f0b' }}>
      {/* Brand header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-8 pb-4">
        <div className="text-center">
          <div className="font-display text-2xl md:text-3xl text-white tracking-tight">
            Ukhazimula <span style={{ color: '#3db560' }}>Konnect</span>
          </div>
          <div className="font-mono text-xs mt-1" style={{ color: '#7aab87', letterSpacing: '0.12em' }}>
            SMART LIVESTOCK MANAGEMENT
          </div>
        </div>
      </div>

      {/* Farmer panel */}
      <button
        onClick={() => onSelect('farmer')}
        className="flex-1 relative flex flex-col items-center justify-center min-h-[50vh] md:min-h-screen overflow-hidden group cursor-pointer transition-all duration-500 text-left"
        style={{ border: 'none', background: 'transparent' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1785974661946-fe6a2adfe618?w=900&h=1200&fit=crop&auto=format')` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(8,15,11,0.82) 0%, rgba(8,15,11,0.65) 60%, rgba(8,15,11,0.5) 100%)' }}
        />
        <div className="relative z-10 px-8 md:px-12 max-w-md slide-up text-left">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 glass" style={{ border: '1px solid rgba(61,181,96,0.35)' }}>
            🌾
          </div>
          <div className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
            Farmer
          </div>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#a8cfb4' }}>
            Manage your herd, monitor animal health &amp; secure your farm perimeter with GPS tracking and SMS alerts.
          </p>
          <div
            className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5"
            style={{ background: '#3db560', color: '#080f0b', boxShadow: '0 4px 20px rgba(61,181,96,0.25)' }}
          >
            <span>Enter as Farmer</span>
            <span style={{ fontSize: '1.1em' }}>→</span>
          </div>
        </div>
      </button>

      {/* Divider */}
      <div className="hidden md:flex flex-col items-center justify-center z-10 px-3">
        <div className="h-32 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,162,39,0.4), transparent)' }} />
        <div className="w-8 h-8 rounded-full glass-gold flex items-center justify-center text-xs font-mono my-2" style={{ color: '#c9a227' }}>
          OR
        </div>
        <div className="h-32 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,162,39,0.4), transparent)' }} />
      </div>
      <div className="flex md:hidden items-center justify-center py-2 z-10 px-6">
        <div className="flex-1 h-px" style={{ background: 'rgba(201,162,39,0.3)' }} />
        <span className="mx-4 text-xs font-mono" style={{ color: '#c9a227' }}>OR</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(201,162,39,0.3)' }} />
      </div>

      {/* Business panel */}
      <button
        onClick={() => onSelect('business')}
        className="flex-1 relative flex flex-col items-center justify-center min-h-[50vh] md:min-h-screen overflow-hidden group cursor-pointer transition-all duration-500 text-left"
        style={{ border: 'none', background: 'transparent' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1772187900597-dca19d1d56bb?w=900&h=1200&fit=crop&auto=format')` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(225deg, rgba(8,15,11,0.82) 0%, rgba(8,15,11,0.65) 60%, rgba(8,15,11,0.5) 100%)' }}
        />
        <div className="relative z-10 px-8 md:px-12 max-w-md slide-up text-left">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 glass-gold">
            🏛️
          </div>
          <div className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
            Business
          </div>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#a8cfb4' }}>
            Slaughterhouse &amp; auction operations. High-throughput animal intake, traceability, health inspection &amp; lot management.
          </p>
          <div
            className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5"
            style={{ background: '#c9a227', color: '#080f0b', boxShadow: '0 4px 20px rgba(201,162,39,0.25)' }}
          >
            <span>Enter as Business</span>
            <span style={{ fontSize: '1.1em' }}>→</span>
          </div>
        </div>
      </button>
    </div>
  )
}

function Header({
  lang, setLang, role, isOnline, onBack
}: {
  lang: Language; setLang: (l: Language) => void; role: Role; isOnline: boolean; onBack: () => void
}) {
  const [showLang, setShowLang] = useState(false)
  const tr = TR[lang]

  return (
    <header className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(61,181,96,0.15)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
        {/* Logo */}
        <button onClick={onBack} className="flex items-center gap-2.5 mr-1 shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(61,181,96,0.2)', border: '1px solid rgba(61,181,96,0.35)' }}>
            🐄
          </div>
          <span className="font-display text-lg text-white hidden sm:block">Ukhazimula <span style={{ color: '#3db560' }}>K</span></span>
        </button>

        {/* Role tag */}
        <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style={{ background: role === 'business' ? 'rgba(201,162,39,0.15)' : 'rgba(61,181,96,0.12)', color: role === 'business' ? '#c9a227' : '#3db560', border: `1px solid ${role === 'business' ? 'rgba(201,162,39,0.3)' : 'rgba(61,181,96,0.25)'}` }}>
          {role === 'business' ? '🏛 BUSINESS' : '🌾 FARMER'}
        </div>

        {/* Search */}
        <div className="flex-1 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl mx-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(61,181,96,0.12)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7aab87" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#4a7a57]"
            style={{ color: '#e8f5ec' }}
            placeholder={tr.search}
          />
        </div>

        {/* Weather */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(61,181,96,0.1)' }}>
          <span>⛅</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#e8f5ec' }}>24°C</div>
            <div className="text-[10px] font-mono" style={{ color: '#7aab87' }}>Limpopo</div>
          </div>
        </div>

        {/* Sync status */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono shrink-0 ${isOnline ? 'status-healthy' : 'status-monitor'}`}>
          <div className={`w-1.5 h-1.5 rounded-full pulse-dot ${isOnline ? 'bg-[#3db560]' : 'bg-[#f59e0b]'}`} />
          <span className="hidden lg:block">{isOnline ? tr.online : tr.offline}</span>
        </div>

        {/* Language picker */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(61,181,96,0.15)', color: '#7aab87' }}
          >
            🌐 <span className="uppercase">{lang}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {showLang && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50 fade-in" style={{ background: '#122318', border: '1px solid rgba(61,181,96,0.2)' }}>
              {(Object.entries(LANG_LABELS) as [Language, string][]).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => { setLang(code); setShowLang(false) }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(61,181,96,0.1)]"
                  style={{ color: lang === code ? '#3db560' : '#7aab87' }}
                >
                  <span>{label}</span>
                  {lang === code && <span className="text-[#3db560]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 cursor-pointer" style={{ background: 'linear-gradient(135deg, #3db560, #1e6e38)', color: '#fff' }}>
          BN
        </div>
      </div>
    </header>
  )
}

function AnimalCard({ a, lang }: { a: typeof ANIMALS[0]; lang: Language }) {
  const tr = TR[lang]
  const [sel, setSel] = useState(false)
  return (
    <div
      onClick={() => setSel(!sel)}
      className={`glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${sel ? 'ring-1' : ''}`}
      style={{ ...(sel ? { ringColor: '#3db560', boxShadow: '0 0 0 1px #3db560, 0 8px 24px rgba(61,181,96,0.2)' } : { boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }) }}
    >
      <div className="relative h-36 overflow-hidden bg-[#0d1f14]">
        <img src={a.img} alt={a.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,15,11,0.8) 0%, transparent 60%)' }} />
        <div className="absolute top-2 right-2">
          <StatusBadge status={a.status} lang={lang} />
        </div>
        <div className="absolute bottom-2 left-3 font-mono text-xs" style={{ color: '#7aab87' }}>{a.id}</div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-white text-sm mb-1">{a.name}</div>
        <div className="text-xs mb-2" style={{ color: '#7aab87' }}>{a.type}</div>
        <div className="flex gap-3 text-xs">
          <div>
            <div style={{ color: '#4a7a57' }} className="font-mono">{tr.weight}</div>
            <div className="font-semibold" style={{ color: '#e8f5ec' }}>{a.weight} {tr.kg}</div>
          </div>
          <div>
            <div style={{ color: '#4a7a57' }} className="font-mono">{tr.age}</div>
            <div className="font-semibold" style={{ color: '#e8f5ec' }}>{a.age} {tr.months}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BiometricsCard({ b, lang }: { b: typeof BIOMETRICS[0]; lang: Language }) {
  const tr = TR[lang]
  const label = tr[b.key] || b.key
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
      <div className="flex items-center justify-between">
        <div className="text-lg">{b.icon}</div>
        <StatusBadge status={b.status} lang={lang} />
      </div>
      <div className="text-xs font-mono" style={{ color: '#4a7a57' }}>{label}</div>
      <div className="font-display text-xl" style={{ color: '#e8f5ec' }}>{b.value}</div>
      <div className="text-[11px] font-mono" style={{ color: '#7aab87' }}>{b.normal}</div>
    </div>
  )
}

function AIChat({ lang }: { lang: Language }) {
  const tr = TR[lang]
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'assistant', text: tr.aiGreet }])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const txt = input.trim()
    if (!txt) return
    const next: ChatMsg[] = [...messages, { role: 'user', text: txt }]
    setMessages(next)
    setInput('')
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', text: getAIResponse(txt) }])
    }, 900)
  }

  return (
    <div className="glass-elevated rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(61,181,96,0.12)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: 'rgba(61,181,96,0.15)', border: '1px solid rgba(61,181,96,0.3)' }}>
          🤖
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: '#e8f5ec' }}>{tr.aiTitle}</div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: '#3db560' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#3db560] pulse-dot" />
            Online
          </div>
        </div>
      </div>
      <div className="h-52 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[78%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed fade-in"
              style={m.role === 'user'
                ? { background: '#3db560', color: '#080f0b', borderRadius: '16px 16px 4px 16px', fontWeight: 500 }
                : { background: 'rgba(255,255,255,0.05)', color: '#d4ecd9', border: '1px solid rgba(61,181,96,0.1)', borderRadius: '4px 16px 16px 16px' }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 pb-4">
        <div className="flex gap-2 items-center rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(61,181,96,0.15)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#4a7a57]"
            style={{ color: '#e8f5ec' }}
            placeholder={tr.aiPlaceholder}
          />
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-105"
            style={{ background: 'rgba(61,181,96,0.2)', color: '#3db560' }}
            onClick={() => {}}
            title="Voice note"
          >
            🎙
          </button>
          <button
            onClick={send}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-105"
            style={{ background: '#3db560', color: '#080f0b' }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}

function HealthScreen({ lang }: { lang: Language }) {
  const tr = TR[lang]
  const [query, setQuery] = useState('')
  const [filterBy, setFilterBy] = useState<FilterBy>('tag')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = ANIMALS.filter(a => {
    if (!query) return true
    const q = query.toLowerCase()
    if (filterBy === 'tag') return a.id.toLowerCase().includes(q)
    if (filterBy === 'breed') return a.breed.toLowerCase().includes(q)
    if (filterBy === 'status') return a.status.toLowerCase().includes(q)
    return true
  })

  return (
    <div className="space-y-6 fade-in">
      {/* Search & filter bar */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(61,181,96,0.12)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7aab87" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#4a7a57]"
            style={{ color: '#e8f5ec' }}
            placeholder={tr.search}
          />
        </div>
        <div className="flex gap-2">
          {(['tag', 'breed', 'status'] as FilterBy[]).map(f => (
            <button
              key={f}
              onClick={() => setFilterBy(f)}
              className="px-3 py-2 rounded-xl text-xs font-mono transition-all"
              style={filterBy === f
                ? { background: 'rgba(61,181,96,0.2)', color: '#3db560', border: '1px solid rgba(61,181,96,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#7aab87', border: '1px solid rgba(61,181,96,0.1)' }}
            >
              {f === 'tag' ? tr.filterTag : f === 'breed' ? tr.filterBreed : tr.filterStatus}
            </button>
          ))}
          <button
            onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            className="px-3 py-2 rounded-xl text-xs font-mono transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#7aab87', border: '1px solid rgba(61,181,96,0.1)' }}
          >
            {viewMode === 'grid' ? '≡' : '⊞'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: tr.allAnimals, value: ANIMALS.length, accent: '#3db560' },
          { label: tr.monitor, value: ANIMALS.filter(a => a.status === 'monitor').length, accent: '#f59e0b' },
          { label: tr.critical, value: ANIMALS.filter(a => a.status === 'critical').length, accent: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <div className="font-display text-3xl" style={{ color: s.accent }}>{s.value}</div>
            <div className="text-xs mt-1 font-mono" style={{ color: '#7aab87' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Animal cards */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
        {filtered.map(a => viewMode === 'grid'
          ? <AnimalCard key={a.id} a={a} lang={lang} />
          : (
            <div key={a.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
              <img src={a.img} alt={a.name} className="w-14 h-14 rounded-xl object-cover bg-[#0d1f14]" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{a.name}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: '#7aab87' }}>{a.id} · {a.type}</div>
              </div>
              <div className="text-sm text-right hidden sm:block">
                <div style={{ color: '#e8f5ec' }} className="font-semibold">{a.weight} kg</div>
                <div style={{ color: '#7aab87' }} className="text-xs">{a.age} {tr.months}</div>
              </div>
              <StatusBadge status={a.status} lang={lang} />
            </div>
          )
        )}
      </div>

      {/* Biometrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl" style={{ color: '#e8f5ec' }}>{tr.biometrics}</h2>
          <div className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: 'rgba(61,181,96,0.1)', color: '#3db560' }}>
            Last updated 4 min ago
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BIOMETRICS.map(b => <BiometricsCard key={b.key} b={b} lang={lang} />)}
        </div>
      </div>

      {/* AI Chat */}
      <div>
        <h2 className="font-display text-xl mb-3" style={{ color: '#e8f5ec' }}>{TR[lang].aiTitle}</h2>
        <AIChat lang={lang} />
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="btn-primary flex items-center gap-2.5 rounded-2xl shadow-2xl" style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '14px', paddingBottom: '14px', fontSize: '15px', boxShadow: '0 8px 32px rgba(61,181,96,0.4)' }}>
          <span>🎙</span>
          <span>{tr.addAnimal}</span>
          <span style={{ fontSize: '1.2em' }}>+</span>
        </button>
      </div>
    </div>
  )
}

function SecurityScreen({ lang }: { lang: Language }) {
  const tr = TR[lang]
  const [reportSent, setReportSent] = useState(false)

  return (
    <div className="space-y-5 fade-in">
      {/* Geofence banner */}
      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(61,181,96,0.15) 0%, rgba(61,181,96,0.06) 100%)', border: '1px solid rgba(61,181,96,0.3)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'rgba(61,181,96,0.15)' }}>
          🛡️
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg" style={{ color: '#3db560' }}>{tr.geofenceActive}</div>
          <div className="text-sm mt-0.5" style={{ color: '#7aab87' }}>3 active zones · GPS refresh every 60s · SMS alerts on</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3db560] pulse-dot" />
          <span className="text-xs font-mono" style={{ color: '#3db560' }}>ACTIVE</span>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="glass rounded-2xl overflow-hidden relative" style={{ height: '220px' }}>
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2" style={{ background: 'linear-gradient(135deg, #080f0b 0%, #0d1f14 100%)' }}>
          {/* SVG map sim */}
          <svg width="100%" height="100%" viewBox="0 0 600 220" className="absolute inset-0">
            {/* Perimeter */}
            <polygon points="100,40 500,30 530,180 80,190" fill="none" stroke="rgba(61,181,96,0.25)" strokeWidth="2" strokeDasharray="8,4"/>
            {/* Grid */}
            {[150,250,350,450].map(x => <line key={x} x1={x} y1={20} x2={x} y2={200} stroke="rgba(61,181,96,0.06)" strokeWidth="1"/>)}
            {[70,110,150,170].map(y => <line key={y} x1={50} y1={y} x2={550} y2={y} stroke="rgba(61,181,96,0.06)" strokeWidth="1"/>)}
            {/* Animals */}
            <circle cx="280" cy="100" r="6" fill="#3db560" opacity="0.9"/>
            <circle cx="320" cy="125" r="6" fill="#3db560" opacity="0.9"/>
            <circle cx="420" cy="90" r="6" fill="#f59e0b" opacity="0.9"/>
            <circle cx="160" cy="140" r="6" fill="#3db560" opacity="0.9"/>
            <circle cx="75" cy="175" r="6" fill="#ef4444" opacity="1"/>
            <circle cx="75" cy="175" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.5" className="pulse-dot"/>
            {/* Labels */}
            <text x="288" y="97" fill="#3db560" fontSize="9" fontFamily="JetBrains Mono">C12</text>
            <text x="329" y="122" fill="#3db560" fontSize="9" fontFamily="JetBrains Mono">B07</text>
            <text x="428" y="87" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono">H09</text>
            <text x="83" y="172" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono">C03 ⚠</text>
          </svg>
          <div className="absolute bottom-3 right-3 glass px-3 py-1.5 rounded-xl text-xs font-mono" style={{ color: '#7aab87' }}>
            Live GPS · 6 animals tracked
          </div>
          <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-xl text-xs font-mono" style={{ color: '#7aab87' }}>
            Farm Perimeter — Limpopo
          </div>
        </div>
      </div>

      {/* Emergency button */}
      <div className="glass rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
        <div className="text-sm" style={{ color: '#7aab87' }}>One animal outside boundary detected. Immediate action:</div>
        {reportSent ? (
          <div className="px-8 py-4 rounded-xl font-semibold text-sm" style={{ background: 'rgba(61,181,96,0.12)', color: '#3db560', border: '1px solid rgba(61,181,96,0.3)' }}>
            ✓ Report sent to SAPS & Insurer · Reference: REF-2026-0815-447
          </div>
        ) : (
          <button onClick={() => setReportSent(true)} className="btn-danger">
            <span style={{ fontSize: '1.4em' }}>🚨</span>
            <span>{tr.emergency}</span>
          </button>
        )}
        <div className="text-xs font-mono" style={{ color: '#4a7a57' }}>
          Auto-sends GPS coordinates + animal ID to SAPS + insurer + 3 emergency contacts
        </div>
      </div>

      {/* Alert log */}
      <div>
        <h2 className="font-display text-xl mb-3" style={{ color: '#e8f5ec' }}>{tr.recentAlerts}</h2>
        <div className="space-y-2">
          {ALERTS.map(a => (
            <div key={a.id} className="glass rounded-xl p-4 flex items-start gap-4" style={{ borderLeft: `3px solid ${a.severity === 'high' ? '#ef4444' : a.severity === 'medium' ? '#f59e0b' : '#3db560'}` }}>
              <div className="text-xl shrink-0 mt-0.5">
                {a.severity === 'high' ? '🔴' : a.severity === 'medium' ? '🟡' : '🟢'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: '#e8f5ec' }}>
                  {a.animal} — {a.event}
                </div>
                {a.contacts > 0 && (
                  <div className="text-xs mt-0.5" style={{ color: '#7aab87' }}>
                    {tr.smsContacts} {a.contacts} {tr.contacts}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-sm font-semibold" style={{ color: '#e8f5ec' }}>{a.time}</div>
                <div className="font-mono text-xs" style={{ color: '#4a7a57' }}>{a.date}</div>
                <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-mono ${a.resolved ? 'status-healthy' : 'status-critical'}`}>
                  {a.resolved ? tr.resolved : tr.active}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BusinessInspection({ lang }: { lang: Language }) {
  const tr = TR[lang]
  return (
    <div className="space-y-5 fade-in">
      <div className="glass-gold rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(201,162,39,0.15)' }}>🔬</div>
          <div>
            <h2 className="font-display text-xl" style={{ color: '#e8f5ec' }}>{tr.businessPriority}</h2>
            <div className="text-xs font-mono" style={{ color: '#c9a227' }}>High-priority — Real-time</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Lots Today', value: '3', color: '#e8f5ec' },
            { label: 'Animals Processed', value: '72', color: '#3db560' },
            { label: 'On Hold', value: '12', color: '#f59e0b' },
            { label: 'Rejected', value: '8', color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-3 text-center">
              <div className="font-display text-3xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-mono mt-1" style={{ color: '#7aab87' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {HEALTH_INSPECTIONS.map(ins => (
          <div key={ins.id} className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: '1px solid rgba(61,181,96,0.1)' }}>
              <div className={`w-2 h-2 rounded-full ${ins.passed ? 'bg-[#3db560]' : 'bg-[#f59e0b]'}`} />
              <div className="font-mono text-sm font-semibold" style={{ color: '#e8f5ec' }}>{ins.id}</div>
              <div className="text-xs font-mono" style={{ color: '#7aab87' }}>{ins.lot} · {ins.count} animals · {ins.breed}</div>
              <div className="ml-auto">
                <StatusBadge status={ins.passed ? 'healthy' : 'monitor'} lang={lang} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-5 py-4">
              {[
                { label: 'FMD', value: ins.fmd },
                { label: 'Brucellosis', value: ins.brucellosis },
                { label: 'TB Test', value: ins.tbTest },
                { label: 'Carcass Grade', value: ins.carcassGrade },
                { label: 'Meat Temp', value: ins.meatTemp },
                { label: 'Inspector', value: ins.inspector },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-[10px] font-mono mb-1" style={{ color: '#4a7a57' }}>{f.label}</div>
                  <div className="text-sm font-semibold" style={{ color: f.value === 'Clear' || f.value === 'Negative' ? '#3db560' : f.value === 'Suspected' || f.value === 'Pending' ? '#f59e0b' : '#e8f5ec' }}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BusinessIntake({ lang }: { lang: Language }) {
  const tr = TR[lang]
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl" style={{ color: '#e8f5ec' }}>{tr.intakeTitle}</h2>
        <button className="btn-primary text-sm py-2 px-4">+ New Lot</button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(61,181,96,0.12)' }}>
                {[tr.lotId, tr.animals, tr.filterBreed, tr.avgWeight, 'Status', tr.inspector, tr.date].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-mono text-xs" style={{ color: '#4a7a57' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INTAKE_LOTS.map((row, i) => (
                <tr key={row.lot} className="transition-colors hover:bg-[rgba(61,181,96,0.04)]" style={{ borderBottom: i < INTAKE_LOTS.length - 1 ? '1px solid rgba(61,181,96,0.07)' : 'none' }}>
                  <td className="px-5 py-4 font-mono font-semibold" style={{ color: '#e8f5ec' }}>{row.lot}</td>
                  <td className="px-5 py-4" style={{ color: '#a8cfb4' }}>{row.count}</td>
                  <td className="px-5 py-4" style={{ color: '#a8cfb4' }}>{row.breed}</td>
                  <td className="px-5 py-4 font-mono" style={{ color: '#a8cfb4' }}>{row.avgWeight}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${row.status === 'Passed' ? 'status-healthy' : row.status === 'Hold' ? 'status-monitor' : 'status-critical'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: '#7aab87' }}>{row.inspector}</td>
                  <td className="px-5 py-4 text-xs font-mono" style={{ color: '#7aab87' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function BusinessAuction({ lang }: { lang: Language }) {
  const tr = TR[lang]
  return (
    <div className="fade-in space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-xl" style={{ color: '#e8f5ec' }}>{tr.auctionTitle}</h2>
        <button className="btn-primary text-sm py-2 px-4">+ Create Lot</button>
      </div>
      {AUCTION_LOTS.map(lot => (
        <div key={lot.id} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4" style={{ borderLeft: `3px solid ${lot.status === 'Live' ? '#3db560' : lot.status === 'Upcoming' ? '#c9a227' : '#4a7a57'}` }}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="font-mono font-semibold text-sm" style={{ color: '#e8f5ec' }}>{lot.id}</div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${lot.status === 'Live' ? 'status-healthy' : lot.status === 'Upcoming' ? 'status-monitor' : ''}`} style={lot.status === 'Closed' ? { color: '#4a7a57', background: 'rgba(74,122,87,0.1)', border: '1px solid rgba(74,122,87,0.2)' } : {}}>
                {lot.status === 'Live' ? '● LIVE' : lot.status}
              </span>
            </div>
            <div className="text-sm" style={{ color: '#a8cfb4' }}>{lot.desc}</div>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="text-[10px] font-mono mb-1" style={{ color: '#4a7a57' }}>{tr.reserve}</div>
              <div className="font-semibold" style={{ color: '#e8f5ec' }}>{lot.reserve}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono mb-1" style={{ color: '#4a7a57' }}>{tr.estimate}</div>
              <div className="font-semibold text-sm" style={{ color: '#c9a227' }}>{lot.estimate}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono mb-1" style={{ color: '#4a7a57' }}>{tr.bidders}</div>
              <div className="font-display text-2xl" style={{ color: lot.bidders > 0 ? '#3db560' : '#4a7a57' }}>{lot.bidders}</div>
            </div>
          </div>
          {lot.status === 'Live' && (
            <button className="btn-primary text-sm py-2 px-5 shrink-0">View Bids →</button>
          )}
        </div>
      ))}
    </div>
  )
}

function FarmerDashboard({ lang }: { lang: Language }) {
  const tr = TR[lang]
  const [tab, setTab] = useState<FarmerTab>('health')
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 pb-32">
      <div className="flex gap-1 mb-6 glass inline-flex rounded-xl p-1" style={{ width: 'fit-content' }}>
        {(['health', 'security'] as FarmerTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'tab-active' : 'tab-inactive'}`}
          >
            {t === 'health' ? `🌿 ${tr.farmBook}` : `🛡 ${tr.farmWatch}`}
          </button>
        ))}
      </div>
      {tab === 'health' ? <HealthScreen lang={lang} /> : <SecurityScreen lang={lang} />}
    </main>
  )
}

function BusinessDashboard({ lang }: { lang: Language }) {
  const tr = TR[lang]
  const [tab, setTab] = useState<BusinessTab>('inspection')
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
      <div className="flex gap-1 mb-6 glass inline-flex rounded-xl p-1" style={{ width: 'fit-content' }}>
        {([
          ['inspection', `🔬 ${tr.inspection}`],
          ['intake', `📋 ${tr.intake}`],
          ['auction', `🏷 ${tr.auction}`],
        ] as [BusinessTab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'tab-active' : 'tab-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'inspection' && <BusinessInspection lang={lang} />}
      {tab === 'intake' && <BusinessIntake lang={lang} />}
      {tab === 'auction' && <BusinessAuction lang={lang} />}
    </main>
  )
}

function Footer({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) {
  const tr = TR[lang]
  return (
    <footer className="mt-16 glass" style={{ borderTop: '1px solid rgba(61,181,96,0.1)' }}>
      <div className="max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: 'rgba(61,181,96,0.15)' }}>🐄</div>
          <span className="text-sm font-mono" style={{ color: '#4a7a57' }}>{tr.copyright}</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="transition-colors hover:text-[#3db560]" style={{ color: '#7aab87' }}>{tr.support}</a>
          <a href="#" className="transition-colors hover:text-[#3db560]" style={{ color: '#7aab87' }}>{tr.docs}</a>
          <select
            value={lang}
            onChange={e => setLang(e.target.value as Language)}
            className="bg-transparent text-xs font-mono outline-none cursor-pointer rounded-lg px-2 py-1"
            style={{ color: '#7aab87', border: '1px solid rgba(61,181,96,0.15)' }}
          >
            {(Object.entries(LANG_LABELS) as [Language, string][]).map(([code, label]) => (
              <option key={code} value={code} style={{ background: '#0d1f14', color: '#e8f5ec' }}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [role, setRole] = useState<Role>(null)
  const [lang, setLang] = useState<Language>('en')
  const [isOnline] = useState(true)

  if (!role) return <OnboardingScreen onSelect={setRole} />

  return (
    <div style={{ minHeight: '100vh', background: '#080f0b' }}>
      <Header lang={lang} setLang={setLang} role={role} isOnline={isOnline} onBack={() => setRole(null)} />
      {role === 'farmer' ? <FarmerDashboard lang={lang} /> : <BusinessDashboard lang={lang} />}
      <Footer lang={lang} setLang={setLang} />
    </div>
  )
}
