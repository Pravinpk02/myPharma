export type ReportStatus = 'approved' | 'pending' | 'rejected' | 'review';

export interface Report {
  id: string;
  submitter: string;
  submitterInitials: string;
  submitterVariant: 0 | 1 | 2 | 3 | 4;
  name: string;
  category: string;
  date: string;
  status: ReportStatus;
  approver: string;
  approverInitials: string;
  approverVariant: 0 | 1 | 2 | 3 | 4;
  total: string;
  description?: string;
  items?: Array<{ name: string; category: string; amount: string }>;
}

const STORAGE_KEY = 'mypharma_reports_db';

const INITIAL_REPORTS: Report[] = [
  { id:'RP-00241', submitter:'Pravin Kumar',  submitterInitials:'PK', submitterVariant:0, name:'Monthly Pharma Procurement',      category:'Procurement', date:'01 May – 10 May 2026', status:'approved', approver:'Dr. Meera',    approverInitials:'DM', approverVariant:1, total:'₹1,06,460' },
  { id:'RP-00240', submitter:'Anita Sharma',  submitterInitials:'AS', submitterVariant:1, name:'Q1 Inventory Audit Report',        category:'Inventory',   date:'01 Apr – 30 Apr 2026', status:'pending',  approver:'Rajesh Nair', approverInitials:'RN', approverVariant:2, total:'₹1,60,139' },
  { id:'RP-00239', submitter:'Karan Mehta',   submitterInitials:'KM', submitterVariant:2, name:'Sales Distribution Summary',       category:'Sales',       date:'15 Apr – 30 Apr 2026', status:'approved', approver:'Sunita Rao',  approverInitials:'SR', approverVariant:3, total:'₹1,43,947' },
  { id:'RP-00238', submitter:'Divya Pillai',  submitterInitials:'DP', submitterVariant:3, name:'Cold Chain Compliance',            category:'Logistics',   date:'10 Apr – 20 Apr 2026', status:'review',   approver:'Anil Kumar',  approverInitials:'AK', approverVariant:4, total:'₹1,44,010' },
  { id:'RP-00237', submitter:'Rohit Verma',   submitterInitials:'RV', submitterVariant:4, name:'Regulatory Submission Q2',         category:'Compliance',  date:'01 May – 05 May 2026', status:'approved', approver:'Dr. Priya',   approverInitials:'DP', approverVariant:0, total:'₹1,17,858' },
  { id:'RP-00236', submitter:'Sneha Iyer',    submitterInitials:'SI', submitterVariant:0, name:'Narcotic Stock Reconciliation',    category:'Inventory',   date:'25 Apr – 30 Apr 2026', status:'rejected', approver:'Vikram Singh',approverInitials:'VS', approverVariant:1, total:'₹1,17,527' },
  { id:'RP-00235', submitter:'Mahesh Gupta',  submitterInitials:'MG', submitterVariant:2, name:'Hospital Supply Orders',           category:'Procurement', date:'01 May – 08 May 2026', status:'approved', approver:'Dr. Meera',   approverInitials:'DM', approverVariant:3, total:'₹1,42,050' },
  { id:'RP-00234', submitter:'Pooja Nair',    submitterInitials:'PN', submitterVariant:3, name:'Warehouse Expense Summary',        category:'Operations',  date:'20 Apr – 28 Apr 2026', status:'pending',  approver:'Rajesh Nair', approverInitials:'RN', approverVariant:4, total:'₹1,38,300' },
  { id:'RP-00233', submitter:'Arjun Das',     submitterInitials:'AD', submitterVariant:1, name:'Product Return Analysis',          category:'Quality',     date:'01 Apr – 15 Apr 2026', status:'approved', approver:'Sunita Rao',  approverInitials:'SR', approverVariant:2, total:'₹1,28,839' },
  { id:'RP-00232', submitter:'Lakshmi Rao',   submitterInitials:'LR', submitterVariant:4, name:'Annual Drug Safety Report',        category:'Safety',      date:'01 Jan – 31 Mar 2026', status:'review',   approver:'Dr. Priya',   approverInitials:'DP', approverVariant:0, total:'₹1,57,049' },
  { id:'RP-00231', submitter:'Neha Gupta',    submitterInitials:'NG', submitterVariant:2, name:'Cold Storage Audit',               category:'Logistics',   date:'05 May – 12 May 2026', status:'approved', approver:'Anil Kumar',  approverInitials:'AK', approverVariant:1, total:'₹85,340' },
  { id:'RP-00230', submitter:'Vikas Rao',     submitterInitials:'VR', submitterVariant:1, name:'Pharmacy Sales Q2',                category:'Sales',       date:'01 Apr – 30 Jun 2026', status:'pending',  approver:'Sunita Rao',  approverInitials:'SR', approverVariant:3, total:'₹2,40,120' },
  { id:'RP-00229', submitter:'Meera Joshi',   submitterInitials:'MJ', submitterVariant:0, name:'Supplier Compliance Check',        category:'Procurement', date:'10 May – 15 May 2026', status:'review',   approver:'Rajesh Nair', approverInitials:'RN', approverVariant:2, total:'₹46,780' },
  { id:'RP-00228', submitter:'Rahul Singh',   submitterInitials:'RS', submitterVariant:3, name:'Inventory Recount',                category:'Inventory',   date:'20 May – 22 May 2026', status:'approved', approver:'Vikram Singh',approverInitials:'VS', approverVariant:1, total:'₹12,340' },
  { id:'RP-00227', submitter:'Priya Menon',   submitterInitials:'PM', submitterVariant:4, name:'Adverse Event Summary',            category:'Safety',      date:'01 May – 31 May 2026', status:'rejected', approver:'Dr. Priya',   approverInitials:'DP', approverVariant:0, total:'₹5,200' },
  { id:'RP-00226', submitter:'Amit Patel',    submitterInitials:'AP', submitterVariant:2, name:'Weekly Supply Orders',             category:'Operations',  date:'18 May – 24 May 2026', status:'approved', approver:'Dr. Meera',   approverInitials:'DM', approverVariant:3, total:'₹98,450' },
  { id:'RP-00225', submitter:'Sunita Rao',    submitterInitials:'SR', submitterVariant:3, name:'Quality Control Run',              category:'Quality',     date:'02 May – 03 May 2026', status:'pending',  approver:'Rajesh Nair', approverInitials:'RN', approverVariant:2, total:'₹7,990' },
  { id:'RP-00224', submitter:'Kavita Desai',  submitterInitials:'KD', submitterVariant:1, name:'Regulatory Filing',                category:'Compliance',  date:'12 May – 14 May 2026', status:'approved', approver:'Dr. Priya',   approverInitials:'DP', approverVariant:0, total:'₹31,600' },
  { id:'RP-00223', submitter:'Rajan Iyer',    submitterInitials:'RI', submitterVariant:0, name:'Distribution Logistics Plan',      category:'Logistics',   date:'08 May – 18 May 2026', status:'review',   approver:'Anil Kumar',  approverInitials:'AK', approverVariant:4, total:'₹2,12,000' },
];

export const getReports = (): Report[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_REPORTS;
  }
};

export const addReport = (reportData: Omit<Report, 'id' | 'status' | 'submitter' | 'submitterInitials' | 'submitterVariant' | 'approverInitials' | 'approverVariant'>): Report => {
  const db = getReports();
  
  // Find highest ID to increment
  let nextIdNum = 242;
  if (db.length > 0) {
    const ids = db.map(r => parseInt(r.id.replace('RP-', ''))).filter(n => !isNaN(n));
    if (ids.length > 0) {
      nextIdNum = Math.max(...ids) + 1;
    }
  }
  const nextId = `RP-${String(nextIdNum).padStart(5, '0')}`;

  const nameToInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const newReport: Report = {
    ...reportData,
    id: nextId,
    status: 'pending',
    submitter: 'Pravin Kumar', // Default current user
    submitterInitials: 'PK',
    submitterVariant: 0,
    approverInitials: nameToInitials(reportData.approver),
    approverVariant: (Math.floor(Math.random() * 5)) as 0 | 1 | 2 | 3 | 4,
  };

  db.unshift(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return newReport;
};
