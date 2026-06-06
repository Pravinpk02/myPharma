import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, X, Search, Filter, Calendar, Download, Plus, DollarSign, Check, ChevronDown } from 'lucide-react';
import styles from './Inventory.module.css';

import { useInventory } from './hooks/useInventory';
import { CATEGORIES } from './types';
import MetricsRow from './components/MetricsRow';
import InventoryTable from './components/InventoryTable';
import DetailPanel from './components/DetailPanel';
import CreateOrderCard from './components/CreateOrderCard';
import SuppliersCard from './components/SuppliersCard';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const {
    inventory,
    selectedProduct,
    setSelectedProduct,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    orderProducts,
    orderFormData,
    setOrderFormData,
    alertDismissed,
    setAlertDismissed,
    sortColumn,
    sortDirection,
    selectedProducts,
    setSelectedProducts,
    expiryFilter,
    setExpiryFilter,
    priceSortDir,
    filteredAndSortedInventory,
    totalPages,
    paginatedInventory,
    criticalProducts,
    metrics,
    allSelected,
    handleReorder,
    handleSort,
    handlePriceSortToggle,
    handleToggleProduct,
    handleToggleAll,
    createOrder,
  } = useInventory();

  const itemsPerPage = 10;

  // Dropdown visibility states
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showExpiryFilter, setShowExpiryFilter] = useState(false);

  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const expiryFilterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryFilterRef.current && !categoryFilterRef.current.contains(e.target as Node)) {
        setShowCategoryFilter(false);
      }
      if (expiryFilterRef.current && !expiryFilterRef.current.contains(e.target as Node)) {
        setShowExpiryFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = () => {
    const consent = window.confirm('Do you want to download the inventory export report?');
    if (consent) {
      alert('📊 Exporting inventory to CSV file...');
    }
  };

  const handleAddProduct = () => {
    navigate('/inventory/new');
  };

  return (
    <div className={styles.container}>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Inventory Management</div>
            <div className={styles.topbarDate}>June 2026 · {inventory.length.toLocaleString()} products tracked · {criticalProducts.length} alerts active</div>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.tbtn} onClick={() => alert('🔔 Viewing system notifications...')}>
              <Bell size={16} />
              {criticalProducts.length > 0 && <span className={styles.notifDot}></span>}
            </button>
            <div className={styles.tbAv}>PR</div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Metrics */}
          <MetricsRow metrics={metrics} />

          {/* Alert Banner */}
          {criticalProducts.length > 0 && !alertDismissed && (
            <div className={styles.alertBanner}>
              <div className={styles.alertIcon}>
                <AlertTriangle size={18} color="#E24B4A" strokeWidth={2.5} />
              </div>
              <div className={styles.alertText}>
                <div className={styles.alertTitle}>🔴 {criticalProducts.length} Products Need Urgent Reorder — Stock critically low</div>
                <div className={styles.alertSub}>
                  {criticalProducts.map((p) => p.name).join(', ')}
                </div>
              </div>
              <button
                className={styles.alertAction}
                onClick={() => {
                  setSelectedCategory('Critical');
                  setCurrentPage(1);
                }}
              >
                View Critical →
              </button>
              <button className={styles.alertClose} onClick={() => setAlertDismissed(true)}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Top Row: Order Creation + Suppliers */}
          <div className={styles.topRow}>
            {/* Order Creation Card */}
            <CreateOrderCard
              inventory={inventory}
              orderProducts={orderProducts}
              orderFormData={orderFormData}
              setOrderFormData={setOrderFormData}
              createOrder={createOrder}
            />

            {/* Suppliers Card */}
            <SuppliersCard inventory={inventory} />
          </div>

          {/* Inventory Table Card */}
          <div className={`${styles.glassCard} ${styles.cardPad}`}>
            <div className={styles.cardAccent}></div>

            {/* Filters */}
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search product, batch…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Category filter dropdown */}
              <div className={styles.filterWrapper} ref={categoryFilterRef}>
                <button
                  className={`${styles.filterBtn} ${selectedCategory !== 'All Products' ? styles.filterBtnActive : ''}`}
                  onClick={() => { setShowCategoryFilter(!showCategoryFilter); setShowExpiryFilter(false); }}
                >
                  <Filter size={13} />
                  Category
                  {selectedCategory !== 'All Products' && <span>: {selectedCategory}</span>}
                  <ChevronDown size={12} />
                </button>
                {showCategoryFilter && (
                  <div className={styles.filterDropdown}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        className={`${styles.filterOption} ${selectedCategory === cat ? styles.active : ''}`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                          setShowCategoryFilter(false);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Expiry filter dropdown */}
              <div className={styles.filterWrapper} ref={expiryFilterRef}>
                <button
                  className={`${styles.filterBtn} ${expiryFilter !== 'all' ? styles.filterBtnActive : ''}`}
                  onClick={() => { setShowExpiryFilter(!showExpiryFilter); setShowCategoryFilter(false); }}
                >
                  <Calendar size={13} />
                  Expiry Date
                  {expiryFilter !== 'all' && <span>: {expiryFilter}d</span>}
                  <ChevronDown size={12} />
                </button>
                {showExpiryFilter && (
                  <div className={styles.filterDropdown}>
                    {[
                      { label: 'All Expiry Dates', value: 'all' as const },
                      { label: 'Expiring in 30 Days', value: '30' as const },
                      { label: 'Expiring in 60 Days', value: '60' as const },
                      { label: 'Expiring in 90 Days', value: '90' as const },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        className={`${styles.filterOption} ${expiryFilter === opt.value ? styles.active : ''}`}
                        onClick={() => {
                          setExpiryFilter(opt.value);
                          setCurrentPage(1);
                          setShowExpiryFilter(false);
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price sort toggle */}
              <button
                className={`${styles.filterBtn} ${priceSortDir ? styles.filterBtnActive : ''}`}
                onClick={handlePriceSortToggle}
              >
                <DollarSign size={13} />
                Unit Price {priceSortDir === 'asc' ? '↑' : priceSortDir === 'desc' ? '↓' : ''}
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button className={styles.filterBtn} onClick={handleExport}>
                  <Download size={13} />
                  Export
                </button>
                <button className={styles.addBtn} onClick={handleAddProduct}>
                  <Plus size={14} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className={styles.categoryTabs}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryTab} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </button>
              ))}
              <button
                className={`${styles.categoryTab} ${selectedCategory === 'Critical' ? styles.active : ''}`}
                style={{
                  color: selectedCategory === 'Critical' ? '#fff' : 'var(--red)',
                }}
                onClick={() => {
                  setSelectedCategory('Critical');
                  setCurrentPage(1);
                }}
              >
                🔴 Critical
              </button>
            </div>

            {/* Table */}
            <InventoryTable
              products={paginatedInventory}
              onSelectProduct={setSelectedProduct}
              selectedProducts={selectedProducts}
              onToggleProduct={handleToggleProduct}
              onToggleAll={handleToggleAll}
              allSelected={allSelected}
              sortColumn={priceSortDir ? 'unitPrice' : sortColumn}
              sortDirection={priceSortDir || sortDirection}
              onSort={handleSort}
            />

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.pageInfo}>
                Showing {filteredAndSortedInventory.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSortedInventory.length)} of {filteredAndSortedInventory.length} products
              </div>
              <div className={styles.pageButtons}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className={styles.pageBtn}>...</span>}
                {totalPages > 5 && (
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Panel */}
      <DetailPanel
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onReorder={handleReorder}
      />

      {/* Bulk Action Bar */}
      {selectedProducts.size > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkText}>
            <Check size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
          </span>
          <button className={`${styles.bulkBtn} ${styles.bulkBtnPrimary}`} onClick={() => {
            alert(`📦 Bulk reorder initiated for ${selectedProducts.size} product(s).\n\nProducts: ${Array.from(selectedProducts).map(id => inventory.find(p => p.id === id)?.name).join(', ')}`);
            setSelectedProducts(new Set());
          }}>
            📦 Bulk Reorder
          </button>
          <button className={styles.bulkBtn} onClick={() => {
            const consent = window.confirm(`Do you want to export ${selectedProducts.size} selected products to a CSV file?`);
            if (consent) {
              alert(`📊 Exporting ${selectedProducts.size} product(s) to CSV...`);
            }
            setSelectedProducts(new Set());
          }}>
            <Download size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Export Selected
          </button>
          <button className={styles.bulkClose} onClick={() => setSelectedProducts(new Set())}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
