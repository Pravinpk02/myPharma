import { useState, useEffect, useMemo, useCallback } from 'react';
import { getInventoryProducts, saveInventoryProducts } from '../../../services/inventoryService';
import type {
  InventoryProduct,
  SortColumn,
  SortDirection,
  ExpiryFilter,
  Metric
} from '../types';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>(() => getInventoryProducts());

  useEffect(() => {
    saveInventoryProducts(inventory);
  }, [inventory]);
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

  // Filter + sort logic
  const filteredAndSortedInventory = useMemo(() => {
    const now = new Date();

    let filtered = inventory.filter((product) => {
      const categoryMatch =
        selectedCategory === 'All Products' ||
        (selectedCategory === 'Critical' ? product.status === 'Critical' : product.category === selectedCategory);
      const searchMatch = !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      // Expiry filter
      let expiryMatch = true;
      if (expiryFilter !== 'all') {
        const days = Number(expiryFilter);
        const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        expiryMatch = product.expiryDate <= cutoff;
      }

      return categoryMatch && searchMatch && expiryMatch;
    });

    // Sort
    const activeSort = priceSortDir ? 'unitPrice' as SortColumn : sortColumn;
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

    return filtered;
  }, [inventory, selectedCategory, searchQuery, expiryFilter, sortColumn, sortDirection, priceSortDir]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedInventory.length / itemsPerPage), [filteredAndSortedInventory.length, itemsPerPage]);
  const paginatedInventory = useMemo(() => {
    return filteredAndSortedInventory.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredAndSortedInventory, currentPage, itemsPerPage]);

  const criticalProducts = useMemo(() => inventory.filter((p) => p.status === 'Critical'), [inventory]);

  const metrics: Metric[] = useMemo(() => [
    { label: 'Total Products', value: inventory.length.toString(), change: '↑ 124 added this month', status: 'up' },
    { label: 'In Stock', value: inventory.filter(p => p.status === 'Good').length.toString(), change: `${((inventory.filter(p => p.status === 'Good').length / inventory.length) * 100).toFixed(1)}% of total`, status: 'up' },
    { label: 'Low Stock', value: inventory.filter((p) => p.status === 'Low').length.toString(), change: 'Reorder needed', status: 'neutral' },
    { label: 'Critical / OOS', value: criticalProducts.length.toString(), change: '↑ Requires attention', status: 'down' },
    { label: 'Expiring Soon', value: inventory.filter(p => { const d = new Date(); d.setDate(d.getDate() + 60); return p.expiryDate <= d; }).length.toString(), change: 'Within 60 days', status: 'neutral' },
  ], [inventory, criticalProducts]);

  const handleReorder = useCallback((productId: string, quantity: number) => {
    setInventory(prev => prev.map(p =>
      p.id === productId
        ? { ...p, units: p.units + quantity, stock: Math.min(100, p.stock + Math.floor((quantity / (p.units || 1)) * 100)) }
        : p
    ));
  }, []);

  const handleSort = useCallback((column: SortColumn) => {
    if (column === 'unitPrice') {
      if (sortColumn === column) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
        setPriceSortDir(null);
      }
    } else {
      setPriceSortDir(null);
      if (sortColumn === column) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedProducts(prev => {
      const allSel = paginatedInventory.length > 0 && paginatedInventory.every(p => prev.has(p.id));
      const next = new Set(prev);
      if (allSel) {
        paginatedInventory.forEach(p => next.delete(p.id));
      } else {
        paginatedInventory.forEach(p => next.add(p.id));
      }
      return next;
    });
  }, [paginatedInventory]);

  const createOrder = useCallback((productId: string, quantity: number, supplier: string, deliveryDate: string) => {
    const newOrder = {
      productId,
      quantity,
      supplier,
      deliveryDate,
      id: `PO-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrderProducts(prev => [...prev, newOrder]);
    setInventory(prev => prev.map((p) => p.id === productId ? { ...p, units: p.units + quantity } : p));
  }, []);

  const allSelected = useMemo(() => {
    return paginatedInventory.length > 0 && paginatedInventory.every(p => selectedProducts.has(p.id));
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
  };
};
