import React from 'react';
import styles from '../Inventory.module.css';
import { stockColor } from '../types';
import type { InventoryProduct, SortColumn, SortDirection } from '../types';

interface InventoryTableProps {
  products: InventoryProduct[];
  onSelectProduct: (product: InventoryProduct) => void;
  selectedProducts: Set<string>;
  onToggleProduct: (productId: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Good': return styles.bOk;
    case 'Low': return styles.bWarn;
    case 'Critical': return styles.bLow;
    default: return styles.bOos;
  }
};

const getExpClass = (status: string) => {
  switch (status) {
    case 'ok': return styles.expOk;
    case 'warn': return styles.expWarn;
    default: return styles.expLow;
  }
};

interface InventoryRowProps {
  product: InventoryProduct;
  isSelected: boolean;
  onSelectProduct: (product: InventoryProduct) => void;
  onToggleProduct: (productId: string) => void;
}

const InventoryRow = React.memo(({
  product,
  isSelected,
  onSelectProduct,
  onToggleProduct,
}: InventoryRowProps) => {
  return (
    <tr onClick={() => onSelectProduct(product)} className={isSelected ? styles.rowSelected : ''}>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className={styles.rowCheckbox}
          checked={isSelected}
          onChange={() => onToggleProduct(product.id)}
        />
      </td>
      <td>
        <div className={styles.prodName}>{product.name}</div>
        <span className={styles.prodCategory}>{product.category}</span>
      </td>
      <td>
        <div className={styles.batch}>{product.batch}</div>
        <div className={styles.sku}>{product.sku}</div>
      </td>
      <td>
        <div className={`${styles.stockValue} ${product.stock <= 20 ? styles.lowC : product.stock <= 40 ? styles.warnC : styles.okC}`}>
          {product.stock}%
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${product.stock}%`,
              background: stockColor(product.stock),
            }}
          ></div>
        </div>
      </td>
      <td style={{ fontWeight: '600' }}>{product.units.toLocaleString()}</td>
      <td style={{ fontWeight: '600', color: 'var(--g1)' }}>{product.unitPrice}</td>
      <td className={getExpClass(product.expStatus)}>{product.expiry}</td>
      <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{product.supplier}</td>
      <td>
        <span className={`${styles.badge} ${getStatusClass(product.status)}`}>
          {product.status === 'Low' ? 'Low Stock' : product.status === 'OOS' ? 'Out of Stock' : product.status}
        </span>
      </td>
      <td>
        <div className={styles.btnGroup}>
          <button
            className={`${styles.reorderBtn} ${product.status === 'Critical' ? styles.urgent : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
          >
            {product.status === 'Critical' ? '🚨' : '↻'} Reorder
          </button>
          <button className={styles.viewBtn} onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}>
            View
          </button>
        </div>
      </td>
    </tr>
  );
});

export const InventoryTable = React.memo(({
  products,
  onSelectProduct,
  selectedProducts,
  onToggleProduct,
  onToggleAll,
  allSelected,
  sortColumn,
  sortDirection,
  onSort,
}: InventoryTableProps) => {
  const sortArrow = (column: SortColumn) => {
    if (sortColumn !== column) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.invTable}>
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                className={styles.headerCheckbox}
                checked={allSelected}
                onChange={onToggleAll}
              />
            </th>
            <th onClick={() => onSort('name')} className={sortColumn === 'name' ? styles.sortActive : ''}>
              Product{sortArrow('name') && <span className={styles.sortArrow}>{sortArrow('name')}</span>}
            </th>
            <th>Batch / SKU</th>
            <th onClick={() => onSort('stock')} className={sortColumn === 'stock' ? styles.sortActive : ''}>
              Stock Level{sortArrow('stock') && <span className={styles.sortArrow}>{sortArrow('stock')}</span>}
            </th>
            <th onClick={() => onSort('units')} className={sortColumn === 'units' ? styles.sortActive : ''}>
              Units{sortArrow('units') && <span className={styles.sortArrow}>{sortArrow('units')}</span>}
            </th>
            <th onClick={() => onSort('unitPrice')} className={sortColumn === 'unitPrice' ? styles.sortActive : ''}>
              Unit Price{sortArrow('unitPrice') && <span className={styles.sortArrow}>{sortArrow('unitPrice')}</span>}
            </th>
            <th onClick={() => onSort('expiry')} className={sortColumn === 'expiry' ? styles.sortActive : ''}>
              Expiry{sortArrow('expiry') && <span className={styles.sortArrow}>{sortArrow('expiry')}</span>}
            </th>
            <th>Supplier</th>
            <th onClick={() => onSort('status')} className={sortColumn === 'status' ? styles.sortActive : ''}>
              Status{sortArrow('status') && <span className={styles.sortArrow}>{sortArrow('status')}</span>}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <InventoryRow
              key={product.id}
              product={product}
              isSelected={selectedProducts.has(product.id)}
              onSelectProduct={onSelectProduct}
              onToggleProduct={onToggleProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default InventoryTable;
