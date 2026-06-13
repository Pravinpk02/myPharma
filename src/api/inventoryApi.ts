import axiosInstance from './axiosInstance';
import type { InventoryProduct, Metric, BulkOrderRow, BulkUploadResult } from '../features/inventory/types';

export interface InventoryResponse {
  metrics: Metric[];
  data: InventoryProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface InventorySearchParams {
  category?: string;
  search?: string;
  expiryFilter?: string;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AddProductPayload {
  name: string;
  category: string;
  batch: string;
  sku: string;
  stock: number;
  units: number;
  unitPriceNum: number;
  expiryDate: string; // ISO date string e.g. YYYY-MM-DD
  supplier: string;
}

export interface ReorderPayload {
  productId: string;
  quantity: number;
  supplier: string;
  deliveryDate: string; // YYYY-MM-DD
}

export interface ReorderResponse {
  orderId: string;
  productId: string;
  newUnits: number;
  status: string;
  createdAt: string;
}

/**
 * Fetch filtered, sorted, and paginated inventory items from the backend
 */
export const getInventoryApi = async (params: InventorySearchParams): Promise<InventoryResponse> => {
  const response = await axiosInstance.get<InventoryResponse>('/inventory', { params });
  return response.data;
};

/**
 * Register a new product item in the inventory
 */
export const addInventoryProductApi = async (payload: AddProductPayload): Promise<InventoryProduct> => {
  const response = await axiosInstance.post<InventoryProduct>('/inventory', payload);
  return response.data;
};

/**
 * Reorder units for a specific product
 */
export const reorderProductApi = async (payload: ReorderPayload): Promise<ReorderResponse> => {
  const response = await axiosInstance.post<ReorderResponse>('/inventory/reorder', payload);
  return response.data;
};

/**
 * Submit a bulk batch of new products from a CSV upload.
 * Calls POST /api/inventory/bulk-add on the Spring Boot backend.
 * Falls back to localStorage if the backend is unavailable.
 */
export const bulkAddProductsApi = async (
  rows: BulkOrderRow[]
): Promise<BulkUploadResult> => {

  // ── 1. Try the real Spring Boot endpoint ──
  try {
    const response = await axiosInstance.post<BulkUploadResult>(
      '/inventory/bulk-add',
      { products: rows }
    );
    return response.data;
  } catch (err) {
    console.warn('Bulk add API unavailable — falling back to localStorage:', err);
  }

  // ── 2. localStorage Fallback ──
  const raw = localStorage.getItem('mypharma_inventory_db');
  const db: InventoryProduct[] = raw
    ? JSON.parse(raw).map((p: any) => ({
        ...p,
        expiryDate: new Date(p.expiryDate),
      }))
    : [];

  const addedProducts: BulkUploadResult['addedProducts'] = [];
  let successRows = 0;

  // Find the highest existing product ID to auto-increment
  let maxIdNum = 0;
  db.forEach((p) => {
    const match = p.id.match(/PRD-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxIdNum) maxIdNum = num;
    }
  });

  const validRows = rows.filter((r) => r.status === 'valid' || r.status === 'processing');

  for (const row of validRows) {
    maxIdNum++;
    const newId = `PRD-${String(maxIdNum).padStart(3, '0')}`;
    const unitsNum = parseInt(row.units, 10) || 0;
    const priceNum = parseFloat(row.unitPrice) || 0;
    const stockNum = parseInt(row.stock, 10) || 50;
    const expiryDate = new Date(row.expiryDate + 'T00:00:00');

    // Derive expiry display and status
    const expiryDisplay = expiryDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const now = new Date();
    const monthsUntilExpiry = (expiryDate.getFullYear() - now.getFullYear()) * 12 + (expiryDate.getMonth() - now.getMonth());
    let expStatus: InventoryProduct['expStatus'] = 'ok';
    if (monthsUntilExpiry <= 2) expStatus = 'low';
    else if (monthsUntilExpiry <= 4) expStatus = 'warn';

    let status: InventoryProduct['status'] = 'Good';
    if (stockNum === 0) status = 'OOS';
    else if (stockNum <= 20) status = 'Critical';
    else if (stockNum <= 40) status = 'Low';

    const newProduct: InventoryProduct = {
      id: newId,
      name: row.name.trim(),
      category: row.category,
      batch: row.batch.trim().toUpperCase(),
      sku: row.sku.trim().toUpperCase(),
      stock: stockNum,
      units: unitsNum,
      unitPrice: `₹${priceNum.toLocaleString('en-IN')}`,
      unitPriceNum: priceNum,
      expiry: expiryDisplay,
      expiryDate,
      expStatus,
      supplier: row.supplier,
      status,
      history: [],
    };

    db.push(newProduct);

    addedProducts.push({
      name: newProduct.name,
      category: newProduct.category,
      units: unitsNum,
      supplier: newProduct.supplier,
    });
    successRows++;
  }

  localStorage.setItem('mypharma_inventory_db', JSON.stringify(db));

  return {
    totalRows: rows.length,
    successRows,
    failedRows: rows.length - successRows,
    addedProducts,
  };
};

