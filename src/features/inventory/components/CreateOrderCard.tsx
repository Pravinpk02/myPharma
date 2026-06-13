import React from 'react';
import styles from '../Inventory.module.css';
import { SUPPLIERS } from '../types';
import type { InventoryProduct } from '../types';
import { CustomSelect } from './CustomSelect';

interface CreateOrderCardProps {
  inventory: InventoryProduct[];
  orderProducts: Array<{ productId: string; quantity: number; supplier: string; deliveryDate: string; id: string; createdAt: string }>;
  orderFormData: { productId: string; quantity: number; supplier: string; deliveryDate: string };
  setOrderFormData: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number; supplier: string; deliveryDate: string }>>;
  createOrder: (productId: string, quantity: number, supplier: string, deliveryDate: string) => void;
}

export const CreateOrderCard: React.FC<CreateOrderCardProps> = ({
  inventory,
  orderProducts,
  orderFormData,
  setOrderFormData,
  createOrder,
}) => {
  const handleCreateOrderClick = () => {
    if (!orderFormData.productId || !orderFormData.supplier) {
      alert('⚠️ Please select a product and supplier');
      return;
    }
    createOrder(
      orderFormData.productId,
      orderFormData.quantity,
      orderFormData.supplier,
      orderFormData.deliveryDate
    );
    const productName = inventory.find((p) => p.id === orderFormData.productId)?.name || orderFormData.productId;
    alert(`✅ Order created successfully!\n\nProduct: ${productName}\nQuantity: ${orderFormData.quantity} units\nSupplier: ${orderFormData.supplier}\nDelivery Date: ${orderFormData.deliveryDate}\n\nYour purchase order has been submitted to the supplier.`);
    setOrderFormData({ productId: '', quantity: 500, supplier: '', deliveryDate: '2026-06-10' });
  };

  return (
    <div className={`${styles.glassCard} ${styles.cardPad} ${styles.orderCreationCard}`}>
      <div className={styles.cardAccent}></div>
      <div className={styles.cardHead}>
        <div className={styles.orderCardTitle}>📦 Create Order</div>
        <span className={styles.newPoLabel}>New PO</span>
      </div>
      <div className={styles.orderFormContainer}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Select Product</label>
          <CustomSelect
            value={orderFormData.productId}
            onChange={(val) => setOrderFormData({ ...orderFormData, productId: val })}
            options={inventory.map((product) => ({
              value: product.id,
              label: product.name,
              subLabel: `${product.units} units in stock`,
            }))}
            placeholder="-- Select Product --"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={orderFormData.quantity}
            onChange={(e) => setOrderFormData({ ...orderFormData, quantity: Number(e.target.value) })}
            min="1"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Select Supplier</label>
          <CustomSelect
            value={orderFormData.supplier}
            onChange={(val) => setOrderFormData({ ...orderFormData, supplier: val })}
            options={SUPPLIERS.map((supplier) => ({
              value: supplier.name,
              label: supplier.name,
            }))}
            placeholder="-- Select Supplier --"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Delivery Date</label>
          <input
            type="date"
            value={orderFormData.deliveryDate}
            onChange={(e) => setOrderFormData({ ...orderFormData, deliveryDate: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <button
          onClick={handleCreateOrderClick}
          className={styles.createOrderBtn}
        >
          ✓ Create Order
        </button>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600', marginBottom: '8px' }}>
          Recent Orders
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text)' }}>
          {orderProducts.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No recent orders</div>
          ) : (
            [...orderProducts].reverse().slice(0, 5).map((o) => (
              <div key={o.id} style={{ marginBottom: '6px', padding: '6px', borderRadius: '4px', backgroundColor: 'rgba(29,158,117,0.1)' }}>
                <span style={{ fontWeight: '600' }}>{o.id}</span>
                <span style={{ color: 'var(--muted)', marginLeft: '8px', fontSize: '11px' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                  {inventory.find(p => p.id === o.productId)?.name || 'Unknown Product'} • {o.quantity} units • {o.supplier}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrderCard;
