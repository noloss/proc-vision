export const CATEGORIES = [
  { id: 'office', label: 'Office supplies', icon: '📦', desc: 'Paper, pens, desk items' },
  { id: 'it', label: 'IT hardware', icon: '💻', desc: 'Laptops, monitors, peripherals' },
  { id: 'print', label: 'Print & copy', icon: '🖨️', desc: 'Printers, toner, managed print' },
  { id: 'software', label: 'Software & licences', icon: '🔑', desc: 'SaaS, productivity tools' },
  { id: 'mobile', label: 'Mobile & telecoms', icon: '📱', desc: 'Phones, SIM plans, broadband' },
  { id: 'facilities', label: 'Facilities & cleaning', icon: '🧹', desc: 'Cleaning services and supplies' },
  { id: 'travel', label: 'Travel & accommodation', icon: '✈️', desc: 'Flights, hotels, rail' },
  { id: 'energy', label: 'Energy & utilities', icon: '⚡', desc: 'Electricity, gas, water' },
  { id: 'courier', label: 'Courier & freight', icon: '📬', desc: 'Parcel, pallet, express' },
  { id: 'workwear', label: 'Workwear & PPE', icon: '👷', desc: 'Uniforms, safety equipment' },
  { id: 'coffee', label: 'Coffee & catering', icon: '☕', desc: 'Hot drinks, vending, catering' },
  { id: 'packaging', label: 'Packaging', icon: '📦', desc: 'Boxes, tape, labels' },
]

export const DEFAULT_SELECTED = []

export const SAMPLE_FILES = {
  office: 'staples_invoice_2024.pdf',
  it: 'dell_q1_2024.pdf',
  software: 'microsoft_ea_2024.pdf',
  mobile: 'vodafone_nov_2024.pdf',
  print: 'xerox_managed_print_2024.pdf',
  facilities: 'facilities_q3_summary.pdf',
  travel: 'amex_travel_q1_2024.pdf',
  energy: 'eon_energy_2024.pdf',
  courier: 'dhl_invoices_2024.pdf',
  workwear: 'arco_workwear_2024.pdf',
  coffee: 'nestle_vending_2024.pdf',
  packaging: 'ds_smith_packaging_2024.pdf',
}

export const LINE_ITEMS = [
  {
    id: 1,
    desc: 'HP 80g A4 Paper Ream 500sh',
    ref: 'HP-A4-80',
    qty: 40,
    unit: 'ream',
    price: 4.85,
    spaCMatch: { name: 'HP Premium A4 80g Ream', price: 3.90, savings: 19.6 },
  },
  {
    id: 2,
    desc: 'Staedtler HB Pencils Box 12',
    ref: 'ST-HB12',
    qty: 10,
    unit: 'box',
    price: 2.30,
    spaCMatch: { name: 'Staedtler HB Pencils 12pk', price: 1.95, savings: 15.2 },
  },
  {
    id: 3,
    desc: 'Avery L7160 Address Labels',
    ref: 'AV-7160',
    qty: 25,
    unit: 'pack',
    price: 3.90,
  },
  {
    id: 4,
    desc: 'Fellowes Apex Shredder Bags',
    ref: 'FE-4600',
    qty: 6,
    unit: 'pack',
    price: 18.50,
    extractedPrice: 1.85,
  },
  {
    id: 5,
    desc: 'Post-it 76x76mm Yellow 100sh',
    ref: '3M-654',
    qty: 20,
    unit: 'pad',
    price: 1.45,
    spaCMatch: { name: 'Post-it Notes 76x76 Yellow', price: 1.20, savings: 17.2 },
  },
  {
    id: 6,
    desc: 'Bic Cristal Biro Blue 50pk',
    ref: 'BIC-CR50',
    qty: 4,
    unit: 'box',
    price: 5.20,
    spaCMatch: { name: 'Bic Cristal Blue Ballpen 50pk', price: 4.40, savings: 15.4 },
  },
  {
    id: 7,
    desc: 'Esselte Lever Arch File A4',
    ref: 'ES-LAF',
    qty: 12,
    unit: 'unit',
    price: 2.85,
    spaCMatch: { name: 'Esselte Lever Arch File A4 70mm', price: 2.35, savings: 17.5 },
  },
  {
    id: 8,
    desc: 'Scotch Magic Tape 19mm 8-pack',
    ref: '3M-M8',
    qty: 8,
    unit: 'pack',
    price: 6.40,
  },
  {
    id: 9,
    desc: 'Whiteboard Marker Assorted 4pk',
    ref: 'ST-WB4',
    qty: 5,
    unit: 'pack',
    price: 3.10,
    spaCMatch: { name: 'Staedtler Lumocolor Assorted 4pk', price: 2.65, savings: 14.5 },
  },
]

export const MATCH_CANDIDATES = [
  { name: 'Avery L7163 Address Labels', unit: 'pack', spaCPrice: 4.10, score: 72 },
  { name: 'Avery L7160 Labels 21-up', unit: 'pack', spaCPrice: 3.85, score: 68 },
  { name: 'Avery L7651 Mini Labels', unit: 'pack', spaCPrice: 2.95, score: 51 },
  { name: 'Q-Connect Address Labels A4', unit: 'pack', spaCPrice: 3.20, score: 44 },
  { name: 'Avery Laser Labels White 24-up', unit: 'pack', spaCPrice: 4.50, score: 38 },
]

export const FELLOWES_MATCH = { name: 'Fellowes SB-125i Bags 100pk', price: 17.90, score: 94 }
