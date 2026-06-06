import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search, ChevronDown, SlidersHorizontal, FileDown,
  ChevronLeft, MoreHorizontal, ArrowUpDown, Check, RotateCcw,
  ShieldCheck, X, Download, Users, FileText
} from 'lucide-react';
import styles from './Customers.module.css';

type CustomerStatus = 'active' | 'locked' | 'new';

interface Customer {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  spent: string;
  status: CustomerStatus;
  avatarInitials: string;
  avatarVariant: 0 | 1 | 2 | 3 | 4;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: '22665541', name: 'City Hospital',     email: 'procurement@cityhospital.in', joined: '26 Jan, 2023', orders: 1220, spent: '₹12,40,000', status: 'active', avatarInitials: 'CH', avatarVariant: 0 },
  { id: '22665542', name: 'Apollo Pharmacy',   email: 'orders@apolloph.in',          joined: '26 Jan, 2023', orders:  980, spent: '₹8,95,000',  status: 'active', avatarInitials: 'AP', avatarVariant: 1 },
  { id: '22665543', name: 'MedPlus',           email: 'supply@medplus.in',           joined: '15 Feb, 2023', orders:  742, spent: '₹6,42,000',  status: 'active', avatarInitials: 'MP', avatarVariant: 2 },
  { id: '22665544', name: 'Fortis Pharmacy',   email: 'meds@fortis.in',              joined: '03 Mar, 2023', orders: 1105, spent: '₹9,18,000',  status: 'active', avatarInitials: 'FP', avatarVariant: 3 },
  { id: '22665545', name: 'LifeCare Stores',   email: 'buy@lifecare.in',             joined: '10 Mar, 2023', orders:  312, spent: '₹3,87,000',  status: 'locked', avatarInitials: 'LC', avatarVariant: 4 },
  { id: '22665546', name: 'Medanta',           email: 'pharma@medanta.in',           joined: '22 Mar, 2023', orders:  874, spent: '₹15,60,000', status: 'active', avatarInitials: 'ME', avatarVariant: 0 },
  { id: '22665547', name: 'GreenCross Clinic', email: 'clinic@greencross.in',        joined: '05 Apr, 2023', orders:  560, spent: '₹1,24,000',  status: 'active', avatarInitials: 'GC', avatarVariant: 1 },
  { id: '22665548', name: 'Rainbow Medical',   email: 'orders@rainbow.in',           joined: '18 Apr, 2023', orders:  190, spent: '₹72,000',    status: 'locked', avatarInitials: 'RM', avatarVariant: 2 },
  { id: '22665549', name: 'Savannah Health',   email: 'care@savannahhealth.in',      joined: '30 Apr, 2023', orders: 1430, spent: '₹11,20,000', status: 'active', avatarInitials: 'SH', avatarVariant: 3 },
  { id: '22665550', name: 'Esther Clinic',     email: 'info@estherclinic.in',        joined: '14 May, 2023', orders:   88, spent: '₹64,000',    status: 'new',    avatarInitials: 'EC', avatarVariant: 4 },
  { id: '22665551', name: 'KIMS Hospital',     email: 'kims@kims.in',                joined: '20 May, 2023', orders: 1150, spent: '₹10,80,000', status: 'active', avatarInitials: 'KH', avatarVariant: 0 },
  { id: '22665552', name: 'Aster CMI Clinic',  email: 'contact@aster.in',            joined: '02 Jun, 2023', orders:  905, spent: '₹7,25,000',  status: 'active', avatarInitials: 'AC', avatarVariant: 1 },
  { id: '22665553', name: 'Max Healthcare',    email: 'max@maxhealthcare.in',        joined: '15 Jun, 2023', orders: 1420, spent: '₹14,90,000', status: 'active', avatarInitials: 'MH', avatarVariant: 2 },
  { id: '22665554', name: 'Manipal Hospital',  email: 'manipal@manipal.in',          joined: '29 Jun, 2023', orders: 1080, spent: '₹9,85,000',  status: 'active', avatarInitials: 'MH', avatarVariant: 3 },
  { id: '22665555', name: 'Care Pharmacy',     email: 'orders@careph.in',            joined: '05 Jul, 2023', orders:  240, spent: '₹1,80,000',  status: 'locked', avatarInitials: 'CP', avatarVariant: 4 },
  { id: '22665556', name: 'Hindustan Health',  email: 'hh@hindustanhealth.in',       joined: '18 Jul, 2023', orders:  620, spent: '₹4,90,000',  status: 'new',    avatarInitials: 'HH', avatarVariant: 0 },
  { id: '22665557', name: 'Trust Pharmacy',    email: 'trust@trust.in',              joined: '01 Aug, 2023', orders:  490, spent: '₹3,20,000',  status: 'active', avatarInitials: 'TP', avatarVariant: 1 },
  { id: '22665558', name: 'Narayana Health',   email: 'nh@narayana.in',              joined: '12 Aug, 2023', orders: 1310, spent: '₹13,40,000', status: 'active', avatarInitials: 'NH', avatarVariant: 2 },
  { id: '22665559', name: 'Prime Medicals',    email: 'prime@primemed.in',           joined: '24 Aug, 2023', orders:   85, spent: '₹52,000',    status: 'new',    avatarInitials: 'PM', avatarVariant: 3 },
  { id: '22665560', name: 'Wellcare Clinic',   email: 'wellcare@clinic.in',          joined: '05 Sep, 2023', orders:  510, spent: '₹4,10,000',  status: 'active', avatarInitials: 'WC', avatarVariant: 4 },
  { id: '22665561', name: 'Appolo Clinic',     email: 'clinic@apollo.in',            joined: '15 Sep, 2023', orders:  430, spent: '₹3,50,000',  status: 'locked', avatarInitials: 'AC', avatarVariant: 0 },
  { id: '22665562', name: 'Metro Pharma',      email: 'metro@pharma.in',             joined: '28 Sep, 2023', orders: 1520, spent: '₹16,80,000', status: 'active', avatarInitials: 'MP', avatarVariant: 1 },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'orders-desc', label: 'Orders: High to Low' },
  { value: 'orders-asc', label: 'Orders: Low to High' },
  { value: 'spent-desc', label: 'Spent: High to Low' },
  { value: 'spent-asc', label: 'Spent: Low to High' },
  { value: 'joined-desc', label: 'Joined: Newest First' },
  { value: 'joined-asc', label: 'Joined: Oldest First' },
];

const getSortLabel = (val: string) => {
  return SORT_OPTIONS.find(opt => opt.value === val)?.label || 'Default';
};

const StatusBadge = React.memo(({ status }: { status: CustomerStatus }) => {
  const map: Record<CustomerStatus, { cls: string; label: string }> = {
    active: { cls: styles.sActive, label: '● Active' },
    locked: { cls: styles.sLocked, label: '🔒 Locked' },
    new:    { cls: styles.sNew,    label: '✦ New' },
  };
  const { cls, label } = map[status];
  return <span className={`${styles.statusBadge} ${cls}`}>{label}</span>;
});

const Avatar = React.memo(({ initials, variant }: { initials: string; variant: number }) => (
  <div className={`${styles.custAv} ${styles[`av${variant}`]}`}>{initials}</div>
));

interface CustomerRowProps {
  customer: Customer;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const CustomerRow = React.memo(({ customer, isSelected, onToggle }: CustomerRowProps) => {
  return (
    <tr className={isSelected ? styles.rowSelected : ''}>
      <td>
        <input 
          type="checkbox" 
          className={styles.cb} 
          checked={isSelected} 
          onChange={() => onToggle(customer.id)} 
        />
      </td>
      <td className={styles.cid}>{customer.id}</td>
      <td>
        <div className={styles.custCell}>
          <Avatar initials={customer.avatarInitials} variant={customer.avatarVariant} />
          <div>
            <div className={styles.custName}>{customer.name}</div>
            <div className={styles.custEmail}>{customer.email}</div>
          </div>
        </div>
      </td>
      <td className={styles.joined}>{customer.joined}</td>
      <td className={styles.ordersNum}>{customer.orders.toLocaleString()}</td>
      <td className={styles.spentVal}>{customer.spent}</td>
      <td><StatusBadge status={customer.status} /></td>
      <td>
        <button className={styles.actionBtn}>
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
});

interface ExportConsentModalProps {
  count: number;
  scope: 'selected' | 'all';
  filename: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const EXPORT_COLUMNS = [
  'Customer ID', 'Customer Name', 'Email Address',
  'Joined On', 'Total Orders', 'Total Spent', 'Status'
];

const ExportConsentModal: React.FC<ExportConsentModalProps> = ({
  count, scope, filename, onConfirm, onCancel
}) => {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className={styles.expOverlay} onClick={onCancel}>
      <div
        className={styles.expModal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exp-title"
      >
        <div className={styles.expModalHead}>
          <div className={styles.expIconWrap}>
            <Download size={22} />
          </div>
          <div>
            <h2 className={styles.expTitle} id="exp-title">Export Customer List</h2>
            <p className={styles.expSub}>Review the details below before downloading</p>
          </div>
          <button className={styles.expClose} onClick={onCancel} aria-label="Cancel">
            <X size={16} />
          </button>
        </div>

        <div className={styles.expSummary}>
          <div className={styles.expSummaryCard}>
            <Users size={18} className={styles.expSummaryIcon} />
            <div>
              <div className={styles.expSummaryVal}>{count}</div>
              <div className={styles.expSummaryLbl}>
                {scope === 'selected' ? 'Selected Customers' : 'All Matching Customers'}
              </div>
            </div>
          </div>
          <div className={styles.expSummaryCard}>
            <FileText size={18} className={styles.expSummaryIcon} />
            <div>
              <div className={styles.expSummaryVal}>CSV</div>
              <div className={styles.expSummaryLbl}>File Format</div>
            </div>
          </div>
          <div className={styles.expSummaryCard}>
            <FileDown size={18} className={styles.expSummaryIcon} />
            <div>
              <div className={styles.expSummaryVal} style={{ fontSize: 11, wordBreak: 'break-all' }}>{filename}</div>
              <div className={styles.expSummaryLbl}>File Name</div>
            </div>
          </div>
        </div>

        <div className={styles.expSection}>
          <div className={styles.expSectionTitle}>Columns included in export</div>
          <div className={styles.expColumns}>
            {EXPORT_COLUMNS.map(col => (
              <div key={col} className={styles.expCol}>
                <Check size={11} style={{ flexShrink: 0 }} />
                {col}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.expNotice}>
          <ShieldCheck size={15} className={styles.expNoticeIcon} />
          <p className={styles.expNoticeText}>
            This export contains <strong>personally identifiable information</strong> (email addresses).
            Ensure the file is shared only with authorised personnel and stored securely per your
            organisation's data policy.
          </p>
        </div>

        <label className={styles.expConsent}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className={styles.expConsentCheck}
          />
          <span>
            I understand this file contains sensitive customer data and I take responsibility
            for its secure handling.
          </span>
        </label>

        <div className={styles.expActions}>
          <button className={styles.expCancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.expDownloadBtn}
            onClick={onConfirm}
            disabled={!agreed}
          >
            <Download size={15} />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomersPage: React.FC = () => {
  const [search, setSearch]                   = useState('');
  const [sortOption, setSortOption]           = useState('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filterStatus, setFilterStatus]       = useState('all');
  const [filterOrders, setFilterOrders]       = useState('all');
  const [filterSpent, setFilterSpent]         = useState('all');
  const [selected, setSelected]               = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage]         = useState(1);
  const itemsPerPage = 10;
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const activeFiltersCount = (filterStatus !== 'all' ? 1 : 0) + 
                             (filterOrders !== 'all' ? 1 : 0) + 
                             (filterSpent !== 'all' ? 1 : 0);

  const resetFilters = useCallback(() => {
    setFilterStatus('all');
    setFilterOrders('all');
    setFilterSpent('all');
    setCurrentPage(1);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...MOCK_CUSTOMERS];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.includes(q) ||
        c.status.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus);
    }
    if (filterOrders !== 'all') {
      result = result.filter(c => {
        if (filterOrders === 'high') return c.orders > 1000;
        if (filterOrders === 'medium') return c.orders >= 500 && c.orders <= 1000;
        if (filterOrders === 'low') return c.orders < 500;
        return true;
      });
    }
    if (filterSpent !== 'all') {
      result = result.filter(c => {
        const amt = parseInt(c.spent.replace(/[^\d]/g, ''), 10) || 0;
        if (filterSpent === 'high') return amt > 1000000;
        if (filterSpent === 'medium') return amt >= 500000 && amt <= 1000000;
        if (filterSpent === 'low') return amt < 500000;
        return true;
      });
    }
    if (sortOption !== 'default') {
      result.sort((a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOption === 'orders-desc') return b.orders - a.orders;
        if (sortOption === 'orders-asc') return a.orders - b.orders;
        if (sortOption === 'spent-desc' || sortOption === 'spent-asc') {
          const amtA = parseInt(a.spent.replace(/[^\d]/g, ''), 10) || 0;
          const amtB = parseInt(b.spent.replace(/[^\d]/g, ''), 10) || 0;
          return sortOption === 'spent-desc' ? amtB - amtA : amtA - amtB;
        }
        if (sortOption === 'joined-desc' || sortOption === 'joined-asc') {
          const timeA = new Date(a.joined).getTime() || 0;
          const timeB = new Date(b.joined).getTime() || 0;
          return sortOption === 'joined-desc' ? timeB - timeA : timeA - timeB;
        }
        return 0;
      });
    }
    return result;
  }, [search, filterStatus, filterOrders, filterSpent, sortOption]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));

  const paginated = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, activePage, itemsPerPage]);

  const toggleRow = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected(prev => {
      const visibleIds = paginated.map(c => c.id);
      const allSelected = visibleIds.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach(id => next.delete(id));
      } else {
        visibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, [paginated]);

  const exportItems = useMemo(() => {
    return selected.size > 0
      ? MOCK_CUSTOMERS.filter(c => selected.has(c.id))
      : filteredAndSorted;
  }, [selected, filteredAndSorted]);

  const exportFilename = useMemo(() => {
    return `customers_export_${new Date().toISOString().slice(0, 10)}.csv`;
  }, []);

  const handleExport = useCallback(() => {
    if (exportItems.length === 0) return;
    setShowExportModal(true);
  }, [exportItems]);

  const performExport = useCallback(() => {
    const headers = ["Customer ID", "Customer Name", "Email", "Joined On", "Orders", "Total Spent", "Status"];
    const csvRows = [
      headers.join(","),
      ...exportItems.map(c => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email.replace(/"/g, '""')}"`,
        c.joined,
        c.orders,
        `"${c.spent}"`,
        c.status
      ].join(","))
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", exportFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  }, [exportItems, exportFilename]);

  return (
    <div className={styles.shell}>
      {showExportModal && (
        <ExportConsentModal
          count={exportItems.length}
          scope={selected.size > 0 ? 'selected' : 'all'}
          filename={exportFilename}
          onConfirm={performExport}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      <div className={styles.mainWrap}>
        <main className={styles.page}>
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Customer</h1>
              <p className={styles.pageSub}>Check all registered customers and manage their details</p>
            </div>
            <button className={styles.exportBtn} onClick={handleExport}>
              <FileDown size={15} /> Export List
            </button>
          </div>

          <div className={styles.tcard}>
            <div className={styles.toolbar}>
              <div className={styles.tSearch}>
                <Search size={14} className={styles.tSearchIcon} />
                <input 
                  className={styles.tSearchInput} 
                  placeholder="Search by ID, name, status" 
                  value={search} 
                  onChange={e => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }} 
                />
              </div>
              <div className={styles.toolSpacer} />
              
              {/* Sort By Dropdown */}
              <div className={styles.dropdownContainer} ref={sortRef}>
                <button className={styles.sortBtn} onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterPanel(false); }}>
                  <ArrowUpDown size={13} /> Sort By: {getSortLabel(sortOption)} <ChevronDown size={12} />
                </button>
                {showSortDropdown && (
                  <div className={styles.sortDropdown}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`${styles.dropdownItem} ${sortOption === opt.value ? styles.dropdownItemActive : ''}`}
                        onClick={() => {
                          setSortOption(opt.value);
                          setShowSortDropdown(false);
                          setCurrentPage(1);
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Panel Dropdown */}
              <div className={styles.dropdownContainer} ref={filterRef}>
                <button 
                  className={`${styles.filterBtn} ${activeFiltersCount > 0 ? styles.filterBtnActive : ''}`} 
                  onClick={() => { setShowFilterPanel(!showFilterPanel); setShowSortDropdown(false); }}
                >
                  <SlidersHorizontal size={13} /> Filter {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}
                </button>
                {showFilterPanel && (
                  <div className={styles.filterPanel}>
                    <div className={styles.filterPanelHeader}>
                      <h3>Filter Options</h3>
                      <button className={styles.resetBtn} onClick={resetFilters} title="Reset Filters">
                        <RotateCcw size={12} /> Reset
                      </button>
                    </div>

                    <div className={styles.filterGroup}>
                      <label>Status</label>
                      <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="locked">Locked</option>
                        <option value="new">New</option>
                      </select>
                    </div>

                    <div className={styles.filterGroup}>
                      <label>Orders Count</label>
                      <select value={filterOrders} onChange={e => { setFilterOrders(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Orders</option>
                        <option value="high">High (&gt; 1,000)</option>
                        <option value="medium">Medium (500 - 1,000)</option>
                        <option value="low">Low (&lt; 500)</option>
                      </select>
                    </div>

                    <div className={styles.filterGroup}>
                      <label>Total Spent</label>
                      <select value={filterSpent} onChange={e => { setFilterSpent(e.target.value); setCurrentPage(1); }}>
                        <option value="all">All Spending</option>
                        <option value="high">High (&gt; ₹10,00,000)</option>
                        <option value="medium">Medium (₹5,00,000 - ₹10,00,000)</option>
                        <option value="low">Low (&lt; ₹5,00,000)</option>
                      </select>
                    </div>

                    <button className={styles.applyBtn} onClick={() => setShowFilterPanel(false)}>
                      Apply Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        className={styles.cb} 
                        onChange={toggleAll} 
                        checked={paginated.length > 0 && paginated.every(c => selected.has(c.id))} 
                      />
                    </th>
                    <th>Customer ID</th>
                    <th>Customer</th>
                    <th>Joined On</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(c => (
                    <CustomerRow
                      key={c.id}
                      customer={c}
                      isSelected={selected.has(c.id)}
                      onToggle={toggleRow}
                    />
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.empty}>No customers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.tfoot}>
              <span className={styles.pgInfo}>
                Showing <strong>{totalItems === 0 ? 0 : (activePage - 1) * itemsPerPage + 1}–{Math.min(activePage * itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> customers
              </span>
              {totalPages > 1 && (
                <div className={styles.pgBtns}>
                  <button 
                    className={styles.pgb} 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={activePage === 1}
                  >
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p} 
                      className={`${styles.pgb} ${activePage === p ? styles.pgOn : ''}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    className={styles.pgb} 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={activePage === totalPages}
                  >
                    <ChevronLeft size={13} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Bulk Action Bar */}
      {selected.size > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkText}>
            <Check size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {selected.size} customer{selected.size > 1 ? 's' : ''} selected
          </span>
          <button className={`${styles.bulkBtn} ${styles.bulkBtnPrimary}`} onClick={handleExport}>
            <FileDown size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Export Selected
          </button>
          <button className={styles.bulkBtn} onClick={() => setSelected(new Set())}>
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
