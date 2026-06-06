import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from '../Inventory.module.css';
import { stockColor } from '../types';
import type { InventoryProduct } from '../types';

interface DetailPanelProps {
  product: InventoryProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onReorder: (productId: string, quantity: number) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  product,
  isOpen,
  onClose,
  onReorder,
}) => {
  const [quantity, setQuantity] = useState(2000);
  if (!product) return null;

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

  return (
    <>
      <div className={`${styles.detailOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose}></div>
      <div className={`${styles.detailPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.dpHeader}>
          <div>
            <div className={styles.dpTitle}>{product.name}</div>
            <div className={styles.dpSub}>
              {product.batch} · {product.category} · {product.supplier}
            </div>
          </div>
          <button className={styles.dpClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.dpBody}>
          <div className={styles.dpSection}>
            <div className={styles.dpSectionTitle}>Stock Status</div>
            <div className={styles.stockDisplay}>
              <div className={styles.stockNumber} style={{ color: stockColor(product.stock) }}>
                {product.stock}%
              </div>
              <div className={styles.stockUnits}>{product.units.toLocaleString()} units remaining</div>
            </div>
            <div className={styles.stockGauge}>
              <div className={styles.stockGaugeFill} style={{ width: `${product.stock}%`, background: stockColor(product.stock) }}></div>
            </div>
            <div className={styles.gaugeLabels}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className={styles.dpSection}>
            <div className={styles.dpSectionTitle}>Product Info</div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>SKU</span>
              <span className={styles.dpValue}>{product.sku}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Batch No.</span>
              <span className={styles.dpValue}>{product.batch}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Category</span>
              <span className={styles.dpValue}>{product.category}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Unit Price</span>
              <span className={`${styles.dpValue} ${styles.priceValue}`}>{product.unitPrice}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Expiry Date</span>
              <span className={`${styles.dpValue} ${getExpClass(product.expStatus)}`}>{product.expiry}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Status</span>
              <span className={`${styles.badge} ${getStatusClass(product.status)}`}>
                {product.status === 'Low' ? 'Low Stock' : product.status === 'OOS' ? 'Out of Stock' : product.status}
              </span>
            </div>
          </div>

          <div className={styles.dpSection}>
            <div className={styles.dpSectionTitle}>Supplier Info</div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Supplier</span>
              <span className={styles.dpValue}>{product.supplier}</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Lead Time</span>
              <span className={styles.dpValue}>2–3 business days</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Min. Order</span>
              <span className={styles.dpValue}>500 units</span>
            </div>
            <div className={styles.dpRow}>
              <span className={styles.dpKey}>Last Order</span>
              <span className={styles.dpValue}>{product.history[0]?.date || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.dpSection}>
            <div className={styles.dpSectionTitle}>Place Reorder</div>
            <div className={styles.reorderForm}>
              <div className={styles.rfTitle}>
                {product.status === 'Critical' ? '🚨 Urgent Reorder Required' : '📦 Reorder Stock'}
              </div>
              <div className={styles.rfRow}>
                <label className={styles.rfLabel}>Quantity (units)</label>
                <input className={styles.rfInput} type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="500" />
              </div>
              <div className={styles.rfRow}>
                <label className={styles.rfLabel}>Preferred Supplier</label>
                <input className={styles.rfInput} type="text" defaultValue={product.supplier} />
              </div>
              <div className={styles.rfRow}>
                <label className={styles.rfLabel}>Delivery Date</label>
                <input className={styles.rfInput} type="date" defaultValue="2026-06-14" />
              </div>
              <div className={styles.rfRow}>
                <label className={styles.rfLabel}>Notes</label>
                <input
                  className={styles.rfInput}
                  type="text"
                  placeholder="Priority, special instructions…"
                />
              </div>
              <button className={styles.rfSubmit} onClick={() => {
                onReorder(product.id, quantity);
                alert(`✅ Reorder placed successfully for ${product.name}!\n\nQuantity: ${quantity} units\nYou will receive a confirmation email shortly.`);
                onClose();
              }}>
                ✓ Confirm Reorder
              </button>
            </div>
          </div>

          <div className={styles.dpSection}>
            <div className={styles.dpSectionTitle}>Reorder History</div>
            {product.history.map((item, idx) => (
              <div key={idx} className={styles.historyItem}>
                <div>
                  <div className={styles.hiDate}>{item.date}</div>
                  <div className={styles.hiQty}>{item.qty}</div>
                </div>
                <div className={styles.hiCost}>{item.cost}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
