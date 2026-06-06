// Mock data service for Dashboard
export interface MetricData {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
  icon: string;
  color: 'g' | 'b' | 'a' | 'p'; // green, blue, amber, pink
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  batch: string;
  percentage: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  city: string;
  category: string;
  amount: string;
  status: 'delivered' | 'processing' | 'pending' | 'cancelled' | 'shipped';
}

export interface OrderProduct {
  name: string;
  qty: string;
  amt: string;
}

export interface OrderTimeline {
  time: string;
  event: string;
  sub?: string;
  done: boolean;
}

export interface OrderDetail extends Order {
  items: number;
  date: string;
  products: OrderProduct[];
  address: string;
  phone: string;
  gstin: string;
  timeline: OrderTimeline[];
}

export interface ChartDataPoint {
  month: string;
  sales: number;
}

export interface CategoryData {
  category: string;
  percentage: number;
}

export const getMetrics = (): MetricData[] => {
  return [
    {
      label: 'Total Revenue',
      value: '₹84.2L',
      change: 12.4,
      isPositive: true,
      icon: '💷',
      color: 'g',
    },
    {
      label: 'Total Orders',
      value: '1,284',
      change: 8.1,
      isPositive: true,
      icon: '🛒',
      color: 'b',
    },
    {
      label: 'Products in Stock',
      value: '3,842',
      change: -3.2,
      isPositive: false,
      icon: '📦',
      color: 'a',
    },
    {
      label: 'Active Customers',
      value: '642',
      change: 5.7,
      isPositive: true,
      icon: '👥',
      color: 'p',
    },
  ];
};

export const getSalesChartData = (): ChartDataPoint[] => {
  return [
    { month: 'January', sales: 52 },
    { month: 'February', sales: 61 },
    { month: 'March', sales: 58 },
    { month: 'April', sales: 74 },
    { month: 'May', sales: 84 },
  ];
};

export const getCategoryData = (): CategoryData[] => {
  return [
    { category: 'Antibiotics', percentage: 32 },
    { category: 'Vitamins', percentage: 24 },
    { category: 'Analgesics', percentage: 18 },
    { category: 'Cardiology', percentage: 14 },
    { category: 'Others', percentage: 12 },
  ];
};

export const getInventoryAlerts = (): InventoryItem[] => {
  return [
    {
      id: '1',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotic',
      batch: 'Batch A204',
      percentage: 18,
      status: 'critical',
    },
    {
      id: '2',
      name: 'Metformin 1000mg',
      category: 'Diabetes',
      batch: 'Batch D119',
      percentage: 32,
      status: 'warning',
    },
    {
      id: '3',
      name: 'Paracetamol 650mg',
      category: 'Analgesic',
      batch: 'Batch P302',
      percentage: 12,
      status: 'critical',
    },
    {
      id: '4',
      name: 'Vitamin D3 1000IU',
      category: 'Supplement',
      batch: 'Batch V088',
      percentage: 65,
      status: 'ok',
    },
    {
      id: '5',
      name: 'Atorvastatin 40mg',
      category: 'Cardiology',
      batch: 'Batch C511',
      percentage: 27,
      status: 'warning',
    },
  ];
};

export const getRecentOrders = (): Order[] => {
  return [
    {
      id: '1',
      orderNumber: '#ORD-2841',
      customer: 'City Hospital, Chennai',
      city: 'Chennai',
      category: 'Antibiotics, Vitamins',
      amount: '₹1,24,000',
      status: 'delivered',
    },
    {
      id: '2',
      orderNumber: '#ORD-2840',
      customer: 'Apollo Pharmacy, Bengaluru',
      city: 'Bengaluru',
      category: 'Cardiology',
      amount: '₹89,500',
      status: 'processing',
    },
    {
      id: '3',
      orderNumber: '#ORD-2839',
      customer: 'MedPlus, Hyderabad',
      city: 'Hyderabad',
      category: 'Diabetes, Supplements',
      amount: '₹2,18,750',
      status: 'shipped',
    },
    {
      id: '4',
      orderNumber: '#ORD-2838',
      customer: 'Fortis Pharmacy, Mumbai',
      city: 'Mumbai',
      category: 'Antibiotics',
      amount: '₹45,200',
      status: 'delivered',
    },
    {
      id: '5',
      orderNumber: '#ORD-2837',
      customer: 'LifeCare Stores, Pune',
      city: 'Pune',
      category: 'Vitamins, Analgesics',
      amount: '₹67,300',
      status: 'cancelled',
    },
    {
      id: '6',
      orderNumber: '#ORD-2836',
      customer: 'Medanta, New Delhi',
      city: 'New Delhi',
      category: 'Cardiology, Diabetes',
      amount: '₹3,42,000',
      status: 'delivered',
    },
  ];
};

export const getAllOrders = (): OrderDetail[] => {
  return [
    {
      id: '1',
      orderNumber: 'ORD-2841',
      customer: 'City Hospital',
      city: 'Chennai',
      category: 'Antibiotics, Vitamins',
      amount: '₹1,24,000',
      status: 'delivered',
      items: 24,
      date: '10 May 2026',
      products: [
        { name: 'Amoxicillin 500mg', qty: '200 strips', amt: '₹42,000' },
        { name: 'Vitamin C 1000mg', qty: '150 boxes', amt: '₹36,000' },
        { name: 'Azithromycin 250mg', qty: '100 strips', amt: '₹46,000' },
      ],
      address: '14, Anna Salai, Chennai – 600002',
      phone: '+91 44 2345 6789',
      gstin: '33AABCC1234D1Z5',
      timeline: [
        { time: '10 May, 09:14 AM', event: 'Order Placed', sub: 'By Dr. Ramesh Kumar', done: true },
        { time: '10 May, 11:30 AM', event: 'Order Confirmed', sub: 'Verified by warehouse', done: true },
        { time: '10 May, 03:00 PM', event: 'Dispatched', sub: 'Via BlueDart · TRK8423842', done: true },
        { time: '11 May, 10:20 AM', event: 'Delivered', sub: 'Received by Dr. Ramesh', done: true },
      ],
    },
    {
      id: '2',
      orderNumber: 'ORD-2840',
      customer: 'Apollo Pharmacy',
      city: 'Bengaluru',
      category: 'Cardiology',
      amount: '₹89,500',
      status: 'processing',
      items: 16,
      date: '10 May 2026',
      products: [
        { name: 'Atorvastatin 40mg', qty: '300 strips', amt: '₹54,000' },
        { name: 'Metoprolol 50mg', qty: '200 strips', amt: '₹35,500' },
      ],
      address: '27, MG Road, Bengaluru – 560001',
      phone: '+91 80 4567 8901',
      gstin: '29AABCA5678E2Z3',
      timeline: [
        { time: '10 May, 08:30 AM', event: 'Order Placed', sub: 'Online portal', done: true },
        { time: '10 May, 10:00 AM', event: 'Payment Confirmed', sub: 'NEFT ₹89,500', done: true },
        { time: '10 May, 02:00 PM', event: 'Processing', sub: 'Picking & packing', done: true },
        { time: 'Pending', event: 'Dispatch', sub: 'Estimated 11 May', done: false },
      ],
    },
    {
      id: '3',
      orderNumber: 'ORD-2839',
      customer: 'MedPlus',
      city: 'Hyderabad',
      category: 'Diabetes, Supplements',
      amount: '₹2,18,750',
      status: 'shipped',
      items: 38,
      date: '09 May 2026',
      products: [
        { name: 'Metformin 1000mg', qty: '500 strips', amt: '₹95,000' },
        { name: 'Glipizide 5mg', qty: '400 strips', amt: '₹68,000' },
        { name: 'Vitamin D3 1000IU', qty: '300 boxes', amt: '₹55,750' },
      ],
      address: '88, Banjara Hills, Hyderabad – 500034',
      phone: '+91 40 6789 0123',
      gstin: '36AABCM3456F3Z1',
      timeline: [
        { time: '09 May, 07:00 AM', event: 'Order Placed', sub: 'Bulk order', done: true },
        { time: '09 May, 09:00 AM', event: 'Confirmed & Invoiced', sub: 'Invoice #INV-3341', done: true },
        { time: '09 May, 04:00 PM', event: 'Dispatched', sub: 'DHL · DHLIND8823', done: true },
        { time: 'Pending', event: 'Delivery', sub: 'Expected 12 May', done: false },
      ],
    },
    {
      id: '4',
      orderNumber: 'ORD-2838',
      customer: 'Fortis Pharmacy',
      city: 'Mumbai',
      category: 'Antibiotics',
      amount: '₹45,200',
      status: 'delivered',
      items: 12,
      date: '09 May 2026',
      products: [
        { name: 'Cephalexin 500mg', qty: '120 strips', amt: '₹28,800' },
        { name: 'Doxycycline 100mg', qty: '80 strips', amt: '₹16,400' },
      ],
      address: 'Fortis Hospital, Mulund, Mumbai – 400080',
      phone: '+91 22 2345 0987',
      gstin: '27AABCF7890G4Z2',
      timeline: [
        { time: '09 May, 06:30 AM', event: 'Order Placed', done: true },
        { time: '09 May, 08:00 AM', event: 'Confirmed', done: true },
        { time: '09 May, 01:00 PM', event: 'Dispatched', sub: 'DTDC · DTDC7712', done: true },
        { time: '10 May, 09:00 AM', event: 'Delivered', sub: 'Received by pharmacy', done: true },
      ],
    },
    {
      id: '5',
      orderNumber: 'ORD-2837',
      customer: 'LifeCare Stores',
      city: 'Pune',
      category: 'Vitamins, Analgesics',
      amount: '₹67,300',
      status: 'cancelled',
      items: 9,
      date: '08 May 2026',
      products: [
        { name: 'Paracetamol 650mg', qty: '200 strips', amt: '₹24,000' },
        { name: 'Vitamin B12', qty: '150 boxes', amt: '₹43,300' },
      ],
      address: 'FC Road, Shivajinagar, Pune – 411005',
      phone: '+91 20 3456 7890',
      gstin: '27AABCL2345H5Z8',
      timeline: [
        { time: '08 May, 10:00 AM', event: 'Order Placed', done: true },
        { time: '08 May, 11:30 AM', event: 'Confirmed', done: true },
        { time: '08 May, 03:00 PM', event: 'Cancelled by customer', sub: 'Reason: Duplicate order', done: true },
      ],
    },
    {
      id: '6',
      orderNumber: 'ORD-2836',
      customer: 'Medanta',
      city: 'New Delhi',
      category: 'Cardiology, Diabetes',
      amount: '₹3,42,000',
      status: 'delivered',
      items: 52,
      date: '08 May 2026',
      products: [
        { name: 'Amlodipine 10mg', qty: '600 strips', amt: '₹1,20,000' },
        { name: 'Metformin 500mg', qty: '800 strips', amt: '₹1,12,000' },
        { name: 'Rosuvastatin 20mg', qty: '400 strips', amt: '₹1,10,000' },
      ],
      address: 'Sector 38, Gurgaon, Haryana – 122001',
      phone: '+91 124 4141414',
      gstin: '06AABCM1234I6Z4',
      timeline: [
        { time: '08 May, 06:00 AM', event: 'Bulk Order Placed', done: true },
        { time: '08 May, 08:30 AM', event: 'Verified & Approved', done: true },
        { time: '08 May, 02:00 PM', event: 'Dispatched', sub: 'Own logistics', done: true },
        { time: '09 May, 11:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '7',
      orderNumber: 'ORD-2835',
      customer: 'Max Healthcare',
      city: 'Noida',
      category: 'Antibiotics',
      amount: '₹98,400',
      status: 'delivered',
      items: 20,
      date: '07 May 2026',
      products: [
        { name: 'Meropenem 1g', qty: '50 vials', amt: '₹60,000' },
        { name: 'Vancomycin 500mg', qty: '80 vials', amt: '₹38,400' },
      ],
      address: 'Max Super Speciality, Sector 19, Noida – 201301',
      phone: '+91 120 4567890',
      gstin: '09AABCM9012J7Z3',
      timeline: [
        { time: '07 May, 09:00 AM', event: 'Order Placed', done: true },
        { time: '07 May, 10:30 AM', event: 'Confirmed', done: true },
        { time: '07 May, 04:30 PM', event: 'Dispatched', done: true },
        { time: '08 May, 10:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '8',
      orderNumber: 'ORD-2834',
      customer: 'Cloudnine Hospital',
      city: 'Bengaluru',
      category: 'Supplements, Vitamins',
      amount: '₹56,700',
      status: 'delivered',
      items: 30,
      date: '07 May 2026',
      products: [
        { name: 'Folic Acid 5mg', qty: '300 strips', amt: '₹18,000' },
        { name: 'Iron + Folic', qty: '250 strips', amt: '₹22,500' },
        { name: 'Calcium + Vit D3', qty: '200 boxes', amt: '₹16,200' },
      ],
      address: 'Cloudnine Hospital, Jayanagar, Bengaluru – 560041',
      phone: '+91 80 6789 1234',
      gstin: '29AABCC6789K8Z7',
      timeline: [
        { time: '07 May, 07:30 AM', event: 'Order Placed', done: true },
        { time: '07 May, 09:00 AM', event: 'Confirmed', done: true },
        { time: '07 May, 02:00 PM', event: 'Dispatched', done: true },
        { time: '08 May, 09:30 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '9',
      orderNumber: 'ORD-2833',
      customer: 'Narayana Health',
      city: 'Kolkata',
      category: 'Cardiology',
      amount: '₹1,34,500',
      status: 'delivered',
      items: 18,
      date: '06 May 2026',
      products: [
        { name: 'Digoxin 0.25mg', qty: '400 strips', amt: '₹64,000' },
        { name: 'Furosemide 40mg', qty: '300 strips', amt: '₹45,000' },
        { name: 'Spironolactone 50mg', qty: '200 strips', amt: '₹25,500' },
      ],
      address: 'Narayana Multispeciality, Howrah, Kolkata – 711102',
      phone: '+91 33 7122 7122',
      gstin: '19AABCN4567L9Z2',
      timeline: [
        { time: '06 May, 08:00 AM', event: 'Order Placed', done: true },
        { time: '06 May, 10:00 AM', event: 'Confirmed', done: true },
        { time: '06 May, 03:00 PM', event: 'Dispatched', done: true },
        { time: '07 May, 02:00 PM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '10',
      orderNumber: 'ORD-2832',
      customer: 'Ruby Hall Clinic',
      city: 'Pune',
      category: 'Analgesics',
      amount: '₹34,800',
      status: 'processing',
      items: 14,
      date: '06 May 2026',
      products: [
        { name: 'Tramadol 50mg', qty: '200 strips', amt: '₹18,000' },
        { name: 'Diclofenac 75mg', qty: '180 strips', amt: '₹16,800' },
      ],
      address: '40, Sassoon Road, Pune – 411001',
      phone: '+91 20 6645 6645',
      gstin: '27AABCR3456M0Z6',
      timeline: [
        { time: '06 May, 11:00 AM', event: 'Order Placed', done: true },
        { time: '06 May, 12:30 PM', event: 'Payment Confirmed', done: true },
        { time: '06 May, 04:00 PM', event: 'Processing', sub: 'Warehouse picking', done: true },
        { time: 'Pending', event: 'Dispatch', sub: 'Expected 07 May', done: false },
      ],
    },
    {
      id: '11',
      orderNumber: 'ORD-2831',
      customer: 'KIMS Hospital',
      city: 'Hyderabad',
      category: 'Antibiotics, Cardiology',
      amount: '₹2,76,000',
      status: 'delivered',
      items: 44,
      date: '05 May 2026',
      products: [
        { name: 'Piperacillin+Tazo', qty: '100 vials', amt: '₹1,20,000' },
        { name: 'Clopidogrel 75mg', qty: '500 strips', amt: '₹87,500' },
        { name: 'Aspirin 75mg', qty: '600 strips', amt: '₹68,500' },
      ],
      address: 'Minister Road, Secunderabad – 500003',
      phone: '+91 40 4488 5000',
      gstin: '36AABCK5678N1Z9',
      timeline: [
        { time: '05 May, 07:00 AM', event: 'Order Placed', done: true },
        { time: '05 May, 09:00 AM', event: 'Confirmed', done: true },
        { time: '05 May, 01:00 PM', event: 'Dispatched', done: true },
        { time: '06 May, 10:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '12',
      orderNumber: 'ORD-2830',
      customer: 'SRL Diagnostics',
      city: 'Mumbai',
      category: 'Supplements',
      amount: '₹22,400',
      status: 'pending',
      items: 8,
      date: '05 May 2026',
      products: [
        { name: 'Zinc 50mg', qty: '100 strips', amt: '₹12,000' },
        { name: 'Omega 3 1000mg', qty: '80 boxes', amt: '₹10,400' },
      ],
      address: 'SRL House, Goregaon, Mumbai – 400062',
      phone: '+91 22 6752 6752',
      gstin: '27AABCS7890O2Z5',
      timeline: [
        { time: '05 May, 02:00 PM', event: 'Order Placed', done: true },
        { time: 'Pending', event: 'Payment Confirmation', sub: 'Awaiting NEFT', done: false },
      ],
    },
    {
      id: '13',
      orderNumber: 'ORD-2829',
      customer: 'Dr. Agarwal Eye Hospital',
      city: 'New Delhi',
      category: 'Supplements',
      amount: '₹45,600',
      status: 'delivered',
      items: 16,
      date: '04 May 2026',
      products: [
        { name: 'Lutein + Zeaxanthin', qty: '200 boxes', amt: '₹28,000' },
        { name: 'Vitamin A 5000IU', qty: '150 boxes', amt: '₹17,600' },
      ],
      address: 'Dr. Agarwal Eye Care, Rajendra Place, New Delhi – 110008',
      phone: '+91 11 4567 0000',
      gstin: '07AABCA8901P3Z1',
      timeline: [
        { time: '04 May, 10:00 AM', event: 'Order Placed', done: true },
        { time: '04 May, 11:30 AM', event: 'Confirmed', done: true },
        { time: '04 May, 03:00 PM', event: 'Dispatched', done: true },
        { time: '05 May, 10:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '14',
      orderNumber: 'ORD-2828',
      customer: 'Apollo Clinic, Pune',
      city: 'Pune',
      category: 'Cardiology, Diabetes',
      amount: '₹1,78,900',
      status: 'shipped',
      items: 32,
      date: '04 May 2026',
      products: [
        { name: 'Atenolol 50mg', qty: '400 strips', amt: '₹52,000' },
        { name: 'Lisinopril 10mg', qty: '300 strips', amt: '₹66,000' },
        { name: 'Glibenclamide 5mg', qty: '250 strips', amt: '₹60,900' },
      ],
      address: 'Apollo Clinic, Bund Garden, Pune – 411001',
      phone: '+91 20 6600 5000',
      gstin: '27AABCA2345Q7Z4',
      timeline: [
        { time: '04 May, 08:00 AM', event: 'Order Placed', done: true },
        { time: '04 May, 09:30 AM', event: 'Confirmed', done: true },
        { time: '04 May, 02:00 PM', event: 'Dispatched', sub: 'Fedex · FDX45823', done: true },
        { time: 'In Transit', event: 'Delivery', sub: 'Expected 06 May', done: false },
      ],
    },
    {
      id: '15',
      orderNumber: 'ORD-2827',
      customer: 'Breach Candy Hospital',
      city: 'Mumbai',
      category: 'Antibiotics',
      amount: '₹87,500',
      status: 'delivered',
      items: 22,
      date: '03 May 2026',
      products: [
        { name: 'Levofloxacin 500mg', qty: '300 strips', amt: '₹45,000' },
        { name: 'Cefixime 200mg', qty: '250 strips', amt: '₹42,500' },
      ],
      address: '60-A, Bhulabhai Desai Road, Mumbai – 400026',
      phone: '+91 22 2368 3888',
      gstin: '27AABCB6789R5Z8',
      timeline: [
        { time: '03 May, 09:00 AM', event: 'Order Placed', done: true },
        { time: '03 May, 10:30 AM', event: 'Confirmed', done: true },
        { time: '03 May, 03:30 PM', event: 'Dispatched', done: true },
        { time: '04 May, 11:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '16',
      orderNumber: 'ORD-2826',
      customer: 'Manipal Hospital',
      city: 'Bengaluru',
      category: 'Analgesics, Supplements',
      amount: '₹63,200',
      status: 'cancelled',
      items: 24,
      date: '03 May 2026',
      products: [
        { name: 'Ibuprofen 400mg', qty: '400 strips', amt: '₹32,000' },
        { name: 'Acetaminophen 500mg', qty: '200 strips', amt: '₹16,000' },
        { name: 'Magnesium', qty: '150 boxes', amt: '₹15,200' },
      ],
      address: 'Manipal Hospital, CV Raman Nagar, Bengaluru – 560093',
      phone: '+91 80 4044 0000',
      gstin: '29AABCM0123S6Z2',
      timeline: [
        { time: '03 May, 11:00 AM', event: 'Order Placed', done: true },
        { time: '03 May, 01:00 PM', event: 'Confirmed', done: true },
        { time: '03 May, 04:00 PM', event: 'Cancelled by customer', sub: 'Reason: Price negotiation', done: true },
      ],
    },
    {
      id: '17',
      orderNumber: 'ORD-2825',
      customer: 'St. Johns Medical',
      city: 'Bengaluru',
      category: 'Cardiology',
      amount: '₹92,400',
      status: 'delivered',
      items: 20,
      date: '02 May 2026',
      products: [
        { name: 'Ramipril 5mg', qty: '300 strips', amt: '₹54,000' },
        { name: 'Nitroglycerin 0.6mg', qty: '150 strips', amt: '₹38,400' },
      ],
      address: 'St. Johns Medical College Hospital, Bengaluru – 560034',
      phone: '+91 80 4343 3333',
      gstin: '29AABCS9012T1Z7',
      timeline: [
        { time: '02 May, 08:30 AM', event: 'Order Placed', done: true },
        { time: '02 May, 10:00 AM', event: 'Confirmed', done: true },
        { time: '02 May, 02:00 PM', event: 'Dispatched', done: true },
        { time: '03 May, 09:30 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '18',
      orderNumber: 'ORD-2824',
      customer: 'Vimta Labs',
      city: 'Hyderabad',
      category: 'Antibiotics',
      amount: '₹1,12,600',
      status: 'delivered',
      items: 28,
      date: '02 May 2026',
      products: [
        { name: 'Ciprofloxacin 500mg', qty: '400 strips', amt: '₹56,000' },
        { name: 'Gentamicin 80mg', qty: '200 vials', amt: '₹56,600' },
      ],
      address: 'Vimta Labs, Madhapur, Hyderabad – 500081',
      phone: '+91 40 2358 6789',
      gstin: '36AABCV2345U8Z4',
      timeline: [
        { time: '02 May, 07:00 AM', event: 'Order Placed', done: true },
        { time: '02 May, 08:30 AM', event: 'Confirmed', done: true },
        { time: '02 May, 01:00 PM', event: 'Dispatched', done: true },
        { time: '03 May, 10:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '19',
      orderNumber: 'ORD-2823',
      customer: 'Fortis Escorts Hospital',
      city: 'New Delhi',
      category: 'Cardiology, Antibiotics',
      amount: '₹2,34,500',
      status: 'processing',
      items: 36,
      date: '01 May 2026',
      products: [
        { name: 'Verapamil 120mg', qty: '300 strips', amt: '₹1,05,000' },
        { name: 'Imipenem + Cilastatin', qty: '80 vials', amt: '₹96,000' },
        { name: 'Doxycycline 100mg', qty: '300 strips', amt: '₹33,500' },
      ],
      address: 'Fortis Escorts Hospital, Okhla Road, New Delhi – 110025',
      phone: '+91 11 4200 4200',
      gstin: '07AABCF3456V9Z6',
      timeline: [
        { time: '01 May, 06:00 AM', event: 'Order Placed', done: true },
        { time: '01 May, 08:00 AM', event: 'Verified & Approved', done: true },
        { time: '01 May, 02:00 PM', event: 'Processing', sub: 'Warehouse picking in progress', done: true },
        { time: 'Pending', event: 'Dispatch', sub: 'Expected 02 May', done: false },
      ],
    },
    {
      id: '20',
      orderNumber: 'ORD-2822',
      customer: 'Lilavati Hospital',
      city: 'Mumbai',
      category: 'Vitamins',
      amount: '₹78,400',
      status: 'delivered',
      items: 32,
      date: '01 May 2026',
      products: [
        { name: 'Vitamin C 500mg', qty: '500 boxes', amt: '₹45,000' },
        { name: 'Vitamin E 400IU', qty: '300 boxes', amt: '₹33,400' },
      ],
      address: '15, New Marine Lines, Mumbai – 400020',
      phone: '+91 22 6767 7777',
      gstin: '27AABCL4567W2Z9',
      timeline: [
        { time: '01 May, 10:00 AM', event: 'Order Placed', done: true },
        { time: '01 May, 11:30 AM', event: 'Confirmed', done: true },
        { time: '01 May, 03:00 PM', event: 'Dispatched', done: true },
        { time: '02 May, 10:00 AM', event: 'Delivered', done: true },
      ],
    },
    {
      id: '21',
      orderNumber: 'ORD-2821',
      customer: 'Reliance Health',
      city: 'Jaipur',
      category: 'Diabetes',
      amount: '₹1,45,800',
      status: 'delivered',
      items: 40,
      date: '30 Apr 2026',
      products: [
        { name: 'Insulin Glargine', qty: '30 pens', amt: '₹75,000' },
        { name: 'Pioglitazone 15mg', qty: '400 strips', amt: '₹42,800' },
        { name: 'Sitagliptin 50mg', qty: '300 strips', amt: '₹28,000' },
      ],
      address: 'Reliance Hospital, Jaipur – 302001',
      phone: '+91 141 5166 5166',
      gstin: '08AABCR5678X3Z5',
      timeline: [
        { time: '30 Apr, 08:00 AM', event: 'Order Placed', done: true },
        { time: '30 Apr, 09:30 AM', event: 'Confirmed', done: true },
        { time: '30 Apr, 01:00 PM', event: 'Dispatched', done: true },
        { time: '01 May, 04:00 PM', event: 'Delivered', done: true },
      ],
    },
  ];
}

export interface PaginationData<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Pagination helper function
export const paginateData = <T,>(
  data: T[],
  page: number = 1,
  itemsPerPage: number = 10
): PaginationData<T> => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
  };
};
