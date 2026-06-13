import type { InventoryProduct } from '../features/inventory/types';
import { INVENTORY_DATA } from '../features/inventory/types';

const STORAGE_KEY = 'mypharma_inventory_db';

export const getInventoryProducts = (): InventoryProduct[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INVENTORY_DATA));
    return INVENTORY_DATA;
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map((p: any) => ({
      ...p,
      expiryDate: new Date(p.expiryDate)
    }));
  } catch {
    return INVENTORY_DATA;
  }
};

export const saveInventoryProducts = (products: InventoryProduct[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addInventoryProduct = (productData: Omit<InventoryProduct, 'id' | 'status' | 'expStatus' | 'unitPrice' | 'history'>): InventoryProduct => {
  const db = getInventoryProducts();

  let nextIdNum = 21;
  if (db.length > 0) {
    const ids = db.map(r => parseInt(r.id.replace('PRD-', ''))).filter(n => !isNaN(n));
    if (ids.length > 0) {
      nextIdNum = Math.max(...ids) + 1;
    }
  }
  const nextId = `PRD-${String(nextIdNum).padStart(3, '0')}`;

  const unitPrice = `₹${productData.unitPriceNum}`;
  
  let status: 'Good' | 'Low' | 'Critical' | 'OOS' = 'Good';
  if (productData.stock <= 0) status = 'OOS';
  else if (productData.stock <= 20) status = 'Critical';
  else if (productData.stock <= 40) status = 'Low';

  const now = new Date();
  const diffDays = Math.ceil((productData.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  let expStatus: 'ok' | 'warn' | 'low' = 'ok';
  if (diffDays <= 30) expStatus = 'low';
  else if (diffDays <= 90) expStatus = 'warn';

  const newProduct: InventoryProduct = {
    ...productData,
    id: nextId,
    unitPrice,
    status,
    expStatus,
    history: [
      {
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        qty: `${productData.units.toLocaleString()} units`,
        cost: `₹${(productData.units * productData.unitPriceNum).toLocaleString('en-IN')}`
      }
    ]
  };

  db.unshift(newProduct);
  saveInventoryProducts(db);
  return newProduct;
};
