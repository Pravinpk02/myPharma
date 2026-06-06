import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Bell, X } from 'lucide-react';
import styles from './Orders.module.css';
import type { OrderDetail } from '../../services/dashboardMockData';
import { getAllOrders, paginateData } from '../../services/dashboardMockData';
import { Paginator } from '../../components/Paginator';

const statusClasses: Record<string, string> = {
  delivered: styles.bOk,
  processing: styles.bProc,
  shipped: styles.bShip,
  pending: styles.bPend,
  cancelled: styles.bCan,
};

const statusText: Record<string, string> = {
  delivered: 'Delivered',
  processing: 'Processing',
  shipped: 'Shipped',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

// Order Row Component
const OrderRow = React.memo(({ order, onView }: { order: OrderDetail; onView: (order: OrderDetail) => void }) => {
  return (
    <tr onClick={() => onView(order)}>
      <td>
        <div className={styles.oId}>#{order.orderNumber}</div>
      </td>
      <td>
        <div className={styles.oName}>{order.customer}</div>
        <div className={styles.oCity}>{order.city}</div>
      </td>
      <td className={styles.oCat}>{order.category}</td>
      <td className={styles.oItems}>{order.items}</td>
      <td className={styles.oAmt}>{order.amount}</td>
      <td className={styles.oDate}>{order.date}</td>
      <td>
        <span className={`${styles.badge} ${statusClasses[order.status]}`}>{statusText[order.status]}</span>
      </td>
      <td>
        <div className={styles.actionBtn}>View ›</div>
      </td>
    </tr>
  );
});

// Order Detail Panel Component
const OrderDetailPanel = React.memo(({
  order,
  isOpen,
  onClose,
}: {
  order: OrderDetail | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!order) return null;

  return (
    <>
      <div
        className={`${styles.detailOverlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      ></div>
      <div className={`${styles.detailPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.dpHead}>
          <div>
            <div className={styles.dpTitle}>Order #{order.orderNumber}</div>
            <div style={{ fontSize: '12px', color: '#5F7E74', marginTop: '3px' }}>
              {order.date} · {order.customer}, {order.city}
            </div>
          </div>
          <button className={styles.dpClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.dpBody}>
          {/* Order Summary */}
          <div className={styles.dpSection}>
            <div className={styles.dpSecTitle}>Order Summary</div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Status</span>
              <span className={styles.dpVal}>
                <span
                  className={`${styles.badge} ${
                    order.status === 'delivered'
                      ? styles.bOk
                      : order.status === 'processing'
                        ? styles.bProc
                        : order.status === 'shipped'
                          ? styles.bShip
                          : order.status === 'pending'
                            ? styles.bPend
                            : styles.bCan
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Category</span>
              <span className={styles.dpVal}>{order.category}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Total Items</span>
              <span className={styles.dpVal}>{order.items} units</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>GSTIN</span>
              <span className={styles.dpVal} style={{ fontSize: '12px' }}>
                {order.gstin}
              </span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Phone</span>
              <span className={styles.dpVal}>{order.phone}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Address</span>
              <span className={styles.dpVal} style={{ textAlign: 'right', maxWidth: '200px', fontSize: '12px' }}>
                {order.address}
              </span>
            </div>
          </div>

          {/* Products */}
          <div className={styles.dpSection}>
            <div className={styles.dpSecTitle}>Products</div>
            {order.products.map((product, idx) => (
              <div key={idx} className={styles.dpProduct}>
                <div>
                  <div className={styles.dpProdName}>{product.name}</div>
                  <div className={styles.dpProdSub}>{product.qty}</div>
                </div>
                <div className={styles.dpProdAmt}>{product.amt}</div>
              </div>
            ))}
            <div className={styles.dpTotal} style={{ marginTop: '10px' }}>
              <div className={styles.dpTotalLbl}>Total Amount</div>
              <div className={styles.dpTotalVal}>{order.amount}</div>
            </div>
          </div>

          {/* Timeline */}
          <div className={styles.dpSection}>
            <div className={styles.dpSecTitle}>Order Timeline</div>
            <div className={styles.timeline}>
              {order.timeline.map((item, idx) => (
                <div key={idx} className={styles.tlItem}>
                  <div className={`${styles.tlDot} ${item.done ? styles.done : ''}`}></div>
                  <div className={styles.tlTime}>{item.time}</div>
                  <div className={styles.tlEvent}>{item.event}</div>
                  {item.sub && <div className={styles.tlSub}>{item.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// Main Orders Component
const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const allOrders = getAllOrders();
      setOrders(allOrders);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((statusKey: string) => {
    setStatusFilter(statusKey);
    setCurrentPage(1);
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customer.toLowerCase().includes(lower) ||
          order.orderNumber.toLowerCase().includes(lower) ||
          order.category.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [statusFilter, searchTerm, orders]);

  const paginatedOrders = useMemo(() => {
    return paginateData(filteredOrders, currentPage, itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleViewOrder = useCallback((order: OrderDetail) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  }, []);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      pending: orders.filter((o) => o.status === 'pending').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading orders...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Orders</div>
            <div className={styles.topbarDate}>May 2026 · {orders.length} total orders this month</div>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.tbtn}>
              <Bell size={16} />
              <span className={styles.notifDot}></span>
            </button>
            <div className={styles.topbarAv}>PR</div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          {/* Metrics */}
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <div className={styles.mic} style={{ background: 'var(--g5)', color: 'var(--g1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className={styles.mLbl}>Total Orders</div>
              <div className={styles.mVal}>{orders.length.toLocaleString()}</div>
              <div className={styles.mChg}>
                <span className={styles.up}>+48.1% vs Apr</span>
              </div>
            </div>
            <div className={styles.metric}>
                      <div className={styles.mic} style={{ background: 'var(--blue-pale)', color: 'var(--blue)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
              <div className={styles.mLbl}>Processing</div>
              <div className={styles.mVal}>{counts.processing}</div>
              <div className={styles.mChg}>
                <span className={styles.up}>In progress</span>
              </div>
            </div>
            <div className={styles.metric}>
                      <div className={styles.mic} style={{ background: 'var(--pink-pale)', color: 'var(--pink)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8l5 3-5 3V8z"/></svg>
        </div>
              <div className={styles.mLbl}>Shipped</div>
              <div className={styles.mVal}>{counts.shipped}</div>
              <div className={styles.mChg}>
                <span className={styles.up}>In transit</span>
              </div>
            </div>
            <div className={styles.metric}>
                      <div className={styles.mic} style={{ background: 'var(--g5)', color: 'var(--g1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
              <div className={styles.mLbl}>Delivered</div>
              <div className={styles.mVal}>{counts.delivered}</div>
              <div className={`${styles.mChg} ${styles.up}`}>
                68.2% success
              </div>
            </div>
            <div className={styles.metric}>
                      <div className={styles.mic} style={{ background: 'var(--red-pale)', color: 'var(--red)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
              <div className={styles.mLbl}>Cancelled</div>
              <div className={styles.mVal}>{counts.cancelled}</div>
              <div className={`${styles.mChg} ${styles.down}`}>
                +2% vs Apr
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={14} />
              <input
                type="text"
                placeholder="Search by order ID, customer, category..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className={styles.statusTabs}>
            {['all', 'Processing', 'Shipped', 'Delivered', 'Pending', 'Cancelled'].map((status) => {
              const statusKey = status.toLowerCase() as keyof typeof counts;
              return (
                <div
                  key={status}
                  className={`${styles.stab} ${statusFilter === statusKey ? styles.active : ''}`}
                  onClick={() => handleStatusFilterChange(statusKey)}
                >
                  {status === 'all' ? 'All Orders' : status}
                  <span className={styles.stabCount}>{counts[statusKey]}</span>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className={`${styles.glassCard} ${styles.cardPad}`}>
            <div className={styles.cardAccent}></div>
            <div className={styles.tableWrap}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Category</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.data.map((order) => (
                    <OrderRow key={order.id} order={order} onView={handleViewOrder} />
                  ))}
                </tbody>
              </table>
            </div>
            <Paginator
              currentPage={paginatedOrders.currentPage}
              totalPages={paginatedOrders.totalPages}
              totalItems={paginatedOrders.totalItems}
              itemsPerPage={paginatedOrders.itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </main>

      {/* Detail Panel */}
      <OrderDetailPanel order={selectedOrder} isOpen={isDetailOpen} onClose={handleCloseDetail} />
    </div>
  );
};

export default Orders;
