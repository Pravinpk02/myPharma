export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  batch: string;
  sku: string;
  stock: number;
  units: number;
  unitPrice: string;
  unitPriceNum: number;
  expiry: string;
  expiryDate: Date;
  expStatus: 'ok' | 'warn' | 'low';
  supplier: string;
  status: 'Good' | 'Low' | 'Critical' | 'OOS';
  history: { date: string; qty: string; cost: string }[];
}

export interface Supplier {
  name: string;
  location: string;
  avatar: string;
  color: string;
  products: number;
  rating: string;
  delivery: string;
  tags: string[];
  phone: string;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  status: 'up' | 'down' | 'neutral';
}

export type SortColumn = 'name' | 'stock' | 'units' | 'unitPrice' | 'expiry' | 'status' | null;
export type SortDirection = 'asc' | 'desc';
export type ExpiryFilter = 'all' | '30' | '60' | '90';

// Sample data — 20 realistic products
export const INVENTORY_DATA: InventoryProduct[] = [
  {
    id: 'PRD-001', name: 'Amoxicillin 500mg', category: 'Antibiotics', batch: 'AMX-A204', sku: 'SKU-1001',
    stock: 12, units: 480, unitPrice: '₹210', unitPriceNum: 210, expiry: 'Aug 2026', expiryDate: new Date('2026-08-01'), expStatus: 'warn', supplier: 'Sun Pharma', status: 'Critical',
    history: [{ date: 'Mar 2026', qty: '2,000 units', cost: '₹4,20,000' }, { date: 'Jan 2026', qty: '3,000 units', cost: '₹6,30,000' }, { date: 'Oct 2025', qty: '2,500 units', cost: '₹5,25,000' }],
  },
  {
    id: 'PRD-002', name: 'Paracetamol 650mg', category: 'Analgesics', batch: 'PAR-P302', sku: 'SKU-1002',
    stock: 8, units: 320, unitPrice: '₹12', unitPriceNum: 12, expiry: 'Sep 2026', expiryDate: new Date('2026-09-01'), expStatus: 'ok', supplier: 'Cipla Ltd', status: 'Critical',
    history: [{ date: 'Apr 2026', qty: '4,000 units', cost: '₹48,000' }, { date: 'Feb 2026', qty: '5,000 units', cost: '₹60,000' }],
  },
  {
    id: 'PRD-003', name: 'Metformin 1000mg', category: 'Diabetes', batch: 'MET-D119', sku: 'SKU-1003',
    stock: 32, units: 1280, unitPrice: '₹190', unitPriceNum: 190, expiry: 'Dec 2026', expiryDate: new Date('2026-12-01'), expStatus: 'ok', supplier: 'Dr. Reddy\'s', status: 'Low',
    history: [{ date: 'Apr 2026', qty: '2,000 units', cost: '₹3,80,000' }, { date: 'Jan 2026', qty: '3,000 units', cost: '₹5,70,000' }],
  },
  {
    id: 'PRD-004', name: 'Atorvastatin 40mg', category: 'Cardiology', batch: 'ATO-C511', sku: 'SKU-1004',
    stock: 27, units: 1080, unitPrice: '₹280', unitPriceNum: 280, expiry: 'Jul 2026', expiryDate: new Date('2026-07-01'), expStatus: 'warn', supplier: 'Sun Pharma', status: 'Low',
    history: [{ date: 'Mar 2026', qty: '2,000 units', cost: '₹5,60,000' }],
  },
  {
    id: 'PRD-005', name: 'Vitamin D3 1000IU', category: 'Vitamins', batch: 'VIT-V088', sku: 'SKU-1005',
    stock: 65, units: 2600, unitPrice: '₹185', unitPriceNum: 185, expiry: 'Mar 2027', expiryDate: new Date('2027-03-01'), expStatus: 'ok', supplier: 'Abbott India', status: 'Good',
    history: [{ date: 'Feb 2026', qty: '3,000 units', cost: '₹5,55,000' }],
  },
  {
    id: 'PRD-006', name: 'Azithromycin 250mg', category: 'Antibiotics', batch: 'AZI-A312', sku: 'SKU-1006',
    stock: 74, units: 2960, unitPrice: '₹460', unitPriceNum: 460, expiry: 'Feb 2027', expiryDate: new Date('2027-02-01'), expStatus: 'ok', supplier: 'Cipla Ltd', status: 'Good',
    history: [{ date: 'Jan 2026', qty: '2,500 units', cost: '₹11,50,000' }],
  },
  {
    id: 'PRD-007', name: 'Omeprazole 20mg', category: 'Supplements', batch: 'OMP-S201', sku: 'SKU-1007',
    stock: 55, units: 2200, unitPrice: '₹95', unitPriceNum: 95, expiry: 'Nov 2026', expiryDate: new Date('2026-11-01'), expStatus: 'ok', supplier: 'Sun Pharma', status: 'Good',
    history: [{ date: 'Mar 2026', qty: '3,000 units', cost: '₹2,85,000' }],
  },
  {
    id: 'PRD-008', name: 'Cetirizine 10mg', category: 'Analgesics', batch: 'CET-A118', sku: 'SKU-1008',
    stock: 41, units: 1640, unitPrice: '₹28', unitPriceNum: 28, expiry: 'Jan 2027', expiryDate: new Date('2027-01-01'), expStatus: 'ok', supplier: 'Cipla Ltd', status: 'Good',
    history: [{ date: 'Feb 2026', qty: '5,000 units', cost: '₹1,40,000' }],
  },
  {
    id: 'PRD-009', name: 'Losartan 50mg', category: 'Cardiology', batch: 'LOS-C403', sku: 'SKU-1009',
    stock: 18, units: 720, unitPrice: '₹140', unitPriceNum: 140, expiry: 'Jul 2026', expiryDate: new Date('2026-07-15'), expStatus: 'warn', supplier: 'Dr. Reddy\'s', status: 'Critical',
    history: [{ date: 'Apr 2026', qty: '1,500 units', cost: '₹2,10,000' }],
  },
  {
    id: 'PRD-010', name: 'Ibuprofen 400mg', category: 'Analgesics', batch: 'IBU-A220', sku: 'SKU-1010',
    stock: 36, units: 1440, unitPrice: '₹35', unitPriceNum: 35, expiry: 'Oct 2026', expiryDate: new Date('2026-10-01'), expStatus: 'ok', supplier: 'Sun Pharma', status: 'Low',
    history: [{ date: 'Mar 2026', qty: '4,000 units', cost: '₹1,40,000' }],
  },
  {
    id: 'PRD-011', name: 'Multivitamin Caps', category: 'Vitamins', batch: 'MVC-V044', sku: 'SKU-1011',
    stock: 82, units: 3280, unitPrice: '₹320', unitPriceNum: 320, expiry: 'May 2027', expiryDate: new Date('2027-05-01'), expStatus: 'ok', supplier: 'Abbott India', status: 'Good',
    history: [{ date: 'Apr 2026', qty: '2,000 units', cost: '₹6,40,000' }],
  },
  {
    id: 'PRD-012', name: 'Glimepiride 2mg', category: 'Diabetes', batch: 'GLM-D305', sku: 'SKU-1012',
    stock: 22, units: 880, unitPrice: '₹165', unitPriceNum: 165, expiry: 'Aug 2026', expiryDate: new Date('2026-08-15'), expStatus: 'warn', supplier: 'Dr. Reddy\'s', status: 'Low',
    history: [{ date: 'Feb 2026', qty: '2,000 units', cost: '₹3,30,000' }],
  },
  {
    id: 'PRD-013', name: 'Calcium + D3 Tab', category: 'Supplements', batch: 'CAL-S110', sku: 'SKU-1013',
    stock: 58, units: 2320, unitPrice: '₹250', unitPriceNum: 250, expiry: 'Apr 2027', expiryDate: new Date('2027-04-01'), expStatus: 'ok', supplier: 'Abbott India', status: 'Good',
    history: [{ date: 'Mar 2026', qty: '1,500 units', cost: '₹3,75,000' }],
  },
  {
    id: 'PRD-014', name: 'Ciprofloxacin 500mg', category: 'Antibiotics', batch: 'CIP-A415', sku: 'SKU-1014',
    stock: 44, units: 1760, unitPrice: '₹380', unitPriceNum: 380, expiry: 'Dec 2026', expiryDate: new Date('2026-12-01'), expStatus: 'ok', supplier: 'Cipla Ltd', status: 'Good',
    history: [{ date: 'Apr 2026', qty: '2,000 units', cost: '₹7,60,000' }],
  },
  {
    id: 'PRD-015', name: 'Amlodipine 5mg', category: 'Cardiology', batch: 'AML-C602', sku: 'SKU-1015',
    stock: 70, units: 2800, unitPrice: '₹75', unitPriceNum: 75, expiry: 'Jun 2027', expiryDate: new Date('2027-06-01'), expStatus: 'ok', supplier: 'Sun Pharma', status: 'Good',
    history: [{ date: 'Mar 2026', qty: '5,000 units', cost: '₹3,75,000' }],
  },
  {
    id: 'PRD-016', name: 'Insulin Glargine', category: 'Diabetes', batch: 'INS-D710', sku: 'SKU-1016',
    stock: 15, units: 600, unitPrice: '₹1,250', unitPriceNum: 1250, expiry: 'Jul 2026', expiryDate: new Date('2026-07-10'), expStatus: 'warn', supplier: 'Abbott India', status: 'Critical',
    history: [{ date: 'Apr 2026', qty: '500 units', cost: '₹6,25,000' }, { date: 'Jan 2026', qty: '800 units', cost: '₹10,00,000' }],
  },
  {
    id: 'PRD-017', name: 'Omega-3 Fish Oil', category: 'Supplements', batch: 'OMG-S223', sku: 'SKU-1017',
    stock: 48, units: 1920, unitPrice: '₹410', unitPriceNum: 410, expiry: 'Nov 2026', expiryDate: new Date('2026-11-01'), expStatus: 'ok', supplier: 'Abbott India', status: 'Good',
    history: [{ date: 'Feb 2026', qty: '2,000 units', cost: '₹8,20,000' }],
  },
  {
    id: 'PRD-018', name: 'Doxycycline 100mg', category: 'Antibiotics', batch: 'DOX-A509', sku: 'SKU-1018',
    stock: 29, units: 1160, unitPrice: '₹150', unitPriceNum: 150, expiry: 'Sep 2026', expiryDate: new Date('2026-09-01'), expStatus: 'ok', supplier: 'Cipla Ltd', status: 'Low',
    history: [{ date: 'Mar 2026', qty: '3,000 units', cost: '₹4,50,000' }],
  },
  {
    id: 'PRD-019', name: 'Aspirin 75mg', category: 'Cardiology', batch: 'ASP-C155', sku: 'SKU-1019',
    stock: 88, units: 3520, unitPrice: '₹18', unitPriceNum: 18, expiry: 'Aug 2027', expiryDate: new Date('2027-08-01'), expStatus: 'ok', supplier: 'Sun Pharma', status: 'Good',
    history: [{ date: 'Apr 2026', qty: '10,000 units', cost: '₹1,80,000' }],
  },
  {
    id: 'PRD-020', name: 'Vitamin B12 Inj', category: 'Vitamins', batch: 'B12-V066', sku: 'SKU-1020',
    stock: 34, units: 1360, unitPrice: '₹520', unitPriceNum: 520, expiry: 'Oct 2026', expiryDate: new Date('2026-10-01'), expStatus: 'ok', supplier: 'Dr. Reddy\'s', status: 'Low',
    history: [{ date: 'Apr 2026', qty: '1,000 units', cost: '₹5,20,000' }],
  },
];

export const SUPPLIERS: Supplier[] = [
  { name: 'Sun Pharma', location: 'Mumbai, Maharashtra', avatar: 'SP', color: '#0F6E56', products: 842, rating: '4.9', delivery: '2 days', tags: ['Antibiotics', 'Cardiology', 'Vitamins'], phone: '+91 22 4324 4324' },
  { name: 'Cipla Ltd', location: 'Mumbai, Maharashtra', avatar: 'CL', color: '#378ADD', products: 624, rating: '4.8', delivery: '3 days', tags: ['Antibiotics', 'Analgesics', 'Diabetes'], phone: '+91 22 2482 6000' },
  { name: 'Abbott India', location: 'Mumbai, Maharashtra', avatar: 'AI', color: '#EF9F27', products: 412, rating: '4.9', delivery: '1 day', tags: ['Vitamins', 'Supplements'], phone: '+91 22 6778 6778' },
  { name: 'Dr. Reddy\'s', location: 'Hyderabad, Telangana', avatar: 'DR', color: '#D4537E', products: 538, rating: '4.7', delivery: '2 days', tags: ['Diabetes', 'Cardiology'], phone: '+91 40 4900 2900' },
];

export const CATEGORIES = [
  'All Products',
  'Antibiotics',
  'Vitamins',
  'Analgesics',
  'Cardiology',
  'Diabetes',
  'Supplements',
];

export const stockColor = (pct: number) => {
  if (pct <= 20) return '#E24B4A';
  if (pct <= 40) return '#EF9F27';
  return 'var(--accent)';
};
