import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis, LabelList, CartesianGrid } from 'recharts';
import { Search, Bell, Calendar, X, ChevronLeft, ChevronRight, AlertTriangle, Package, ShoppingCart, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

import type {
  MetricData,
  InventoryItem,
  Order,
  ChartDataPoint,
  CategoryData,
} from '../../services/dashboardMockData';
import {
  getMetrics,
  getSalesChartData,
  getCategoryData,
  getInventoryAlerts,
  getRecentOrders,
} from '../../services/dashboardMockData';
import { getNotifications, saveNotifications, type Notification } from '../../services/notificationsService';
import { getOrdersApi } from '../../api/ordersApi';

// ─── Search Data Types ─────────────────────────────────────────────────────────
interface SearchResult {
  type: 'product' | 'order' | 'customer';
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  action?: () => void;
}

const ALL_SEARCH_DATA: SearchResult[] = [
  // Products
  { type: 'product', title: 'Amoxicillin 500mg', subtitle: 'Antibiotic · Batch A204 · 18% stock', tag: 'Critical', tagColor: '#F87171' },
  { type: 'product', title: 'Metformin 1000mg', subtitle: 'Diabetes · Batch D119 · 32% stock', tag: 'Low Stock', tagColor: '#FBBF24' },
  { type: 'product', title: 'Paracetamol 650mg', subtitle: 'Analgesic · Batch P302 · 12% stock', tag: 'Critical', tagColor: '#F87171' },
  { type: 'product', title: 'Vitamin D3 1000IU', subtitle: 'Supplement · Batch V088 · 65% stock', tag: 'Good', tagColor: '#34D399' },
  { type: 'product', title: 'Atorvastatin 40mg', subtitle: 'Cardiology · Batch C511 · 27% stock', tag: 'Low Stock', tagColor: '#FBBF24' },
  // Orders
  { type: 'order', title: '#ORD-2841 — City Hospital, Chennai', subtitle: 'Antibiotics, Vitamins · ₹1,24,000', tag: 'Delivered', tagColor: '#34D399' },
  { type: 'order', title: '#ORD-2840 — Apollo Pharmacy, Bengaluru', subtitle: 'Cardiology · ₹89,500', tag: 'Processing', tagColor: '#60A5FA' },
  { type: 'order', title: '#ORD-2839 — MedPlus, Hyderabad', subtitle: 'Diabetes, Supplements · ₹2,18,750', tag: 'Shipped', tagColor: '#C084FC' },
  { type: 'order', title: '#ORD-2838 — Fortis Pharmacy, Mumbai', subtitle: 'Antibiotics · ₹45,200', tag: 'Delivered', tagColor: '#34D399' },
  { type: 'order', title: '#ORD-2837 — LifeCare Stores, Pune', subtitle: 'Vitamins, Analgesics · ₹67,300', tag: 'Cancelled', tagColor: '#F87171' },
  // Customers
  { type: 'customer', title: 'City Hospital', subtitle: 'Chennai · 24 orders this year', tag: 'Hospital', tagColor: '#60A5FA' },
  { type: 'customer', title: 'Apollo Pharmacy', subtitle: 'Bengaluru · 18 orders this year', tag: 'Pharmacy', tagColor: '#34D399' },
  { type: 'customer', title: 'MedPlus', subtitle: 'Hyderabad · 31 orders this year', tag: 'Pharmacy', tagColor: '#34D399' },
  { type: 'customer', title: 'Fortis Pharmacy', subtitle: 'Mumbai · 15 orders this year', tag: 'Pharmacy', tagColor: '#34D399' },
  { type: 'customer', title: 'Medanta', subtitle: 'New Delhi · 40 orders this year', tag: 'Hospital', tagColor: '#60A5FA' },
];

// Notifications are imported from notificationsService

// ─── Calendar Events ───────────────────────────────────────────────────────────
interface CalEvent {
  day: number;
  title: string;
  type: 'delivery' | 'order' | 'reorder' | 'meeting';
}

const CALENDAR_EVENTS: CalEvent[] = [
  { day: 1, title: 'Medanta delivery', type: 'delivery' },
  { day: 2, title: 'Narayana reorder', type: 'reorder' },
  { day: 4, title: 'Apollo order due', type: 'order' },
  { day: 5, title: 'SRL payment', type: 'meeting' },
  { day: 7, title: 'Max delivery', type: 'delivery' },
  { day: 8, title: 'Cloudnine delivery', type: 'delivery' },
  { day: 10, title: 'City Hospital ord.', type: 'order' },
  { day: 11, title: 'Apollo dispatch', type: 'delivery' },
  { day: 12, title: 'MedPlus delivery', type: 'delivery' },
  { day: 14, title: 'Inventory review', type: 'meeting' },
  { day: 16, title: 'Fortis order', type: 'order' },
  { day: 18, title: 'Reorder – Amoxicillin', type: 'reorder' },
  { day: 20, title: 'KIMS delivery', type: 'delivery' },
  { day: 22, title: 'Monthly audit', type: 'meeting' },
  { day: 25, title: 'Manipal order', type: 'order' },
  { day: 28, title: 'St Johns delivery', type: 'delivery' },
];

// ─── Bar Chart Component ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--panel-bg, rgba(255, 255, 255, 0.85))',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          padding: '10px 14px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            color: 'var(--muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {payload[0].payload.month}
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '15px',
            color: 'var(--text)',
            fontWeight: 700,
          }}
        >
          ₹{payload[0].value}L
        </p>
      </div>
    );
  }
  return null;
};

const BarChart = React.memo(({ data }: { data: ChartDataPoint[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 25, right: 5, left: -20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent, #1D9E75)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--accent, #1D9E75)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: 'var(--muted)',
            fontSize: '11px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
          tickFormatter={(tick: string) => tick.slice(0, 3)}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: 'var(--muted)',
            fontSize: '11px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
          domain={[0, 120]}
          ticks={[0, 25, 50, 100]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Area
          type="linear"
          dataKey="sales"
          fill="url(#areaGradient)"
          stroke="var(--accent, #1D9E75)"
          strokeWidth={1.5}
          strokeOpacity={0.4}
          dot={false}
          activeDot={false}
        />
        <Bar dataKey="sales" barSize={32}>
          {data.map((_, index) => {
            const cellOpacity = 1.0 - (index / data.length) * 0.7;
            return (
              <Cell
                key={`cell-${index}`}
                fill="var(--accent, #1D9E75)"
                opacity={cellOpacity}
              />
            );
          })}
          <LabelList
            dataKey="sales"
            position="top"
            formatter={(val: any) => `₹${val}L`}
            style={{
              fill: 'var(--text)',
              fontSize: '12px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: '600',
            }}
          />
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
});

// ─── Doughnut Chart ────────────────────────────────────────────────────────────
const COLORS = ['var(--accent)', '#378ADD', '#EF9F27', '#D4537E', '#B4B2A9'];

const DoughnutChart = React.memo(({ data }: { data: CategoryData[] }) => (
  <ResponsiveContainer width="100%" height={190}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={70} dataKey="percentage" nameKey="name">
        {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
      </Pie>
      <Tooltip formatter={(value: number) => `${value}%`} />
    </PieChart>
  </ResponsiveContainer>
));

// ─── Metric Card ───────────────────────────────────────────────────────────────
const MetricCard = React.memo(({ metric }: { metric: MetricData }) => {
  const metricClass = `${styles.metric} ${styles[`metric${metric.color.toUpperCase()}`]}`;
  return (
    <div className={metricClass}>
      <div className={styles.metricIcon}>{metric.icon}</div>
      <div className={styles.metricLbl}>{metric.label}</div>
      <div className={styles.metricVal}>{metric.value}</div>
      <div className={styles.metricChg}>
        <span className={metric.isPositive ? styles.up : styles.down}>{metric.isPositive ? '↑' : '↓'}</span>
        <span className={metric.isPositive ? styles.up : styles.down}>
          {metric.isPositive ? '+' : '−'} {Math.abs(metric.change)}% this month
        </span>
      </div>
    </div>
  );
});

// ─── Inventory Item ────────────────────────────────────────────────────────────
const InventoryItemComponent = React.memo(({ item }: { item: InventoryItem }) => {
  const statusColorClass = item.status === 'ok' ? styles.okC : item.status === 'warning' ? styles.warnC : styles.lowC;
  const barColor = item.status === 'ok' ? 'var(--accent)' : item.status === 'warning' ? '#EF9F27' : '#E24B4A';
  return (
    <div className={styles.invItem}>
      <div className={styles.invLeft}>
        <div className={styles.invName}>{item.name}</div>
        <div className={styles.invSub}>{item.category} · {item.batch}</div>
      </div>
      <div className={styles.invRight}>
        <div className={`${styles.invPct} ${statusColorClass}`}>{item.percentage}%</div>
        <div className={styles.pbar}>
          <div className={styles.pfill} style={{ width: `${item.percentage}%`, background: barColor }}></div>
        </div>
      </div>
    </div>
  );
});

// ─── Order Row ─────────────────────────────────────────────────────────────────
const OrderRow = React.memo(({ order }: { order: Order }) => {
  const statusClass = order.status === 'delivered' ? styles.bOk : order.status === 'processing' ? styles.bProc : order.status === 'pending' ? styles.bPend : styles.bCan;
  const statusText = order.status === 'delivered' ? 'Delivered' : order.status === 'processing' ? 'Processing' : order.status === 'pending' ? 'Pending' : 'Cancelled';
  return (
    <tr>
      <td><div className={styles.oName}>{order.customer}</div><div className={styles.oId}>{order.orderNumber}</div></td>
      <td className={styles.oCat}>{order.category}</td>
      <td className={styles.oAmt}>{order.amount}</td>
      <td><span className={`${styles.badge} ${statusClass}`}>{statusText}</span></td>
    </tr>
  );
});

// ─── Search Panel ──────────────────────────────────────────────────────────────
const SearchPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'product' | 'order' | 'customer'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = ALL_SEARCH_DATA.filter(r => {
    const matchType = activeType === 'all' || r.type === activeType;
    const matchQuery = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeType]);

  const handleSelectResult = (r: SearchResult) => {
    onClose();
    if (r.type === 'product') {
      navigate('/inventory');
    } else if (r.type === 'order') {
      navigate('/orders');
    } else if (r.type === 'customer') {
      navigate('/customers');
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered.length > 0 && filtered[selectedIndex]) {
          handleSelectResult(filtered[selectedIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, filtered, selectedIndex]);

  const typeIcon = (type: string) => {
    if (type === 'product') return <Package size={14} />;
    if (type === 'order') return <ShoppingCart size={14} />;
    return <span style={{ fontSize: 13 }}>👤</span>;
  };

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchPanel} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.searchPanelHeader}>
          <div className={styles.searchPanelInput}>
            <Search size={18} className={styles.searchPanelIcon} />
            <input
              ref={inputRef}
              className={styles.searchPanelField}
              placeholder="Search products, orders, customers…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className={styles.searchClear} onClick={() => setQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <button className={styles.searchClose} onClick={onClose}><X size={16} /></button>
        </div>

        {/* Filters */}
        <div className={styles.searchFilters}>
          {(['all', 'product', 'order', 'customer'] as const).map(t => (
            <button
              key={t}
              className={`${styles.searchFilterBtn} ${activeType === t ? styles.searchFilterActive : ''}`}
              onClick={() => setActiveType(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}{t === 'all' ? 's' : 's'}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className={styles.searchResults}>
          {filtered.length === 0 ? (
            <div className={styles.searchEmpty}>
              <Search size={32} style={{ opacity: 0.3 }} />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <>
              {filtered.length > 0 && !query && (
                <div className={styles.searchSectionLabel}>Showing all {filtered.length} results</div>
              )}
              {query && (
                <div className={styles.searchSectionLabel}>{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"</div>
              )}
              {filtered.map((r, i) => (
                <div
                  key={i}
                  className={`${styles.searchResultItem} ${selectedIndex === i ? styles.searchResultActive : ''}`}
                  onClick={() => handleSelectResult(r)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div className={styles.searchResultIcon} style={{ background: r.type === 'product' ? 'rgba(16,185,129,0.12)' : r.type === 'order' ? 'rgba(59,130,246,0.12)' : 'rgba(168,85,247,0.12)' }}>
                    {typeIcon(r.type)}
                  </div>
                  <div className={styles.searchResultBody}>
                    <div className={styles.searchResultTitle}>{r.title}</div>
                    <div className={styles.searchResultSub}>{r.subtitle}</div>
                  </div>
                  <span className={styles.searchResultTag} style={{ color: r.tagColor, background: r.tagColor + '22' }}>{r.tag}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.searchFooter}>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
};

// ─── Notification Panel ────────────────────────────────────────────────────────
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

// ─── Calendar Panel ────────────────────────────────────────────────────────────
const CalendarPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const eventsOnDay = (day: number) => CALENDAR_EVENTS.filter(e => e.day === day);
  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  const handleEventClick = (ev: CalEvent) => {
    onClose();
    if (ev.type === 'reorder' || ev.type === 'delivery') {
      navigate('/inventory');
    } else if (ev.type === 'order') {
      navigate('/orders');
    } else {
      navigate('/settings');
    }
  };

  const eventColor = (type: CalEvent['type']) => {
    if (type === 'delivery') return '#34D399';
    if (type === 'order') return '#60A5FA';
    if (type === 'reorder') return '#FBBF24';
    return '#C084FC';
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const calCells: (number | null)[] = [...Array(firstDayOfWeek).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div ref={panelRef} className={styles.dropPanel} style={{ width: 320 }}>
      <div className={styles.dropPanelHeader}>
        <div className={styles.dropPanelTitle}>Calendar</div>
        <div className={styles.calNav}>
          <button className={styles.calNavBtn} onClick={prevMonth}><ChevronLeft size={14} /></button>
          <span className={styles.calMonthLabel}>{monthName}</span>
          <button className={styles.calNavBtn} onClick={nextMonth}><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className={styles.calGrid}>
        {weekDays.map(d => (
          <div key={d} className={styles.calWeekDay}>{d}</div>
        ))}
        {calCells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const hasEvents = eventsOnDay(day).length > 0;
          const isToday = day === 10 && month === 4 && year === 2026; // 10 May 2026 as "today"
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              className={`${styles.calDay} ${isToday ? styles.calToday : ''} ${isSelected ? styles.calSelected : ''} ${hasEvents ? styles.calHasEvents : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
              {hasEvents && <span className={styles.calEventDot} style={{ background: eventColor(eventsOnDay(day)[0].type) }}></span>}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className={styles.calEvents}>
          <div className={styles.calEventsTitle}>
            {selectedEvents.length === 0
              ? `No events on ${monthName.split(' ')[0]} ${selectedDay}`
              : `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} on ${monthName.split(' ')[0]} ${selectedDay}`}
          </div>
          {selectedEvents.map((ev, i) => (
            <div key={i} className={styles.calEventItem} onClick={() => handleEventClick(ev)}>
              <span className={styles.calEventDotLg} style={{ background: eventColor(ev.type) }}></span>
              <div>
                <div className={styles.calEventName}>{ev.title}</div>
                <div className={styles.calEventType} style={{ color: eventColor(ev.type) }}>{ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.dropPanelFooter}>
        <div className={styles.calLegend}>
          {[{ label: 'Delivery', type: 'delivery' }, { label: 'Order', type: 'order' }, { label: 'Reorder', type: 'reorder' }, { label: 'Meeting', type: 'meeting' }].map(l => (
            <div key={l.label} className={styles.calLegendItem}>
              <span className={styles.calLegendDot} style={{ background: eventColor(l.type as CalEvent['type']) }}></span>
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard Component ──────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [salesData, setSalesData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Hoisted notification state for synchronization
  const [notifs, setNotifs] = useState<Notification[]>(() => getNotifications());

  useEffect(() => {
    saveNotifications(notifs);
  }, [notifs]);

  // Panel states
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showCal, setShowCal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    setMetrics(getMetrics());
    setSalesData(getSalesChartData());
    setCategoryData(getCategoryData());
    setInventory(getInventoryAlerts());

    getOrdersApi()
      .then((data) => {
        const recentOrdersMapped = data.slice(0, 6).map(o => ({
          ...o,
          orderNumber: o.orderNumber.startsWith('#') ? o.orderNumber : `#${o.orderNumber}`,
          customer: o.customer.includes(o.city) ? o.customer : `${o.customer}, ${o.city}`
        }));
        setOrders(recentOrdersMapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load recent orders on dashboard', err);
        setOrders(getRecentOrders());
        setLoading(false);
      });
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading dashboard…</div>
      </div>
    );
  }

  const criticalCount = inventory.filter((i) => i.status === 'critical').length;

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Search overlay */}
      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}

      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Dashboard</div>
            <div className={styles.topbarDate}>Sunday, 10 May 2026 · Welcome back, Pravin 👋</div>
          </div>

          <div className={styles.topbarRight}>
            {/* Search trigger */}
            <div
              className={styles.search}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSearch(true)}
              role="button"
              aria-label="Search products, orders…"
            >
              <Search size={14} />
              <span>Search products, orders…</span>
              <span className={styles.searchKbd}>⌘K</span>
            </div>

            {/* Notification button */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className={`${styles.tbtn} ${showNotif ? styles.tbtnActive : ''}`}
                onClick={() => { setShowNotif(p => !p); setShowCal(false); }}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && <span className={styles.notifDot}></span>}
              </button>
              {showNotif && <div className={styles.dropPanelWrap}><NotificationPanel notifs={notifs} setNotifs={setNotifs} onClose={() => setShowNotif(false)} /></div>}
            </div>

            {/* Calendar button */}
            <div ref={calRef} style={{ position: 'relative' }}>
              <button
                className={`${styles.tbtn} ${showCal ? styles.tbtnActive : ''}`}
                onClick={() => { setShowCal(p => !p); setShowNotif(false); }}
                aria-label="Calendar"
              >
                <Calendar size={16} />
              </button>
              {showCal && <div className={styles.dropPanelWrap}><CalendarPanel onClose={() => setShowCal(false)} /></div>}
            </div>

            <div className={styles.topbarAv}>PR</div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          {/* Metrics */}
          <div className={styles.metrics}>
            {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
          </div>

          {/* Charts Row */}
          <div className={styles.chartsRow}>
            <div className={`${styles.glassCard} ${styles.cardPad}`}>
              <div className={styles.cardAccent}></div>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Monthly Sales Trend</span>
                <span className={styles.cardPill}>Jan – Oct 2026</span>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '230px' }}>
                <BarChart data={salesData} />
              </div>
            </div>

            <div className={`${styles.glassCard} ${styles.cardPad}`}>
              <div className={styles.cardAccent}></div>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Sales by Category</span>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '190px' }}>
                <DoughnutChart data={categoryData} />
              </div>
              <div className={styles.legend}>
                {categoryData.map((cat, index) => (
                  <div key={cat.category} className={styles.legItem}>
                    <span className={styles.legDot} style={{ background: ['var(--accent)', '#378ADD', '#EF9F27', '#D4537E', '#B4B2A9'][index] }}></span>
                    {cat.category} {cat.percentage}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={styles.bottom}>
            <div className={`${styles.glassCard} ${styles.cardPad}`}>
              <div className={styles.cardAccent}></div>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Inventory Alerts</span>
                <span style={{ fontSize: '12px', color: 'var(--status-low-text, #A32D2D)', fontWeight: '700', background: 'var(--red-pale)', padding: '3px 10px', borderRadius: '20px' }}>
                  {criticalCount} Critical
                </span>
              </div>
              {inventory.map((item) => <InventoryItemComponent key={item.id} item={item} />)}
            </div>

            <div className={`${styles.glassCard} ${styles.cardPad}`}>
              <div className={styles.cardAccent}></div>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>Recent Orders</span>
                <button className={styles.secLink} onClick={() => navigate('/orders')}>View all →</button>
              </div>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => <OrderRow key={order.id} order={order} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
