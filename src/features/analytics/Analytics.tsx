import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie,
} from 'recharts';
import { RefreshCw, Plus, Calendar, TrendingUp, TrendingDown, Maximize2, Activity, ShoppingCart, DollarSign, Users, RotateCcw, Package } from 'lucide-react';
import India from '@react-map/india';
import styles from './Analytics.module.css';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 4820000, orders: 1240 },
  { month: 'Feb', revenue: 5340000, orders: 1380 },
  { month: 'Mar', revenue: 4980000, orders: 1210 },
  { month: 'Apr', revenue: 6120000, orders: 1590 },
  { month: 'May', revenue: 5750000, orders: 1450 },
  { month: 'Jun', revenue: 6890000, orders: 1720 },
  { month: 'Jul', revenue: 7240000, orders: 1860 },
  { month: 'Aug', revenue: 6980000, orders: 1780 },
  { month: 'Sep', revenue: 7650000, orders: 1940 },
  { month: 'Oct', revenue: 8120000, orders: 2050 },
  { month: 'Nov', revenue: 8940000, orders: 2280 },
  { month: 'Dec', revenue: 9620000, orders: 2460 },
];

const DAILY_ORDERS_REVENUE = [
  { day: 'May 26', orders: 78,  revenue: 312000 },
  { day: 'May 27', orders: 92,  revenue: 368000 },
  { day: 'May 28', orders: 65,  revenue: 260000 },
  { day: 'May 29', orders: 108, revenue: 432000 },
  { day: 'May 30', orders: 84,  revenue: 336000 },
  { day: 'May 31', orders: 121, revenue: 484000 },
  { day: 'Jun 01',  orders: 96,  revenue: 384000 },
  { day: 'Jun 02',  orders: 143, revenue: 572000 },
  { day: 'Jun 03',  orders: 119, revenue: 476000 },
  { day: 'Jun 04',  orders: 138, revenue: 552000 },
];

const CATEGORY_BREAKDOWN = [
  { name: 'Antibiotics',  value: 31.2, color: 'var(--accent)' },
  { name: 'Analgesics',   value: 22.8, color: '#378ADD' },
  { name: 'Vitamins',     value: 18.5, color: '#EF9F27' },
  { name: 'Cardiology',   value: 14.3, color: '#D4537E' },
  { name: 'Diabetes',     value: 8.6,  color: '#9B59B6' },
  { name: 'Supplements',  value: 4.6,  color: '#E74C3C' },
];

const TRAFFIC = [
  { label: 'Google Search', value: 49215, pct: 98, color: 'var(--accent)' },
  { label: 'Social Media',  value: 28400, pct: 57, color: '#EF9F27' },
  { label: 'Direct',        value: 22789, pct: 46, color: '#378ADD' },
  { label: 'Referral',      value: 11400, pct: 23, color: '#D4537E' },
];

const TEAM = [
  { rank: 1, name: 'Metro Pharma',      role: 'Top Account',  amount: '₹16,80,000', initials: 'MP', avatarVariant: 0 },
  { rank: 2, name: 'Medanta',           role: 'Key Partner',  amount: '₹15,60,000', initials: 'ME', avatarVariant: 1 },
  { rank: 3, name: 'Max Healthcare',    role: 'Hospital',     amount: '₹14,90,000', initials: 'MH', avatarVariant: 2 },
  { rank: 4, name: 'City Hospital',     role: 'Top Account',  amount: '₹12,40,000', initials: 'CH', avatarVariant: 3 },
  { rank: 5, name: 'Narayana Health',   role: 'Key Partner',  amount: '₹13,40,000', initials: 'NH', avatarVariant: 0 },
];

const LOCATIONS = [
  { id: 'MH', name: 'Maharashtra', value: 34432, color: 'var(--accent)' },
  { id: 'TN', name: 'Tamil Nadu',  value: 22215, color: '#378ADD' },
  { id: 'KA', name: 'Karnataka',   value: 15457, color: '#EF9F27' },
  { id: 'DL', name: 'Delhi',       value: 11589, color: '#D4537E' },
  { id: 'OT', name: 'Others',      value: 7240,  color: '#B4B2A9' },
];

const cityColors: Record<string, string> = {
  Maharashtra: 'var(--accent)',
  'Tamil Nadu': '#378ADD',
  Karnataka: '#EF9F27',
  Delhi: '#D4537E',
};


// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const RevenueTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.ttLabel}>{label}</div>
        <div className={styles.ttRow}>
          <span className={styles.ttDot} style={{ background: 'var(--accent)' }} />
          <span>Revenue: <strong>₹{(payload[0].value / 100000).toFixed(1)}L</strong></span>
        </div>
        {payload[1] && (
          <div className={styles.ttRow}>
            <span className={styles.ttDot} style={{ background: '#378ADD' }} />
            <span>Orders: <strong>{payload[1].value.toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const DailyTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey?: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.ttLabel}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} className={styles.ttRow}>
            <span className={styles.ttDot} style={{ background: p.dataKey === 'revenue' ? 'var(--accent)' : '#378ADD' }} />
            <span>{p.dataKey === 'revenue' ? `Revenue: ₹${(p.value / 1000).toFixed(0)}K` : `Orders: ${p.value}`}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DonutTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.ttRow}>
          <span className={styles.ttDot} style={{ background: payload[0].payload.color }} />
          <span>{payload[0].name}: <strong>{payload[0].value}%</strong></span>
        </div>
      </div>
    );
  }
  return null;
};

// ─── Inline sparkline using SVG ───────────────────────────────────────────────
const SparkLine: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 120, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h * 0.8 - h * 0.05;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(' L ')}`;
  const fillD = `M ${pts[0]} L ${pts.join(' L ')} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%', marginTop: 8 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r={3} fill={color} />
    </svg>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SESSIONS_MONTHLY = [240, 260, 230, 280, 250, 270, 290, 280, 310, 320, 340, 360];
const CUSTOMERS_MONTHLY = [105, 110, 108, 115, 112, 118, 121, 120, 124, 126, 128, 131];
const RETURNS_MONTHLY = [3.8, 3.5, 3.2, 3.6, 3.1, 2.9, 3.0, 2.7, 2.8, 2.6, 2.5, 2.4];

const AnalyticsPage: React.FC = () => {
  const [trafficTab, setTrafficTab] = useState<'month' | 'week'>('week');
  const [selectedState, setSelectedState] = useState<string | null>('Maharashtra');
  const [revenueRange, setRevenueRange] = useState<'6m' | '12m'>('12m');

  // Date Picker States
  const [startMonth, setStartMonth] = useState<number>(0); // Jan
  const [endMonth, setEndMonth] = useState<number>(5);     // Jun
  const [tempStartMonth, setTempStartMonth] = useState<number>(0);
  const [tempEndMonth, setTempEndMonth] = useState<number>(5);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('H1');

  // Refresh States
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataMultipliers, setDataMultipliers] = useState<number[]>(() => Array(12).fill(1));

  // Create Campaign Modal States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>('');
  const [targetCategory, setTargetCategory] = useState<string>('Antibiotics');
  const [campaignBudget, setCampaignBudget] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Google Ads']);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCampaignSuccess, setIsCampaignSuccess] = useState<boolean>(false);
  const [createdCampaignSummary, setCreatedCampaignSummary] = useState<any>(null);

  const applyPreset = (preset: string) => {
    let start = 0;
    let end = 11;
    switch (preset) {
      case 'Q1': start = 0; end = 2; break;
      case 'Q2': start = 3; end = 5; break;
      case 'Q3': start = 6; end = 8; break;
      case 'Q4': start = 9; end = 11; break;
      case 'H1': start = 0; end = 5; break;
      case 'H2': start = 6; end = 11; break;
      case 'Full Year': start = 0; end = 11; break;
      default: break;
    }
    setStartMonth(start);
    setEndMonth(end);
    setTempStartMonth(start);
    setTempEndMonth(end);
    setSelectedPreset(preset);
    setShowDatePicker(false);

    // Sync revenueRange tab highlighting
    const length = end - start + 1;
    if (length === 6 && start === 0) setRevenueRange('6m');
    else if (length === 12) setRevenueRange('12m');
    else setRevenueRange('' as any);
  };

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      const newMults = Array.from({ length: 12 }, () => 0.95 + Math.random() * 0.1);
      setDataMultipliers(newMults);
      setIsRefreshing(false);
    }, 800);
  };

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!campaignName.trim()) {
      errors.name = 'Campaign name is required';
    }
    if (!campaignBudget.trim()) {
      errors.budget = 'Budget is required';
    } else {
      const budgetNum = parseFloat(campaignBudget);
      if (isNaN(budgetNum) || budgetNum <= 0) {
        errors.budget = 'Budget must be a positive number';
      }
    }
    if (selectedChannels.length === 0) {
      errors.channels = 'Select at least one channel';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCreatedCampaignSummary({
      name: campaignName,
      category: targetCategory,
      budget: campaignBudget,
      channels: selectedChannels,
    });
    setIsCampaignSuccess(true);
  };

  // Dynamic KPI and dataset filtering based on date range
  // Dynamic KPI and dataset filtering based on date range
  const {
    revenueData,
    totalRevenue,
    dynamicKpis,
  } = useMemo(() => {
    const rawFilteredData = MONTHLY_REVENUE.slice(startMonth, endMonth + 1);
    const revData = rawFilteredData.map((d, index) => {
      const monthIdx = startMonth + index;
      const mult = dataMultipliers[monthIdx] || 1;
      return {
        ...d,
        revenue: Math.round(d.revenue * mult),
        orders: Math.round(d.orders * mult),
      };
    });

    const totRev = revData.reduce((sum, d) => sum + d.revenue, 0);
    const totOrd = revData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrdVal = totOrd > 0 ? Math.round(totRev / totOrd) : 0;

    const sessData = SESSIONS_MONTHLY.slice(startMonth, endMonth + 1).map((val, idx) => Math.round(val * 10 * (dataMultipliers[startMonth + idx] || 1)));
    const custData = CUSTOMERS_MONTHLY.slice(startMonth, endMonth + 1).map((val, idx) => Math.round(val * 10 * (dataMultipliers[startMonth + idx] || 1)));
    const retData = RETURNS_MONTHLY.slice(startMonth, endMonth + 1).map((val, idx) => val * (dataMultipliers[startMonth + idx] || 1));

    const totSess = sessData.reduce((sum, v) => sum + v, 0);
    const actCust = custData[custData.length - 1] || 0;
    const avgRetRate = parseFloat((retData.reduce((sum, v) => sum + v, 0) / (retData.length || 1)).toFixed(1));

    const revenueSpark = revData.map(d => d.revenue / 100000); // Sparkline values in Lakhs
    const ordersSpark = revData.map(d => d.orders);
    const sessionsSpark = sessData;
    const customersSpark = custData;
    const aovSpark = revData.map(d => d.orders > 0 ? Math.round(d.revenue / d.orders) : 0);
    const returnsSpark = retData;

    const kpis = [
      {
        title: 'Total Revenue',
        value: totRev >= 10000000 
          ? `₹${(totRev / 10000000).toFixed(2)} Cr` 
          : `₹${(totRev / 100000).toFixed(1)}L`,
        change: '+18.4%',
        positive: true,
        icon: DollarSign,
        color: 'var(--accent)',
        spark: revenueSpark,
      },
      {
        title: 'Total Orders',
        value: totOrd.toLocaleString(),
        change: '+22.1%',
        positive: true,
        icon: ShoppingCart,
        color: '#378ADD',
        spark: ordersSpark,
      },
      {
        title: 'Online Sessions',
        value: totSess.toLocaleString(),
        change: '+20.8%',
        positive: true,
        icon: Activity,
        color: '#EF9F27',
        spark: sessionsSpark,
      },
      {
        title: 'Active Customers',
        value: actCust.toLocaleString(),
        change: '+9.7%',
        positive: true,
        icon: Users,
        color: '#9B59B6',
        spark: customersSpark,
      },
      {
        title: 'Avg Order Value',
        value: `₹${avgOrdVal.toLocaleString()}`,
        change: '+3.2%',
        positive: true,
        icon: Package,
        color: '#D4537E',
        spark: aovSpark,
      },
      {
        title: 'Return Rate',
        value: `${avgRetRate}%`,
        change: '-0.8%',
        positive: false,
        icon: RotateCcw,
        color: '#E74C3C',
        spark: returnsSpark,
      },
    ];

    return {
      revenueData: revData,
      totalRevenue: totRev,
      totalOrders: totOrd,
      avgOrderValue: avgOrdVal,
      sessionsData: sessData,
      customersData: custData,
      returnsData: retData,
      totalSessions: totSess,
      activeCustomers: actCust,
      averageReturnRate: avgRetRate,
      dynamicKpis: kpis,
    };
  }, [startMonth, endMonth, dataMultipliers]);

  // Apply fluctuations to daily order list when refreshed
  const dailyMult = dataMultipliers[endMonth] || 1;

  const dailyOrdersData = useMemo(() => {
    return DAILY_ORDERS_REVENUE.map(d => ({
      ...d,
      orders: Math.round(d.orders * dailyMult),
      revenue: Math.round(d.revenue * dailyMult),
    }));
  }, [dailyMult]);

  // Traffic fluctuations
  const trafficData = useMemo(() => {
    return trafficTab === 'week'
      ? TRAFFIC.map(t => ({ ...t, value: Math.round(t.value * dailyMult), pct: Math.min(100, Math.round(t.pct * (0.95 + dailyMult * 0.05))) }))
      : TRAFFIC.map(t => ({ ...t, value: Math.round(t.value * 4.2 * dailyMult), pct: Math.min(100, Math.round(t.pct * 1.15 * (0.95 + dailyMult * 0.05))) }));
  }, [trafficTab, dailyMult]);

  // Locations data fluctuation
  const { locationData, activeLocation, pctOfTotal } = useMemo(() => {
    const locData = LOCATIONS.map(l => ({
      ...l,
      value: Math.round(l.value * dailyMult),
    }));
    const activeLoc = locData.find(
      (l) => l.name.toLowerCase() === (selectedState || '').toLowerCase()
    );
    const totSales = locData.reduce((sum, l) => sum + l.value, 0);
    const pct = activeLoc ? Math.round((activeLoc.value / totSales) * 100) : 0;

    return {
      locationData: locData,
      activeLocation: activeLoc,
      totalSalesVal: totSales,
      pctOfTotal: pct,
    };
  }, [selectedState, dailyMult]);

  // Leaderboard team fluctuations
  const teamData = useMemo(() => {
    return TEAM.map(member => {
      const rawVal = parseInt(member.amount.replace(/[^\d]/g, ''));
      const adjustedVal = Math.round(rawVal * dailyMult);
      return {
        ...member,
        amount: `₹${adjustedVal.toLocaleString('en-IN')}`,
        rawAmount: adjustedVal,
      };
    });
  }, [dailyMult]);

  return (
    <div className={styles.shell} style={{ position: 'relative' }}>
      <div className={`${styles.mainWrap} ${isRefreshing ? styles.blurContent : ''}`}>
        <main className={styles.content}>

          {/* ── Page Header ── */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Analytics</h1>
              <p className={styles.pageSub}>
                MyPharma performance overview · {MONTH_NAMES[startMonth]} 2026 – {MONTH_NAMES[endMonth]} 2026
              </p>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.datePillContainer}>
                <div 
                  className={`${styles.datepill} ${showDatePicker ? styles.datepillActive : ''}`}
                  onClick={() => {
                    setTempStartMonth(startMonth);
                    setTempEndMonth(endMonth);
                    setShowDatePicker(!showDatePicker);
                  }}
                >
                  <Calendar size={14} />
                  {MONTH_NAMES[startMonth]} 2026 – {MONTH_NAMES[endMonth]} 2026
                </div>

                {showDatePicker && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 400 }} onClick={() => setShowDatePicker(false)} />
                    <div className={styles.dateDropdown} style={{ zIndex: 500 }}>
                      <div>
                        <span className={styles.dropdownSectionTitle}>Presets</span>
                        <div className={styles.presetGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                          {['Q1', 'Q2', 'Q3', 'Q4'].map((p) => (
                            <button 
                              key={p} 
                              className={`${styles.presetBtn} ${selectedPreset === p ? styles.presetBtnActive : ''}`}
                              onClick={() => applyPreset(p)}
                            >
                              {p}
                            </button>
                          ))}
                          {['H1', 'H2', 'Full Year'].map((p) => (
                            <button 
                              key={p} 
                              className={`${styles.presetBtn} ${selectedPreset === p ? styles.presetBtnActive : ''}`}
                              style={{ gridColumn: p === 'Full Year' ? 'span 2' : 'span 1' }}
                              onClick={() => applyPreset(p)}
                            >
                              {p === 'Full Year' ? 'Full Year' : p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border, #E8F0EC)', paddingTop: 10 }}>
                        <span className={styles.dropdownSectionTitle}>Custom Range</span>
                        <div className={styles.customSelects}>
                          <div className={styles.selectGroup}>
                            <label>From</label>
                            <select 
                              value={tempStartMonth} 
                              onChange={(e) => {
                                setTempStartMonth(parseInt(e.target.value));
                                setSelectedPreset('custom');
                              }}
                            >
                              {MONTH_NAMES.map((m, idx) => (
                                <option key={m} value={idx}>{m}</option>
                              ))}
                            </select>
                          </div>
                          <div className={styles.selectGroup}>
                            <label>To</label>
                            <select 
                              value={tempEndMonth} 
                              onChange={(e) => {
                                setTempEndMonth(parseInt(e.target.value));
                                setSelectedPreset('custom');
                              }}
                            >
                              {MONTH_NAMES.map((m, idx) => (
                                <option key={m} value={idx} disabled={idx < tempStartMonth}>{m}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <button 
                        className={styles.applyBtn}
                        disabled={tempStartMonth > tempEndMonth}
                        onClick={() => {
                          setStartMonth(tempStartMonth);
                          setEndMonth(tempEndMonth);
                          setShowDatePicker(false);
                          // Sync revenueRange
                          const length = tempEndMonth - tempStartMonth + 1;
                          if (length === 6 && tempStartMonth === 0) setRevenueRange('6m');
                          else if (length === 12) setRevenueRange('12m');
                          else setRevenueRange('' as any);
                        }}
                      >
                        Apply Range
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button className={styles.refreshBtn} onClick={handleRefresh}>
                <RefreshCw size={13} className={isRefreshing ? styles.spinAnimation : ''} /> 
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                <Plus size={14} /> Create Campaign
              </button>
            </div>
          </div>

          {/* ── Row 1: 6 KPI Cards ── */}
          <div className={styles.kpiGrid}>
            {dynamicKpis.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} className={styles.kpiCard}>
                  <div className={styles.kpiTop}>
                    <div className={styles.kpiIconWrap} style={{ background: card.color + '18' }}>
                      <Icon size={16} color={card.color} />
                    </div>
                    <span className={`${styles.kpiChange} ${card.positive ? styles.kpiPos : styles.kpiNeg}`}>
                      {card.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {card.change}
                    </span>
                  </div>
                  <div className={styles.kpiValue}>{card.value}</div>
                  <div className={styles.kpiTitle}>{card.title}</div>
                  <SparkLine data={card.spark} color={card.color} />
                </div>
              );
            })}
          </div>

          {/* ── Row 2: Revenue Trend + Donut ── */}
          <div className={styles.rowWide}>

            {/* Monthly Revenue Trend */}
            <div className={styles.card}>
              <div className={styles.cardHd}>
                <div>
                  <div className={styles.cardTitleDark}>Monthly Revenue Trend</div>
                  <div className={styles.cardSub}>
                    {MONTH_NAMES[startMonth]} 2026 – {MONTH_NAMES[endMonth]} 2026 trend
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <div className={styles.rangeTabs}>
                    <button 
                      className={`${styles.rangeTab} ${revenueRange === '6m' ? styles.rangeTabOn : ''}`} 
                      onClick={() => applyPreset('H1')}
                    >
                      6M
                    </button>
                    <button 
                      className={`${styles.rangeTab} ${revenueRange === '12m' ? styles.rangeTabOn : ''}`} 
                      onClick={() => applyPreset('Full Year')}
                    >
                      12M
                    </button>
                  </div>
                  <button className={styles.expandBtn}><Maximize2 size={12} /></button>
                </div>
              </div>
              <div className={styles.revSummary}>
                <div>
                  <div className={styles.revTotal}>
                    {totalRevenue >= 10000000 
                      ? `₹${(totalRevenue / 10000000).toFixed(2)} Cr` 
                      : `₹${(totalRevenue / 100000).toFixed(1)}L`}
                  </div>
                  <div className={styles.revLabel}>
                    Total {MONTH_NAMES[startMonth]} – {MONTH_NAMES[endMonth]} 2026 Revenue
                  </div>
                </div>
                <div className={styles.revBadge}>
                  <TrendingUp size={12} /> +18.4% YoY
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#378ADD" stopOpacity={0.14} />
                      <stop offset="95%" stopColor="#378ADD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F5F3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8C0B8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="rev"
                    orientation="left"
                    tick={{ fontSize: 10, fill: '#A8C0B8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    width={52}
                  />
                  <YAxis
                    yAxisId="ord"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#A8C0B8' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    yAxisId="rev"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    fill="url(#revGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: 'var(--accent)', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    yAxisId="ord"
                    type="monotone"
                    dataKey="orders"
                    stroke="#378ADD"
                    strokeWidth={2}
                    fill="url(#ordGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#378ADD', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className={styles.chartLegend}>
                <span className={styles.legItem}><span className={styles.legDot} style={{ background: 'var(--accent)' }} />Revenue</span>
                <span className={styles.legItem}><span className={styles.legDot} style={{ background: '#378ADD' }} />Orders</span>
              </div>
            </div>

            {/* Category Donut */}
            <div className={styles.card}>
              <div className={styles.cardHd}>
                <div>
                  <div className={styles.cardTitleDark}>Product Category</div>
                  <div className={styles.cardSub}>Revenue share by category</div>
                </div>
                <span className={styles.seeLink}>Details →</span>
              </div>
              <div className={styles.donutSection}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={CATEGORY_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {CATEGORY_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutCenter}>
                  <div className={styles.donutCenterVal}>100%</div>
                  <div className={styles.donutCenterLbl}>Revenue</div>
                </div>
              </div>
              <div className={styles.catLegend}>
                {CATEGORY_BREAKDOWN.map(cat => (
                  <div key={cat.name} className={styles.catLegRow}>
                    <span className={styles.catDot} style={{ background: cat.color }} />
                    <span className={styles.catName}>{cat.name}</span>
                    <span className={styles.catPct}>{cat.value}%</span>
                    <div className={styles.catBar}>
                      <div className={styles.catBarFill} style={{ width: `${cat.value * 3}%`, background: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 3: Daily Orders vs Revenue + Traffic + Buyers ── */}
          <div className={styles.rowMid}>

            {/* Daily Orders vs Revenue Composed Chart */}
            <div className={styles.card}>
              <div className={styles.cardHd}>
                <div>
                  <div className={styles.cardTitleDark}>Daily Orders vs Revenue</div>
                  <div className={styles.cardSub}>Last 10 days</div>
                </div>
                <button className={styles.expandBtn}><Maximize2 size={12} /></button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={dailyOrdersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F5F3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#A8C0B8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="rev"
                    orientation="left"
                    tick={{ fontSize: 10, fill: '#A8C0B8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}K`}
                    width={48}
                  />
                  <YAxis
                    yAxisId="ord"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#A8C0B8' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<DailyTooltip />} />
                  <Bar yAxisId="rev" dataKey="revenue" fill="var(--accent)" fillOpacity={0.85} radius={[4, 4, 0, 0]} barSize={22} />
                  <Line
                    yAxisId="ord"
                    type="monotone"
                    dataKey="orders"
                    stroke="#378ADD"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#378ADD', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className={styles.chartLegend}>
                <span className={styles.legItem}><span className={styles.legDot} style={{ background: 'var(--accent)' }} />Revenue</span>
                <span className={styles.legItem}><span className={styles.legDot} style={{ background: '#378ADD' }} />Orders</span>
              </div>
            </div>

            {/* Traffic Source */}
            <div className={styles.card}>
              <div className={styles.cardHd}>
                <div className={styles.cardTitleDark}>Traffic Source</div>
                <div className={styles.tsTabs}>
                  <button className={`${styles.tsTab} ${trafficTab === 'month' ? styles.tsTabOn : ''}`} onClick={() => setTrafficTab('month')}>Month</button>
                  <button className={`${styles.tsTab} ${trafficTab === 'week'  ? styles.tsTabOn : ''}`} onClick={() => setTrafficTab('week')}>Week</button>
                </div>
              </div>
              <div className={styles.tsRows}>
                {trafficData.map(t => (
                  <div key={t.label} className={styles.tsRow}>
                    <div className={styles.tsTop}>
                      <span className={styles.tsLabel}>{t.label}</span>
                      <span className={styles.tsNum}>{t.value.toLocaleString()}</span>
                    </div>
                    <div className={styles.tsBar}>
                      <div className={styles.tsFill} style={{ width: `${t.pct}%`, background: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.trafficTotal}>
                <span>Total Sessions</span>
                <strong>{trafficData.reduce((a, t) => a + t.value, 0).toLocaleString()}</strong>
              </div>
            </div>

            {/* Buyers Profile */}
            <div className={styles.card}>
              <div className={styles.cardHd}>
                <div className={styles.cardTitleDark}>Buyers Profile</div>
                <span className={styles.seeLink}>Details →</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Male',   value: 50.8, color: 'var(--accent)' },
                      { name: 'Female', value: 35.7, color: '#EF9F27' },
                      { name: 'Others', value: 13.5, color: '#378ADD' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {[{ color: 'var(--accent)' }, { color: '#EF9F27' }, { color: '#378ADD' }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.buyersLegend}>
                {[
                  { label: 'Male',   pct: '50.8%', color: 'var(--accent)' },
                  { label: 'Female', pct: '35.7%', color: '#EF9F27' },
                  { label: 'Others', pct: '13.5%', color: '#378ADD' },
                ].map(l => (
                  <div key={l.label} className={styles.legItem2}>
                    <span className={styles.legDot2} style={{ background: l.color }} />
                    <span className={styles.legLabel2}>{l.label}</span>
                    <span className={styles.legPct2}>{l.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 4: India Map + Team Leaderboard ── */}
          <div className={styles.rowBot}>

            {/* Sales by Location */}
            <div className={`${styles.card} ${styles.locCard}`}>
              <div className={styles.locLeft}>
                <div className={styles.cardHd}>
                  <div className={styles.cardTitleDark}>Sales Locations</div>
                  <button className={styles.expandBtn}><Maximize2 size={12} /></button>
                </div>
                <div className={styles.locValRow}>
                  <span className={styles.locVal}>{(76345 * dailyMult).toFixed(0)}</span>
                  <span className={styles.locBadge}><TrendingUp size={10} /> 12.0%</span>
                </div>
                <div className={styles.locSub}>Compared to last month</div>
                <div className={styles.locList}>
                  {locationData.map(l => (
                    <div key={l.name} className={styles.locRow}>
                      <span className={styles.locDot} style={{ background: l.color }} />
                      <span className={styles.locName}>{l.name}</span>
                      <div className={styles.locBarWrap}>
                        <div className={styles.locBarFill} style={{ width: `${(l.value / (34432 * dailyMult)) * 100}%`, background: l.color + 'aa' }} />
                      </div>
                      <span className={styles.locNum}>{l.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {/* State Detail Panel */}
                <div className={styles.stateDetailBox}>
                  <div className={styles.stateDetailHeader}>
                    <span className={styles.stateDetailTitle}>
                      {activeLocation ? activeLocation.name : 'Select a State'}
                    </span>
                    <span className={styles.stateDetailPill} style={{ background: activeLocation?.color || '#cbd5e1', color: '#fff' }}>
                      {activeLocation ? `${pctOfTotal}% share` : 'Overview'}
                    </span>
                  </div>
                  <div className={styles.stateDetailValue}>
                    {activeLocation
                      ? `₹${activeLocation.value.toLocaleString()}L`
                      : `₹${locationData.reduce((sum, l) => sum + l.value, 0).toLocaleString()}L`}
                  </div>
                  <p className={styles.stateDetailSub}>
                    {activeLocation
                      ? `Active accounts contributing to MyPharma revenue in ${activeLocation.name}.`
                      : 'Total sales across all tracked state locations this period.'}
                  </p>
                </div>
              </div>

              <div className={styles.mapSide}>
                <div className={styles.mapWrapper}>
                  <India
                    type="select-single"
                    size={360}
                    mapColor="#F1F5F3"
                    strokeColor="#cbd5e1"
                    strokeWidth={0.8}
                    hoverColor="#bae8d8"
                    selectColor="var(--accent)"
                    cityColors={cityColors}
                    hints={true}
                    hintTextColor="#ffffff"
                    hintBackgroundColor="#0A2318"
                    hintPadding="6px 10px"
                    hintBorderRadius={6}
                    onSelect={(stateCode) => setSelectedState(stateCode)}
                  />
                  <div className={styles.mapHint}>
                    💡 Click a highlighted state to view localized analytics
                  </div>
                </div>
              </div>
            </div>

            {/* Top Accounts Leaderboard */}
            <div className={styles.card}>
              <div className={styles.cardHd}>
                <div>
                  <div className={styles.cardTitleDark}>Top Accounts</div>
                  <div className={styles.cardSub}>By revenue · {MONTH_NAMES[startMonth]} – {MONTH_NAMES[endMonth]} 2026</div>
                </div>
                <span className={styles.seeLink}>See all →</span>
              </div>
              <div className={styles.teamList}>
                {teamData.map(member => (
                  <div key={member.rank} className={styles.teamRow}>
                    <span className={`${styles.teamRank} ${member.rank === 1 ? styles.rankGold : member.rank === 2 ? styles.rankSilver : member.rank === 3 ? styles.rankBronze : ''}`}>
                      {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : member.rank}
                    </span>
                    <div className={`${styles.teamAv} ${styles[`av${member.avatarVariant}`]}`}>
                      {member.initials}
                    </div>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamName}>{member.name}</div>
                      <div className={styles.teamRole}>{member.role}</div>
                    </div>
                    <div className={styles.teamAmtCol}>
                      <div className={styles.teamAmt}>{member.amount}</div>
                      <div className={styles.teamAmtBar}>
                        <div
                          className={styles.teamAmtFill}
                          style={{
                            width: `${(member.rawAmount / (1680000 * dailyMult)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>

      {isRefreshing && (
        <div className={styles.refreshOverlay}>
          <div className={styles.spinner} />
        </div>
      )}

      {/* Campaign Creation Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isCampaignSuccess ? 'Campaign Created' : 'Create New Campaign'}
              </h3>
              <button 
                className={styles.closeBtn} 
                onClick={() => {
                  setShowCreateModal(false);
                  setIsCampaignSuccess(false);
                  setCampaignName('');
                  setCampaignBudget('');
                  setSelectedChannels(['Google Ads']);
                  setFormErrors({});
                }}
              >
                <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            {isCampaignSuccess ? (
              <div className={styles.successState}>
                <div className={styles.successIconWrap}>
                  <TrendingUp size={24} />
                </div>
                <h4 className={styles.successTitle}>Successfully Created!</h4>
                <p className={styles.successSub}>
                  Your marketing campaign is now active and tracking performance metrics.
                </p>
                <div className={styles.campaignSummaryCard}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Campaign Name</span>
                    <span className={styles.summaryValue}>{createdCampaignSummary.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Target Category</span>
                    <span className={styles.summaryValue}>{createdCampaignSummary.category}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Allocated Budget</span>
                    <span className={styles.summaryValue}>₹{parseInt(createdCampaignSummary.budget).toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Active Channels</span>
                    <span className={styles.summaryValue}>
                      {createdCampaignSummary.channels.join(', ')}
                    </span>
                  </div>
                </div>
                <button 
                  className={styles.submitBtn} 
                  onClick={() => {
                    setShowCreateModal(false);
                    setIsCampaignSuccess(false);
                    setCampaignName('');
                    setCampaignBudget('');
                    setSelectedChannels(['Google Ads']);
                    setFormErrors({});
                  }}
                  style={{ width: '100%' }}
                >
                  Back to Analytics
                </button>
              </div>
            ) : (
              <form onSubmit={handleCampaignSubmit}>
                <div className={styles.modalBody}>
                  <div className={styles.formGroup}>
                    <label htmlFor="campaignName">Campaign Name</label>
                    <input 
                      type="text" 
                      id="campaignName"
                      placeholder="e.g. Q3 Antibiotics Promotion"
                      value={campaignName}
                      onChange={(e) => {
                        setCampaignName(e.target.value);
                        if (formErrors.name) {
                          setFormErrors(prev => {
                            const copy = { ...prev };
                            delete copy.name;
                            return copy;
                          });
                        }
                      }}
                      className={styles.inputField}
                    />
                    {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="targetCategory">Target Category</label>
                    <select 
                      id="targetCategory"
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      className={styles.selectField}
                    >
                      {CATEGORY_BREAKDOWN.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="campaignBudget">Budget (₹)</label>
                    <input 
                      type="number" 
                      id="campaignBudget"
                      placeholder="e.g. 50000"
                      value={campaignBudget}
                      onChange={(e) => {
                        setCampaignBudget(e.target.value);
                        if (formErrors.budget) {
                          setFormErrors(prev => {
                            const copy = { ...prev };
                            delete copy.budget;
                            return copy;
                          });
                        }
                      }}
                      className={styles.inputField}
                    />
                    {formErrors.budget && <span className={styles.errorText}>{formErrors.budget}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <span className={styles.channelLabel}>Marketing Channels</span>
                    <div className={styles.channelGrid}>
                      {['Google Ads', 'Email Newsletter', 'Social Media', 'Partner Networks'].map(channel => {
                        const isActive = selectedChannels.includes(channel);
                        return (
                          <div 
                            key={channel} 
                            className={`${styles.channelCard} ${isActive ? styles.channelCardActive : ''}`}
                            onClick={() => {
                              setSelectedChannels(prev => {
                                const newChannels = prev.includes(channel)
                                  ? prev.filter(c => c !== channel)
                                  : [...prev, channel];
                                
                                if (formErrors.channels && newChannels.length > 0) {
                                  setFormErrors(prevErr => {
                                    const copy = { ...prevErr };
                                    delete copy.channels;
                                    return copy;
                                  });
                                }
                                return newChannels;
                              });
                            }}
                          >
                            <input 
                              type="checkbox"
                              checked={isActive}
                              readOnly
                              className={styles.channelCheckbox}
                            />
                            <span className={styles.channelName}>{channel}</span>
                          </div>
                        );
                      })}
                    </div>
                    {formErrors.channels && <span className={styles.errorText}>{formErrors.channels}</span>}
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Create Campaign
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;

