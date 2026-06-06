import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Settings, Bell, ChevronDown, SlidersHorizontal,
  Download, Plus, Eye, Edit2, MoreVertical,
  ChevronLeft, X, Users, FileText, Check, ShieldCheck,
  AlertTriangle, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import styles from './Reports.module.css';
import { getReports, type Report, type ReportStatus } from '../../services/reportsService';
import { getNotifications, saveNotifications, type Notification } from '../../services/notificationsService';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = 'all' | 'awaiting_approval' | 'awaiting_reimbursement' | 'reimbursed' | 'rejected';

// ─── Sub-components ───────────────────────────────────────────────────────────
const Avatar = React.memo(({ initials, variant, size = 32 }: { initials: string; variant: number; size?: number }) => (
  <div
    className={`${styles.av} ${styles[`av${variant}`]}`}
    style={{ width: size, height: size, fontSize: size * 0.3 }}
  >
    {initials}
  </div>
));

const StatusBadge = React.memo(({ status }: { status: ReportStatus }) => {
  const map: Record<ReportStatus, [string, string]> = {
    approved: [styles.sApproved, 'Approved'],
    pending:  [styles.sPending,  'Pending'],
    rejected: [styles.sRejected, 'Rejected'],
    review:   [styles.sReview,   'In Review'],
  };
  const [cls, label] = map[status];
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
});

interface ReportRowProps {
  report: Report;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const ReportRow = React.memo(({ report, isSelected, onToggle }: ReportRowProps) => {
  return (
    <tr className={isSelected ? styles.rowSel : ''}>
      <td>
        <input
          type="checkbox"
          className={styles.cb}
          checked={isSelected}
          onChange={() => onToggle(report.id)}
        />
      </td>
      <td className={styles.rNum}>{report.id}</td>
      <td>
        <div className={styles.personCell}>
          <Avatar initials={report.submitterInitials} variant={report.submitterVariant} size={32} />
          <span className={styles.personName}>{report.submitter}</span>
        </div>
      </td>
      <td>
        <div className={styles.rName}>{report.name}</div>
        <div className={styles.rCat}>{report.category}</div>
      </td>
      <td className={styles.dateVal}>{report.date}</td>
      <td><StatusBadge status={report.status} /></td>
      <td>
        <div className={styles.personCell}>
          <Avatar initials={report.approverInitials} variant={report.approverVariant} size={28} />
          <span className={styles.approverName}>{report.approver}</span>
        </div>
      </td>
      <td className={styles.totalVal}>{report.total}</td>
      <td>
        <div className={styles.actCell}>
          <button className={styles.ab} title="View"><Eye size={14} /></button>
          <button className={styles.ab} title="Edit"><Edit2 size={14} /></button>
          <button className={styles.ab} title="More"><MoreVertical size={14} /></button>
        </div>
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
  'Report ID', 'Submitter', 'Report Name', 'Category', 'Date', 'Status', 'Approver', 'Total Amount'
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
            <h2 className={styles.expTitle} id="exp-title">Export Expense Reports</h2>
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
                {scope === 'selected' ? 'Selected Records' : 'All Matching Records'}
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
            <Download size={18} className={styles.expSummaryIcon} />
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
            Ensure this report is shared only with authorised financial personnel and stored securely.
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
            I understand this file contains sensitive expense data and I take responsibility
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

// ─── Notification Panel Subcomponent ───────────────────────────────────────────
interface NotificationPanelProps {
  notifs: Notification[];
  setNotifs: React.Dispatch<React.SetStateAction<Notification[]>>;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifs, setNotifs, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markOne = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const handleNotifClick = (n: Notification) => {
    markOne(n.id);
    onClose();
    if (n.type === 'critical' || n.type === 'warning') {
      navigate('/inventory');
    } else {
      navigate('/orders');
    }
  };

  const notifIcon = (type: Notification['type']) => {
    if (type === 'critical') return <AlertTriangle size={14} style={{ color: '#F87171' }} />;
    if (type === 'warning') return <AlertCircle size={14} style={{ color: '#FBBF24' }} />;
    if (type === 'success') return <CheckCircle size={14} style={{ color: '#34D399' }} />;
    return <Clock size={14} style={{ color: '#60A5FA' }} />;
  };

  const notifBg = (type: Notification['type']) => {
    if (type === 'critical') return 'rgba(239,68,68,0.1)';
    if (type === 'warning') return 'rgba(245,158,11,0.1)';
    if (type === 'success') return 'rgba(16,185,129,0.1)';
    return 'rgba(59,130,246,0.1)';
  };

  return (
    <div ref={panelRef} className={styles.dropPanel} style={{ width: 360 }}>
      <div className={styles.dropPanelHeader}>
        <div>
          <div className={styles.dropPanelTitle}>Notifications</div>
          {unread > 0 && <div className={styles.dropPanelSub}>{unread} unread</div>}
        </div>
        {unread > 0 && (
          <button className={styles.dropPanelAction} onClick={markAll}>Mark all read</button>
        )}
      </div>

      <div className={styles.notifList}>
        {notifs.map(n => (
          <div
            key={n.id}
            className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}
            onClick={() => handleNotifClick(n)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.notifIconWrap} style={{ background: notifBg(n.type) }}>
              {notifIcon(n.type)}
            </div>
            <div className={styles.notifBody}>
              <div className={styles.notifTitle}>{n.title}</div>
              <div className={styles.notifText}>{n.body}</div>
              <div className={styles.notifTime}>{n.time}</div>
            </div>
            {!n.read && <div className={styles.notifUnreadDot}></div>}
          </div>
        ))}
      </div>

      <div className={styles.dropPanelFooter}>
        <button className={styles.dropFooterBtn} onClick={() => { onClose(); navigate('/orders'); }}>View all notifications →</button>
      </div>
    </div>
  );
};

const STATUSES: ReportStatus[] = ['approved', 'pending', 'rejected', 'review'];
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',                     label: 'All' },
  { key: 'awaiting_approval',       label: 'Awaiting Approval' },
  { key: 'awaiting_reimbursement',  label: 'Awaiting Reimbursement' },
  { key: 'reimbursed',              label: 'Reimbursed' },
  { key: 'rejected',                label: 'Rejected' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState<Report[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>(() => getNotifications());
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveNotifications(notifs);
  }, [notifs]);

  const [activeTab, setActiveTab]   = useState<TabKey>('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<ReportStatus>>(new Set());

  // Pending selections inside the sidebar. Changes here don't affect the results
  // until the user clicks Apply.
  const [pendingCategories, setPendingCategories] = useState<Set<string>>(new Set());
  const [pendingStatuses, setPendingStatuses] = useState<Set<ReportStatus>>(new Set());

  useEffect(() => {
    setReports(getReports());
  }, []);

  const CATEGORIES = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.category)));
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.submitter.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === 'all' ||
        (activeTab === 'awaiting_approval'      && r.status === 'pending') ||
        (activeTab === 'awaiting_reimbursement' && r.status === 'review')  ||
        (activeTab === 'reimbursed'             && r.status === 'approved') ||
        (activeTab === 'rejected'               && r.status === 'rejected');
      const matchCategory = selectedCategories.size === 0 || selectedCategories.has(r.category);
      const matchStatus = selectedStatuses.size === 0 || selectedStatuses.has(r.status);
      return matchSearch && matchTab && matchCategory && matchStatus;
    });
  }, [reports, search, activeTab, selectedCategories, selectedStatuses]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const { pageItems, startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, filtered.length);
    return {
      pageItems: filtered.slice(start, end),
      startIndex: start,
      endIndex: end,
    };
  }, [filtered, currentPage, pageSize]);

  const exportItems = useMemo(() => {
    return selected.size > 0 
      ? reports.filter(r => selected.has(r.id))
      : filtered;
  }, [selected, reports, filtered]);

  const exportFilename = useMemo(() => {
    return `MyPharma_Reports_Export_${new Date().toISOString().split('T')[0]}.csv`;
  }, []);

  const handleExportCSV = useCallback(() => {
    if (exportItems.length === 0) {
      alert("No reports available to export.");
      return;
    }
    setShowExportModal(true);
  }, [exportItems]);

  const performExportCSV = useCallback(() => {
    // CSV headers
    const headers = ['Report ID', 'Submitter', 'Report Name', 'Category', 'Date', 'Status', 'Approver', 'Total Amount'];

    // Escape special characters for CSV format
    const escapeCSV = (val: string) => {
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    // Construct rows
    const rows = exportItems.map(r => [
      r.id,
      r.submitter,
      r.name,
      r.category,
      r.date,
      r.status,
      r.approver,
      r.total
    ]);

    // Create final CSV string
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', exportFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  }, [exportItems, exportFilename]);

  const togglePendingCategory = useCallback((cat: string) => {
    setPendingCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }, []);

  const togglePendingStatus = useCallback((st: ReportStatus) => {
    setPendingStatuses(prev => {
      const next = new Set(prev);
      next.has(st) ? next.delete(st) : next.add(st);
      return next;
    });
  }, []);

  const toggleRow = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected(prev =>
      prev.size === pageItems.length ? new Set() : new Set(pageItems.map(r => r.id))
    );
  }, [pageItems]);

  return (
    <div className={styles.shell}>
      {showExportModal && (
        <ExportConsentModal
          count={exportItems.length}
          scope={selected.size > 0 ? 'selected' : 'all'}
          filename={exportFilename}
          onConfirm={performExportCSV}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      {/* ── Main ── */}
      <div className={styles.mainWrap}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <h1 className={styles.topTitle}>Reports</h1>
          <div className={styles.topSpacer} />
          <div className={styles.topSearch}>
            <Search size={14} className={styles.topSearchIcon} />
            <input
              className={styles.topSearchInput}
              placeholder="Search reports…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.topIconBtn} onClick={() => navigate('/settings')} aria-label="Settings">
            <Settings size={16} />
          </button>
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              className={`${styles.topIconBtn} ${showNotif ? styles.tbtnActive : ''}`}
              onClick={() => setShowNotif(p => !p)}
              aria-label="Notifications"
            >
              <Bell size={16} />
              {notifs.filter(n => !n.read).length > 0 && <span className={styles.notifDot} />}
            </button>
            {showNotif && (
              <div className={styles.dropPanelWrap}>
                <NotificationPanel notifs={notifs} setNotifs={setNotifs} onClose={() => setShowNotif(false)} />
              </div>
            )}
          </div>
          <div className={styles.userChip}>
            <Avatar initials="PK" variant={0} size={28} />
            <span className={styles.userName}>Pravin Kumar</span>
            <ChevronDown size={13} className={styles.userChev} />
          </div>
        </header>

        {/* Page */}
        <main className={styles.page}>

          {/* Tabs bar */}
          <div className={styles.tabsBar}>
            <div className={styles.tabs}>
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`${styles.tab} ${activeTab === t.key ? styles.tabOn : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.tabsRight}>
              <button
                className={styles.actBtn}
                onClick={() => {
                  // when opening the panel, seed pending with current selections
                  setShowFilters(s => {
                    const next = !s;
                    if (!s) {
                      setPendingCategories(new Set(selectedCategories));
                      setPendingStatuses(new Set(selectedStatuses));
                    }
                    return next;
                  });
                }}
              ><SlidersHorizontal size={13} /> Filter</button>
              <button className={styles.actBtn} onClick={handleExportCSV}><Download size={13} /> Export</button>
              <button className={styles.newBtn} onClick={() => navigate('/reports/new')}><Plus size={14} /> New Report</button>
            </div>
          </div>

          {/* Filters Sidebar Drawer */}
          {showFilters && (
            <div className={styles.filterOverlay} onClick={() => setShowFilters(false)}>
              <div className={styles.filterDrawer} onClick={e => e.stopPropagation()}>
                <div className={styles.filterHeader}>
                  <div>
                    <h3 className={styles.filterTitle}>Filters</h3>
                    <p className={styles.filterSub}>Narrow down report listings</p>
                  </div>
                  <button className={styles.filterCloseBtn} onClick={() => setShowFilters(false)} aria-label="Close filters">
                    <X size={16} />
                  </button>
                </div>

                <div className={styles.filterBody}>
                  <div className={styles.filterSection}>
                    <h4 className={styles.filterSectionTitle}>Categories</h4>
                    <div className={styles.filterGrid}>
                      {CATEGORIES.map(cat => (
                        <label key={cat} className={styles.filterCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={pendingCategories.has(cat)}
                            onChange={() => togglePendingCategory(cat)}
                            className={styles.filterCheckboxInput}
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.filterSection}>
                    <h4 className={styles.filterSectionTitle}>Status</h4>
                    <div className={styles.filterGrid}>
                      {STATUSES.map(st => (
                        <label key={st} className={styles.filterCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={pendingStatuses.has(st)}
                            onChange={() => togglePendingStatus(st)}
                            className={styles.filterCheckboxInput}
                          />
                          <span>{st.charAt(0).toUpperCase() + st.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.filterFooter}>
                  <button
                    type="button"
                    className={styles.filterClearBtn}
                    onClick={() => { setPendingCategories(new Set()); setPendingStatuses(new Set()); }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className={styles.filterApplyBtn}
                    onClick={() => {
                      setSelectedCategories(new Set(pendingCategories));
                      setSelectedStatuses(new Set(pendingStatuses));
                      setShowFilters(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table card */}
          <div className={styles.tcard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className={styles.cb}
                        onChange={toggleAll}
                        checked={selected.size === pageItems.length && pageItems.length > 0}
                      />
                    </th>
                    <th>Report #</th>
                    <th>Submitter</th>
                    <th>Report Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Approver</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length > 0 ? pageItems.map(r => (
                    <ReportRow
                      key={r.id}
                      report={r}
                      isSelected={selected.has(r.id)}
                      onToggle={toggleRow}
                    />
                  )) : (
                    <tr>
                      <td colSpan={9} className={styles.empty}>No reports found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.tfoot}>
              <span className={styles.pgInfo}>
                Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{filtered.length}</strong> reports
              </span>
              <div className={styles.pgBtns}>
                <button className={styles.pb} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`${styles.pb} ${p === currentPage ? styles.pbOn : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >{p}</button>
                ))}
                <button className={styles.pb} onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  <ChevronLeft size={13} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
