import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getInventoryApi, reorderProductApi } from '../../../api/inventoryApi';
import { INVENTORY_DATA } from '../types';
import type {
  InventoryProduct,
  SortColumn,
  SortDirection,
  ExpiryFilter,
  Metric
} from '../types';

export const useInventory = () => {
  // Seed initial inventory from localStorage or static mock data
  const [inventory, setInventory] = useState<InventoryProduct[]>(() => {
    try {
      const data = localStorage.getItem('mypharma_inventory_db');
      if (!data) {
        localStorage.setItem('mypharma_inventory_db', JSON.stringify(INVENTORY_DATA));
        return INVENTORY_DATA.slice(0, 10);
      }
      const parsed = JSON.parse(data);
      return parsed.map((p: any) => ({ ...p, expiryDate: new Date(p.expiryDate) })).slice(0, 10);
    } catch {
      return INVENTORY_DATA.slice(0, 10);
    }
  });

  // Seed initial metrics from local data to prevent empty cards on load
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    try {
      const data = localStorage.getItem('mypharma_inventory_db');
      const db = data ? JSON.parse(data).map((p: any) => ({ ...p, expiryDate: new Date(p.expiryDate) })) : INVENTORY_DATA;
      const crit = db.filter((p: any) => p.status === 'Critical');
      return [
        { label: 'Total Products', value: db.length.toString(), change: '↑ 124 added this month', status: 'up' },
        { label: 'In Stock', value: db.filter((p: any) => p.status === 'Good').length.toString(), change: `${db.length > 0 ? ((db.filter((p: any) => p.status === 'Good').length / db.length) * 100).toFixed(1) : 0}% of total`, status: 'up' },
        { label: 'Low Stock', value: db.filter((p: any) => p.status === 'Low').length.toString(), change: 'Reorder needed', status: 'neutral' },
        { label: 'Critical / OOS', value: crit.length.toString(), change: '↑ Requires attention', status: 'down' },
        { label: 'Expiring Soon', value: db.filter((p: any) => { const d = new Date(); d.setDate(d.getDate() + 60); return p.expiryDate <= d; }).length.toString(), change: 'Within 60 days', status: 'neutral' },
      ];
    } catch {
      const db = INVENTORY_DATA;
      const crit = db.filter((p) => p.status === 'Critical');
      return [
        { label: 'Total Products', value: db.length.toString(), change: '↑ 124 added this month', status: 'up' },
        { label: 'In Stock', value: db.filter(p => p.status === 'Good').length.toString(), change: `${db.length > 0 ? ((db.filter(p => p.status === 'Good').length / db.length) * 100).toFixed(1) : 0}% of total`, status: 'up' },
        { label: 'Low Stock', value: db.filter((p) => p.status === 'Low').length.toString(), change: 'Reorder needed', status: 'neutral' },
        { label: 'Critical / OOS', value: crit.length.toString(), change: '↑ Requires attention', status: 'down' },
        { label: 'Expiring Soon', value: db.filter(p => { const d = new Date(); d.setDate(d.getDate() + 60); return p.expiryDate <= d; }).length.toString(), change: 'Within 60 days', status: 'neutral' },
      ];
    }
  });

  const [totalPages, setTotalPages] = useState(() => {
    try {
      const data = localStorage.getItem('mypharma_inventory_db');
      const count = data ? JSON.parse(data).length : INVENTORY_DATA.length;
      return Math.ceil(count / 10);
    } catch {
      return Math.ceil(INVENTORY_DATA.length / 10);
    }
  });

  const [totalItems, setTotalItems] = useState(() => {
    try {
      const data = localStorage.getItem('mypharma_inventory_db');
      return data ? JSON.parse(data).length : INVENTORY_DATA.length;
    } catch {
      return INVENTORY_DATA.length;
    }
  });

  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderProducts, setOrderProducts] = useState<Array<{ productId: string; quantity: number; supplier: string; deliveryDate: string; id: string; createdAt: string }>>([]);
  const [orderFormData, setOrderFormData] = useState({
    productId: '',
    quantity: 500,
    supplier: '',
    deliveryDate: '2026-06-10',
  });
  const itemsPerPage = 10;

  const [alertDismissed, setAlertDismissed] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>('all');
  const [priceSortDir, setPriceSortDir] = useState<SortDirection | null>(null);

  const [triggerFetch, setTriggerFetch] = useState(0);
  const location = useLocation();

  // When navigating back from BulkOrderUpdatePage with forceRefresh=true,
  // bump triggerFetch so the useEffect re-runs and fetches fresh data from the backend.
  useEffect(() => {
    if (location.state?.forceRefresh) {
      setTriggerFetch((prev) => prev + 1);
      // Clear the state so refreshes don't loop on subsequent navigations
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  // Fetch logic with remote API query and local storage query fallback
  useEffect(() => {
    let active = true;
    setLoading(true);
    getInventoryApi({
      category: selectedCategory,
      search: searchQuery,
      expiryFilter: expiryFilter,
      sortColumn: priceSortDir ? 'unitPrice' : sortColumn,
      sortDirection: priceSortDir || sortDirection,
      page: currentPage,
      limit: itemsPerPage
    })
      .then((res) => {
        if (!active) return;
        setInventory(res.data);
        setMetrics(res.metrics);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API fetch failed. Falling back to local storage query logic:', err);
        if (!active) return;

        // LOCAL FALLBACK QUERY LOGIC
        try {
          const raw = localStorage.getItem('mypharma_inventory_db');
          if (raw) {
            const db: InventoryProduct[] = JSON.parse(raw).map((p: any) => ({
              ...p,
              expiryDate: new Date(p.expiryDate)
            }));

            // Filter
            let filtered = db.filter((product) => {
              const categoryMatch =
                selectedCategory === 'All Products' ||
                (selectedCategory === 'Critical' ? product.status === 'Critical' : product.category === selectedCategory);
              const searchMatch = !searchQuery ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.supplier.toLowerCase().includes(searchQuery.toLowerCase());

              let expiryMatch = true;
              if (expiryFilter !== 'all') {
                const days = Number(expiryFilter);
                const cutoff = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
                expiryMatch = product.expiryDate <= cutoff;
              }

              return categoryMatch && searchMatch && expiryMatch;
            });

            // Sort
            const activeSort = priceSortDir ? 'unitPrice' : sortColumn;
            const activeDir = priceSortDir || sortDirection;
            if (activeSort) {
              filtered = [...filtered].sort((a, b) => {
                let cmp = 0;
                switch (activeSort) {
                  case 'name': cmp = a.name.localeCompare(b.name); break;
                  case 'stock': cmp = a.stock - b.stock; break;
                  case 'units': cmp = a.units - b.units; break;
                  case 'unitPrice': cmp = a.unitPriceNum - b.unitPriceNum; break;
                  case 'expiry': cmp = a.expiryDate.getTime() - b.expiryDate.getTime(); break;
                  case 'status': {
                    const order = { 'Critical': 0, 'OOS': 1, 'Low': 2, 'Good': 3 };
                    cmp = order[a.status] - order[b.status]; break;
                  }
                }
                return activeDir === 'asc' ? cmp : -cmp;
              });
            }

            setTotalItems(filtered.length);
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));

            // Paginate
            const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            setInventory(paginated);

            // Compute local metrics based on full DB
            const crit = db.filter((p) => p.status === 'Critical');
            const localMetrics: Metric[] = [
              { label: 'Total Products', value: db.length.toString(), change: '↑ 124 added this month', status: 'up' },
              { label: 'In Stock', value: db.filter(p => p.status === 'Good').length.toString(), change: `${db.length > 0 ? ((db.filter(p => p.status === 'Good').length / db.length) * 100).toFixed(1) : 0}% of total`, status: 'up' },
              { label: 'Low Stock', value: db.filter((p) => p.status === 'Low').length.toString(), change: 'Reorder needed', status: 'neutral' },
              { label: 'Critical / OOS', value: crit.length.toString(), change: '↑ Requires attention', status: 'down' },
              { label: 'Expiring Soon', value: db.filter(p => { const d = new Date(); d.setDate(d.getDate() + 60); return p.expiryDate <= d; }).length.toString(), change: 'Within 60 days', status: 'neutral' },
            ];
            setMetrics(localMetrics);
          }
        } catch (e) {
          console.error('Local fallback processing failed:', e);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCategory, searchQuery, expiryFilter, sortColumn, sortDirection, priceSortDir, currentPage, triggerFetch]);

  // filteredAndSortedInventory is mocked to return totalItems length so pagination labels display correctly
  const filteredAndSortedInventory = useMemo(() => {
    return {
      length: totalItems,
    } as any;
  }, [totalItems]);

  // paginatedInventory matches the current page's list
  const paginatedInventory = useMemo(() => {
    return inventory;
  }, [inventory]);

  // Read full critical products list from local DB to show accurate alert banner
  const criticalProducts = useMemo(() => {
    try {
      const raw = localStorage.getItem('mypharma_inventory_db');
      if (raw) {
        const db: InventoryProduct[] = JSON.parse(raw);
        return db.filter((p) => p.status === 'Critical');
      }
    } catch {}
    return inventory.filter((p) => p.status === 'Critical');
  }, [inventory]);

  const handleReorder = useCallback((productId: string, quantity: number) => {
    const prod = inventory.find((p) => p.id === productId);
    const supplier = prod ? prod.supplier : 'Sun Pharma';
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Default 5 days later
    const dateStr = deliveryDate.toISOString().split('T')[0];

    // Trigger API call
    reorderProductApi({
      productId,
      quantity,
      supplier,
      deliveryDate: dateStr,
    })
      .then((res) => {
        setOrderProducts((prev) => [
          ...prev,
          {
            productId: res.productId,
            quantity: res.newUnits,
            supplier,
            deliveryDate: dateStr,
            id: res.orderId,
            createdAt: res.createdAt,
          },
        ]);
        setTriggerFetch((prev) => prev + 1);
      })
      .catch((err) => {
        console.warn('Reorder API failed, performing reorder on local storage database:', err);
        // Fallback write to localStorage
        try {
          const raw = localStorage.getItem('mypharma_inventory_db');
          if (raw) {
            const db: InventoryProduct[] = JSON.parse(raw);
            const updated = db.map((p) => {
              if (p.id === productId) {
                const newUnits = p.units + quantity;
                return {
                  ...p,
                  units: newUnits,
                  stock: Math.min(100, p.stock + Math.floor((quantity / (p.units || 1)) * 100))
                };
              }
              return p;
            });
            localStorage.setItem('mypharma_inventory_db', JSON.stringify(updated));
            setTriggerFetch((prev) => prev + 1);
          }
        } catch (e) {
          console.error('Local reorder write failed:', e);
        }
      });
  }, [inventory]);

  const handleSort = useCallback((column: SortColumn) => {
    if (column === 'unitPrice') {
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(column);
        setSortDirection('asc');
        setPriceSortDir(null);
      }
    } else {
      setPriceSortDir(null);
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    }
  }, [sortColumn]);

  const handlePriceSortToggle = useCallback(() => {
    if (!priceSortDir) {
      setPriceSortDir('asc');
      setSortColumn(null);
    } else if (priceSortDir === 'asc') {
      setPriceSortDir('desc');
    } else {
      setPriceSortDir(null);
    }
    setCurrentPage(1);
  }, [priceSortDir]);

  const handleToggleProduct = useCallback((productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedProducts((prev) => {
      const allSel = paginatedInventory.length > 0 && paginatedInventory.every((p) => prev.has(p.id));
      const next = new Set(prev);
      if (allSel) {
        paginatedInventory.forEach((p) => next.delete(p.id));
      } else {
        paginatedInventory.forEach((p) => next.add(p.id));
      }
      return next;
    });
  }, [paginatedInventory]);

  const createOrder = useCallback((productId: string, quantity: number, supplier: string, deliveryDate: string) => {
    reorderProductApi({
      productId,
      quantity,
      supplier,
      deliveryDate,
    })
      .then((res) => {
        setOrderProducts((prev) => [
          ...prev,
          {
            productId: res.productId,
            quantity: res.newUnits,
            supplier,
            deliveryDate,
            id: res.orderId,
            createdAt: res.createdAt,
          },
        ]);
        setTriggerFetch((prev) => prev + 1);
      })
      .catch((err) => {
        console.warn('Reorder API failed on Order Creation, updating local storage database:', err);
        try {
          const raw = localStorage.getItem('mypharma_inventory_db');
          if (raw) {
            const db: InventoryProduct[] = JSON.parse(raw);
            const updated = db.map((p) => p.id === productId ? { ...p, units: p.units + quantity } : p);
            localStorage.setItem('mypharma_inventory_db', JSON.stringify(updated));
            setTriggerFetch((prev) => prev + 1);
          }
        } catch (e) {
          console.error('Local reorder write failed:', e);
        }
      });
  }, []);

  const allSelected = useMemo(() => {
    return paginatedInventory.length > 0 && paginatedInventory.every((p) => selectedProducts.has(p.id));
  }, [paginatedInventory, selectedProducts]);

  return {
    inventory,
    setInventory,
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
    loading,
  };
};
