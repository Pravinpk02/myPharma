import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package } from 'lucide-react';
import { addInventoryProduct } from '../../services/inventoryService';
import styles from './NewProductPage.module.css';

const CATEGORY_OPTIONS = [
  { value: 'Antibiotics', label: 'Antibiotics' },
  { value: 'Vitamins', label: 'Vitamins' },
  { value: 'Analgesics', label: 'Analgesics' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Diabetes', label: 'Diabetes' },
  { value: 'Supplements', label: 'Supplements' },
];

const SUPPLIER_OPTIONS = [
  { value: 'Sun Pharma', label: 'Sun Pharma' },
  { value: 'Cipla Ltd', label: 'Cipla Ltd' },
  { value: 'Abbott India', label: 'Abbott India' },
  { value: 'Dr. Reddy\'s', label: 'Dr. Reddy\'s' },
];

export const NewProductPage: React.FC = () => {
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Antibiotics');
  const [batch, setBatch] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('100'); // stock percentage
  const [units, setUnits] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [expiryDateStr, setExpiryDateStr] = useState('');
  const [supplier, setSupplier] = useState('Sun Pharma');
  
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format Expiry Label (e.g. "2027-04-12" -> "Apr 2027")
  const formatExpiryLabel = useCallback((dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const formErrors: Record<string, string> = {};

    const unitsNum = parseInt(units, 10);
    const priceNum = parseFloat(unitPrice);
    const stockNum = parseInt(stock, 10);

    if (!name.trim()) formErrors.name = 'Product name is required';
    if (!batch.trim()) formErrors.batch = 'Batch number is required';
    if (!sku.trim()) formErrors.sku = 'SKU code is required';
    if (isNaN(unitsNum) || unitsNum < 0) formErrors.units = 'Enter valid initial units (0 or more)';
    if (isNaN(priceNum) || priceNum <= 0) formErrors.unitPrice = 'Enter valid unit price (above 0)';
    if (!expiryDateStr) formErrors.expiryDate = 'Expiry date is required';
    if (isNaN(stockNum) || stockNum < 0 || stockNum > 100) formErrors.stock = 'Enter valid stock level (0–100)';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Call service to write to mock database
    addInventoryProduct({
      name: name.trim(),
      category,
      batch: batch.trim().toUpperCase(),
      sku: sku.trim().toUpperCase(),
      stock: stockNum,
      units: unitsNum,
      unitPriceNum: priceNum,
      expiry: formatExpiryLabel(expiryDateStr),
      expiryDate: new Date(expiryDateStr),
      supplier,
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/inventory');
    }, 1200);
  }, [name, category, batch, sku, stock, units, unitPrice, expiryDateStr, supplier, formatExpiryLabel, navigate]);

  return (
    <div className={styles.shell}>
      {/* Success Modal */}
      {success && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h2>Product Registered Successfully</h2>
            <p>The product has been logged in inventory database and is now active.</p>
            <div className={styles.successLoading}>Redirecting to Inventory...</div>
          </div>
        </div>
      )}

      <div className={styles.mainWrap}>
        {/* Header bar */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/inventory')}>
            <ArrowLeft size={16} /> Back to Inventory
          </button>
          <div className={styles.titleArea}>
            <h1 className={styles.pageTitle}>Add New Product</h1>
            <p className={styles.pageSub}>Register new pharmaceutical stock items into the central database</p>
          </div>
        </header>

        {/* Form Container */}
        <main className={styles.formContainer}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.cardHeader}>
              <Package size={20} className={styles.headerIcon} />
              <h3>Product Specifications</h3>
            </div>
            
            <div className={styles.formGrid}>
              {/* Product Name */}
              <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                <label htmlFor="productName">Product Name / Dosage Strength</label>
                <input
                  type="text"
                  id="productName"
                  placeholder="e.g. Paracetamol 650mg"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setErrors(prev => { const n = { ...prev }; delete n.name; return n; });
                  }}
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Category */}
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div className={styles.formGroup}>
                <label htmlFor="supplier">Supplier</label>
                <select
                  id="supplier"
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                >
                  {SUPPLIER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Batch Number */}
              <div className={styles.formGroup}>
                <label htmlFor="batch">Batch Number</label>
                <input
                  type="text"
                  id="batch"
                  placeholder="e.g. PAR-P302"
                  value={batch}
                  onChange={e => {
                    setBatch(e.target.value);
                    setErrors(prev => { const n = { ...prev }; delete n.batch; return n; });
                  }}
                  className={errors.batch ? styles.inputError : ''}
                />
                {errors.batch && <span className={styles.errorText}>{errors.batch}</span>}
              </div>

              {/* SKU Code */}
              <div className={styles.formGroup}>
                <label htmlFor="sku">SKU Code</label>
                <input
                  type="text"
                  id="sku"
                  placeholder="e.g. SKU-1021"
                  value={sku}
                  onChange={e => {
                    setSku(e.target.value);
                    setErrors(prev => { const n = { ...prev }; delete n.sku; return n; });
                  }}
                  className={errors.sku ? styles.inputError : ''}
                />
                {errors.sku && <span className={styles.errorText}>{errors.sku}</span>}
              </div>

              {/* Units */}
              <div className={styles.formGroup}>
                <label htmlFor="units">Initial Units in Stock</label>
                <input
                  type="number"
                  id="units"
                  placeholder="e.g. 500"
                  value={units}
                  onChange={e => {
                    setUnits(e.target.value);
                    setErrors(prev => { const n = { ...prev }; delete n.units; return n; });
                  }}
                  className={errors.units ? styles.inputError : ''}
                />
                {errors.units && <span className={styles.errorText}>{errors.units}</span>}
              </div>

              {/* Unit Price */}
              <div className={styles.formGroup}>
                <label htmlFor="unitPrice">Unit Price (₹)</label>
                <div className={styles.amountInputWrap}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    id="unitPrice"
                    placeholder="0.00"
                    value={unitPrice}
                    onChange={e => {
                      setUnitPrice(e.target.value);
                      setErrors(prev => { const n = { ...prev }; delete n.unitPrice; return n; });
                    }}
                    className={errors.unitPrice ? styles.inputError : ''}
                  />
                </div>
                {errors.unitPrice && <span className={styles.errorText}>{errors.unitPrice}</span>}
              </div>

              {/* Expiry Date */}
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDateStr}
                  onChange={e => {
                    setExpiryDateStr(e.target.value);
                    setErrors(prev => { const n = { ...prev }; delete n.expiryDate; return n; });
                  }}
                  className={errors.expiryDate ? styles.inputError : ''}
                />
                {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
              </div>

              {/* Stock Fill Percentage */}
              <div className={styles.formGroup}>
                <label htmlFor="stock">Shelf Fill / Stock Level (%)</label>
                <div className={styles.stockSliderWrap}>
                  <input
                    type="range"
                    id="stock"
                    min="0"
                    max="100"
                    value={stock}
                    onChange={e => {
                      setStock(e.target.value);
                      setErrors(prev => { const n = { ...prev }; delete n.stock; return n; });
                    }}
                    className={styles.slider}
                  />
                  <span className={styles.stockVal}>{stock}%</span>
                </div>
                {errors.stock && <span className={styles.errorText}>{errors.stock}</span>}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate('/inventory')}
                disabled={success}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={success}
              >
                Save Product
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default NewProductPage;
